import dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();

const BASE_URL =
  process.env.AGMARKNET_BASE_URL ||
  "https://api.agmarknet.gov.in/v1";

const HEADERS = {
  Accept: "application/json, text/plain, */*",
  Origin: "https://agmarknet.gov.in",
  Referer: "https://agmarknet.gov.in/",
  "User-Agent": "Mozilla/5.0",
};

/* ----------------------------------------
   AGMARKNET GET REQUEST
----------------------------------------- */

async function agmarknetGet(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);

  for (const [key, value] of Object.entries(params)) {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: HEADERS,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `AGMARKNET request failed: ${response.status} ${text.slice(
        0,
        500
      )}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("AGMARKNET returned invalid JSON");
  }
}

/* ----------------------------------------
   GET ID
----------------------------------------- */

function getId(record) {
  const possibleKeys = [
    "cmdt_id",
    "commodity_id",
    "commodityId",
    "state_id",
    "stateId",
    "id",
  ];

  for (const key of possibleKeys) {
    if (
      record &&
      Object.prototype.hasOwnProperty.call(record, key) &&
      record[key] !== null &&
      record[key] !== undefined &&
      record[key] !== ""
    ) {
      return record[key];
    }
  }

  return null;
}

/* ----------------------------------------
   STATE NAME
----------------------------------------- */

function getStateName(record) {
  return (
    record?.state_name ||
    record?.stateName ||
    record?.state ||
    record?.name ||
    record?.label ||
    ""
  );
}

/* ----------------------------------------
   INDIA DATE
----------------------------------------- */

function getIndiaDate(offsetDays = 0) {
  const now = new Date();

  const indiaDateString = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const date = new Date(`${indiaDateString}T00:00:00+05:30`);

  date.setDate(date.getDate() + offsetDays);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/* ----------------------------------------
   GET ALL AGMARKNET STATES
----------------------------------------- */

export async function getAgmarknetStates() {
  const filters = await agmarknetGet(
    "/daily-price-arrival/filters"
  );

  const stateData = filters?.data?.state_data;

  if (!Array.isArray(stateData)) {
    throw new Error(
      "AGMARKNET state_data was not found"
    );
  }

  const states = [];

  for (const record of stateData) {
    const name = getStateName(record);
    const id = getId(record);

    if (!name || !id) {
      continue;
    }

    const lowerName = String(name).toLowerCase();

    // Ignore aggregate entry
    if (
      lowerName.includes("all states") ||
      lowerName.includes("all states/uts")
    ) {
      continue;
    }

    states.push({
      id,
      name,
    });
  }

  // Remove duplicate state IDs
  const uniqueStates = [];
  const seenIds = new Set();

  for (const state of states) {
    const key = String(state.id);

    if (seenIds.has(key)) {
      continue;
    }

    seenIds.add(key);
    uniqueStates.push(state);
  }

  return uniqueStates;
}

/* ----------------------------------------
   EXTRACT PRICE RECORDS
----------------------------------------- */

function extractRows(
  priceData,
  stateName,
  arrivalDate
) {
  const rows = [];

  for (const group of priceData?.commodityGroups || []) {
    for (const commodity of group?.commodities || []) {
      const commodityName =
        commodity?.commodityName;

      if (!commodityName) {
        continue;
      }

      for (const market of commodity?.markets || []) {
        const marketName =
          market?.marketCenter;

        if (!marketName) {
          continue;
        }

        for (const record of market?.data || []) {
          rows.push({
            state: stateName,
            district: null,
            market: marketName,
            commodity: commodityName,

            variety:
              record?.variety ?? null,

            grade: null,

            arrival_date: arrivalDate,

            min_price:
              record?.minimumPrice ?? null,

            max_price:
              record?.maximumPrice ?? null,

            modal_price:
              record?.modalPrice ?? null,

            source: "AGMARKNET",

            fetched_at: new Date(),
          });
        }
      }
    }
  }

  return rows;
}

/* ----------------------------------------
   FETCH STATE FOR A SPECIFIC DATE
----------------------------------------- */

async function fetchStatePricesForDate(
  state,
  arrivalDate
) {
  const priceData = await agmarknetGet(
    "/prices-and-arrivals/commodity-market/daily-report-state",
    {
      date: arrivalDate,
      state: state.id,
      includeExcel: "false",
    }
  );

  return extractRows(
    priceData,
    state.name,
    arrivalDate
  );
}

/* ----------------------------------------
   FETCH STATE
   Automatically finds latest available date
----------------------------------------- */

async function fetchStatePrices(state) {
  /*
     AGMARKNET may not have today's report
     immediately.

     Try:
       0 = today
       -1 = yesterday
       -2 = day before yesterday
       -3 = three days ago
       -4 = four days ago
       -5 = five days ago
       -6 = six days ago
       -7 = seven days ago
  */

  for (let offset = 0; offset >= -7; offset--) {
    const arrivalDate = getIndiaDate(offset);

    try {
      console.log(
        `   Trying ${state.name} → ${arrivalDate}`
      );

      const rows =
        await fetchStatePricesForDate(
          state,
          arrivalDate
        );

      if (rows.length > 0) {
        console.log(
          `   ✓ Data found: ${rows.length} records on ${arrivalDate}`
        );

        return rows;
      }

      console.log(
        `   - No data for ${arrivalDate}`
      );
    } catch (error) {
      console.log(
        `   - ${arrivalDate} failed: ${error.message}`
      );
    }
  }

  return [];
}

/* ----------------------------------------
   SAVE STATE DATA
----------------------------------------- */

async function saveRows(rows) {
  if (!rows.length) {
    return 0;
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const state = rows[0].state;
    const arrivalDate = rows[0].arrival_date;

    /*
       Delete previous sync for the same
       state and date.
    */

    await connection.execute(
      `
        DELETE FROM market_prices
        WHERE state = ?
        AND arrival_date = ?
      `,
      [
        state,
        arrivalDate,
      ]
    );

    const sql = `
      INSERT INTO market_prices (
        state,
        district,
        market,
        commodity,
        variety,
        grade,
        arrival_date,
        min_price,
        max_price,
        modal_price,
        source,
        fetched_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const row of rows) {
      await connection.execute(
        sql,
        [
          row.state,
          row.district,
          row.market,
          row.commodity,
          row.variety,
          row.grade,
          row.arrival_date,
          row.min_price,
          row.max_price,
          row.modal_price,
          row.source,
          row.fetched_at,
        ]
      );
    }

    await connection.commit();

    return rows.length;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/* ----------------------------------------
   SYNC ALL STATES
----------------------------------------- */

export async function syncMarketData() {
  console.log("");
  console.log(
    "=========================================="
  );
  console.log(
    "       AGRILINK AGMARKNET SYNC"
  );
  console.log(
    "=========================================="
  );

  const today = getIndiaDate();

  console.log(
    `Starting from date: ${today}`
  );

  const states =
    await getAgmarknetStates();

  console.log(
    `States found: ${states.length}`
  );

  console.log("");

  const results = [];

  let totalFetched = 0;
  let totalUpserted = 0;

  for (const state of states) {
    console.log(
      `Fetching ${state.name} | ID: ${state.id}`
    );

    try {
      const rows =
        await fetchStatePrices(state);

      let saved = 0;

      if (rows.length > 0) {
        saved = await saveRows(rows);
      }

      totalFetched += rows.length;
      totalUpserted += saved;

      results.push({
        state: state.name,
        state_id: state.id,
        fetched: rows.length,
        upserted: saved,
        arrival_date:
          rows[0]?.arrival_date || null,
      });

      console.log(
        `✓ ${state.name}: ${rows.length} records`
      );
    } catch (error) {
      console.log(
        `✗ ${state.name}: ${error.message}`
      );

      results.push({
        state: state.name,
        state_id: state.id,
        fetched: 0,
        upserted: 0,
        error: error.message,
      });
    }
  }

  console.log("");

  console.log(
    "=========================================="
  );

  console.log(
    `TOTAL FETCHED: ${totalFetched}`
  );

  console.log(
    `TOTAL SAVED: ${totalUpserted}`
  );

  console.log(
    "=========================================="
  );

  return {
    ok: true,

    mode: "all-india",

    states_attempted:
      states.length,

    fetched:
      totalFetched,

    upserted:
      totalUpserted,

    starting_date:
      today,

    states:
      results,

    synced_at:
      new Date().toISOString(),
  };
}

/* ----------------------------------------
   GET MARKET PRICES
   Used by React frontend
----------------------------------------- */

export async function getMarketPrices({
  crop,
  state,
  district,
  market,
  limit = 100,
} = {}) {
  let sql = `
    SELECT
      id,
      state,
      district,
      market,
      commodity AS crop,
      variety,
      grade,
      arrival_date,
      min_price,
      max_price,
      modal_price,
      '₹/quintal' AS unit,
      source,
      fetched_at AS last_fetched
    FROM market_prices
    WHERE 1 = 1
  `;

  const params = [];

  if (crop) {
    sql += `
      AND commodity LIKE ?
    `;

    params.push(`%${crop}%`);
  }

  if (state) {
    sql += `
      AND state = ?
    `;

    params.push(state);
  }

  if (district) {
    sql += `
      AND district = ?
    `;

    params.push(district);
  }

  if (market) {
    sql += `
      AND market LIKE ?
    `;

    params.push(`%${market}%`);
  }

  sql += `
    ORDER BY
      arrival_date DESC,
      modal_price DESC
    LIMIT ?
  `;

  params.push(
    Math.min(Number(limit) || 100, 500)
  );

  const [rows] =
    await pool.execute(
      sql,
      params
    );

  return rows;
}