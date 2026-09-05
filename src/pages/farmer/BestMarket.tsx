import React, { useState } from "react";
import {
  Card,
  Button,
  Badge,
  DataSourceTag,
} from "../../components/ui";
import { fetchMarketPrices } from "../../services/api";

type MarketPrice = {
  id: number;
  state: string | null;
  district: string | null;
  market: string;
  crop: string;
  variety: string | null;
  grade: string | null;
  arrival_date: string | null;
  min_price: string | number | null;
  max_price: string | number | null;
  modal_price: string | number | null;
  unit: string;
  source: string;
  last_fetched: string;
};

type MarketResult = MarketPrice & {
  distance_km: number;
  duration_minutes: number;
  transport_cost: number;
  net: number;
  recommended: boolean;
  reason: string;
};

type RouteResponse = {
  ok: boolean;
  distance_km?: number;
  duration_minutes?: number;
  error?: string;
};

const TRANSPORT_RATE_PER_KM_PER_QUINTAL = 6;

/*
 * AGMARKNET sometimes uses different commodity names
 * from the names shown in our UI.
 */
const CROP_ALIASES: Record<string, string[]> = {
  Tomato: [
    "Tomato",
  ],

  Onion: [
    "Onion",
  ],

  Potato: [
    "Potato",
  ],

  Chilli: [
    "Chilli",
    "Chillies",
    "Dry Chilli",
    "Dry Chillies",
    "Dry Chili",
    "Dry Chilies",
  ],

  Rice: [
    "Rice",
  ],

  Wheat: [
    "Wheat",
  ],

  Maize: [
    "Maize",
    "Corn",
  ],

  Turmeric: [
    "Turmeric",
  ],

  Banana: [
    "Banana",
  ],

  Mango: [
    "Mango",
  ],
};

/*
 * Clean market names before sending them
 * to the backend geocoder.
 */
function cleanMarketName(name: string) {
  return name
    .replace(/\bAPMC\b/gi, "")
    .replace(/\bSub[- ]?yard\b/gi, "")
    .replace(/\bAMC\b/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/,\s*,/g, ",")
    .replace(/^,\s*/, "")
    .replace(/,\s*$/, "");
}

/*
 * Create a geocoder-friendly market location.
 */
function buildMarketLocation(
  market: MarketPrice
) {
  const cleanMarket =
    cleanMarketName(
      market.market
    );

  return [
    cleanMarket,
    market.district,
    market.state,
    "India",
  ]
    .filter(Boolean)
    .join(", ");
}

/*
 * Call our backend route API.
 *
 * React
 *   ↓
 * AgriLink backend
 *   ↓
 * Nominatim
 *   ↓
 * OSRM
 *   ↓
 * Real road distance
 */
async function getBackendRoute(
  origin: string,
  destination: string
): Promise<RouteResponse> {
  const params =
    new URLSearchParams({
      origin,
      destination,
    });

  const response =
    await fetch(
      `http://localhost:5000/api/route?${params.toString()}`
    );

  const data =
    await response.json();

  if (
    !response.ok ||
    !data.ok
  ) {
    throw new Error(
      data.error ||
        "Unable to calculate road route."
    );
  }

  return data;
}

/*
 * Transport estimate per quintal.
 *
 * ₹6 × road distance
 */
function getTransportCost(
  distanceKm: number
) {
  return Math.round(
    distanceKm *
      TRANSPORT_RATE_PER_KM_PER_QUINTAL
  );
}

export default function BestMarket() {
  const [searched, setSearched] =
    useState(false);

  const [showWhy, setShowWhy] =
    useState<string | null>(null);

  const [crop, setCrop] =
    useState("Tomato");

  const [qty, setQty] =
    useState("500");

  const [location, setLocation] =
    useState("Kolar, Karnataka");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [markets, setMarkets] =
    useState<MarketResult[]>([]);

  /*
   * Open real Google Maps.
   */
  function getDirections(
    market: MarketResult
  ) {
    const origin =
      encodeURIComponent(
        location.trim()
      );

    const destination =
      encodeURIComponent(
        buildMarketLocation(
          market
        )
      );

    const mapsUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${origin}` +
      `&destination=${destination}` +
      `&travelmode=driving`;

    window.open(
      mapsUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function findBestMarket() {
    try {
      setLoading(true);
      setError("");
      setShowWhy(null);
      setMarkets([]);
      setSearched(false);

      const quantityKg =
        Number(qty);

      if (!location.trim()) {
        throw new Error(
          "Please enter your location."
        );
      }

      if (
        !quantityKg ||
        quantityKg <= 0
      ) {
        throw new Error(
          "Please enter a valid quantity."
        );
      }

      /*
       * --------------------------------
       * 1. Get crop search terms
       * --------------------------------
       */
      const searchTerms =
        CROP_ALIASES[crop] || [
          crop,
        ];

      /*
       * --------------------------------
       * 2. Search market data
       *
       * IMPORTANT:
       * No state restriction here.
       * --------------------------------
       */
      const priceResponses =
        await Promise.all(
          searchTerms.map(
            (term) =>
              fetchMarketPrices({
                crop: term,
                limit: 500,
              })
          )
        );

      /*
       * Combine all results.
       */
      const allPrices =
        priceResponses.flat() as MarketPrice[];

      /*
       * --------------------------------
       * 3. Remove duplicates
       * --------------------------------
       */
      const uniqueMap =
        new Map<
          string,
          MarketPrice
        >();

      for (
        const item of allPrices
      ) {
        const key = [
          item.id,
          item.market,
          item.crop,
          item.variety || "",
          item.arrival_date || "",
        ].join("|");

        if (
          !uniqueMap.has(key)
        ) {
          uniqueMap.set(
            key,
            item
          );
        }
      }

      const prices =
        Array.from(
          uniqueMap.values()
        );

      /*
       * --------------------------------
       * 4. Strict crop validation
       * --------------------------------
       */
      const aliases =
        CROP_ALIASES[crop] || [
          crop,
        ];

      const cropPrices =
        prices.filter(
          (item) => {
            const commodity =
              String(
                item.crop || ""
              )
                .trim()
                .toLowerCase();

            return aliases.some(
              (alias) => {
                const cleanAlias =
                  alias
                    .trim()
                    .toLowerCase();

                return (
                  commodity ===
                    cleanAlias ||
                  commodity.includes(
                    cleanAlias
                  )
                );
              }
            );
          }
        );

      if (
        cropPrices.length === 0
      ) {
        setMarkets([]);
        setSearched(true);

        setError(
          `No ${crop} market prices were found in the available AGMARKNET data.`
        );

        return;
      }

      /*
       * --------------------------------
       * 5. One record per mandi
       *
       * Keep highest modal price.
       * --------------------------------
       */
      const marketMap =
        new Map<
          string,
          MarketPrice
        >();

      for (
        const item of cropPrices
      ) {
        if (
          item.modal_price ===
            null ||
          item.modal_price ===
            undefined
        ) {
          continue;
        }

        const key = [
          item.market,
          item.district || "",
          item.state || "",
        ]
          .join("|")
          .toLowerCase();

        const existing =
          marketMap.get(key);

        if (
          !existing ||
          Number(
            item.modal_price || 0
          ) >
            Number(
              existing.modal_price ||
                0
            )
        ) {
          marketMap.set(
            key,
            item
          );
        }
      }

      /*
       * --------------------------------
       * 6. Shortlist highest-price
       * markets before routing.
       *
       * This prevents hundreds of
       * routing requests.
       * --------------------------------
       */
      const shortlistedMarkets =
        Array.from(
          marketMap.values()
        )
          .sort(
            (a, b) =>
              Number(
                b.modal_price || 0
              ) -
              Number(
                a.modal_price || 0
              )
          )
          .slice(0, 20);

      /*
       * --------------------------------
       * 7. Real road routing
       * --------------------------------
       */
      const results: MarketResult[] =
        [];

      const batchSize = 3;

      for (
        let i = 0;
        i <
        shortlistedMarkets.length;
        i += batchSize
      ) {
        const batch =
          shortlistedMarkets.slice(
            i,
            i + batchSize
          );

        const batchResults =
          await Promise.all(
            batch.map(
              async (item) => {
                try {
                  const destination =
                    buildMarketLocation(
                      item
                    );

                  const route =
                    await getBackendRoute(
                      location.trim(),
                      destination
                    );

                  if (
                    !route.ok ||
                    typeof route.distance_km !==
                      "number"
                  ) {
                    return null;
                  }

                  const distance =
                    route.distance_km;

                  const duration =
                    typeof route.duration_minutes ===
                    "number"
                      ? route.duration_minutes
                      : 0;

                  const marketPrice =
                    Number(
                      item.modal_price ||
                        0
                    );

                  /*
                   * Transport cost
                   * per quintal.
                   */
                  const transportCost =
                    getTransportCost(
                      distance
                    );

                  /*
                   * Net realization
                   * per quintal.
                   */
                  const net =
                    marketPrice -
                    transportCost;

                  const result: MarketResult =
                    {
                      ...item,

                      distance_km:
                        distance,

                      duration_minutes:
                        duration,

                      transport_cost:
                        transportCost,

                      net,

                      recommended:
                        false,

                      reason: "",
                    };

                  return result;
                } catch (
                  routeError
                ) {
                  console.warn(
                    `Could not route to ${item.market}:`,
                    routeError
                  );

                  return null;
                }
              }
            )
          );

        for (
          const result of
            batchResults
        ) {
          if (
            result !== null
          ) {
            results.push(
              result
            );
          }
        }
      }

      /*
       * --------------------------------
       * 8. Rank by estimated net
       * realization.
       * --------------------------------
       */
      const topMarkets =
        results
          .sort(
            (a, b) =>
              b.net - a.net
          )
          .slice(0, 5)
          .map(
            (
              market,
              index
            ) => ({
              ...market,

              recommended:
                index === 0,

              reason:
                index === 0
                  ? "Highest estimated net realization using current market price and real road distance."
                  : "Strong estimated net realization using current market price and real road distance.",
            })
          );

      setMarkets(
        topMarkets
      );

      setSearched(true);

      if (
        topMarkets.length === 0
      ) {
        setError(
          "Market prices were found, but no road routes could be calculated. Try entering a more specific location such as your village or town."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to calculate the best market. Please try again."
      );

      setMarkets([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">

      {/* HEADER */}

      <div>
        <h1 className="font-serif text-3xl text-[var(--foreground)]">
          Best Market Finder
        </h1>

        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Compare available mandi prices to estimate your best
          net realization
        </p>
      </div>

      {/* INPUT CARD */}

      <Card className="p-5">

        <h2 className="text-base font-semibold text-[var(--foreground)] mb-4">
          Find Best Market
        </h2>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">

          {/* CROP */}

          <div>
            <label className="text-sm font-medium text-[var(--foreground)] block mb-1">
              Crop *
            </label>

            <select
              value={crop}
              onChange={(e) =>
                setCrop(
                  e.target.value
                )
              }
              className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              {[
                "Tomato",
                "Onion",
                "Potato",
                "Chilli",
                "Rice",
                "Wheat",
                "Maize",
                "Turmeric",
                "Banana",
                "Mango",
              ].map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>
          </div>

          {/* QUANTITY */}

          <div>
            <label className="text-sm font-medium text-[var(--foreground)] block mb-1">
              Quantity (kg) *
            </label>

            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) =>
                setQty(
                  e.target.value
                )
              }
              placeholder="500"
              className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          {/* LOCATION */}

          <div>
            <label className="text-sm font-medium text-[var(--foreground)] block mb-1">
              Your Location
            </label>

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              placeholder="Village / Town, District, State"
              className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

        </div>

        <Button
          size="lg"
          fullWidth
          onClick={
            findBestMarket
          }
          disabled={loading}
        >
          {loading
            ? "🔄 Finding Best Market..."
            : "🎯 Find Best Market"}
        </Button>

      </Card>

      {/* ERROR */}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {searched && (
        <>

          <DataSourceTag />

          {/* INFORMATION */}

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">

            <strong>
              Important:
            </strong>{" "}

            Market prices are the latest available
            AGMARKNET data stored by AgriLink.

            {" "}

            Road distances are calculated using
            real road routing.

            {" "}

            Transport cost is an indicative estimate;
            actual transporter charges, quality deductions,
            commissions and final sale prices may differ.

          </div>

          {/* CALCULATION */}

          <Card className="p-4 bg-[var(--muted)]">

            <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--muted-foreground)]">

              <span className="font-medium text-[var(--foreground)]">
                How it's calculated:
              </span>

              <span>
                Current Market Price
              </span>

              <span>
                −
              </span>

              <span>
                Real Road Transport Cost
              </span>

              <span>
                =
              </span>

              <span className="font-semibold text-[var(--foreground)]">
                Estimated Net Realization
              </span>

            </div>

          </Card>

          {/* NO RESULTS */}

          {!loading &&
            markets.length === 0 && (
              <Card className="p-8 text-center">

                <p className="font-semibold text-[var(--foreground)]">
                  No market data found
                </p>

                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Try another crop or a more specific location.
                </p>

              </Card>
            )}

          {/* RESULTS */}

          <div className="space-y-4">

            {markets.map(
              (market) => (

                <Card
                  key={`${market.id}-${market.market}-${market.state || ""}`}
                  className={`p-5 ${
                    market.recommended
                      ? "border-[var(--green-mid)] border-2"
                      : ""
                  }`}
                >

                  {/* RECOMMENDED */}

                  {market.recommended && (

                    <div className="flex items-center gap-2 mb-3 bg-[var(--green-pale)] rounded-xl px-3 py-2">

                      <span className="text-[var(--green-mid)]">
                        ⭐
                      </span>

                      <span className="text-sm font-semibold text-[var(--green-mid)]">
                        Recommended Market
                      </span>

                    </div>

                  )}

                  {/* MARKET NAME */}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                      <h3 className="font-semibold text-[var(--foreground)] text-base">
                        {market.market}
                      </h3>

                      <p className="text-sm text-[var(--muted-foreground)]">
                        📍 {market.distance_km} km
                        by road from {location}
                      </p>

                      {market.duration_minutes > 0 && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          ⏱️ Approx.{" "}
                          {market.duration_minutes} min
                          driving
                        </p>
                      )}

                      {market.district && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          {market.district},{" "}
                          {market.state}
                        </p>
                      )}

                    </div>

                    <div className="flex items-center gap-2">

                      {market.recommended && (
                        <Badge variant="success">
                          Best Net Realization
                        </Badge>
                      )}

                      <button
                        onClick={() =>
                          setShowWhy(
                            showWhy ===
                              String(
                                market.id
                              )
                              ? null
                              : String(
                                  market.id
                                )
                          )
                        }
                        className="text-xs text-[var(--ai-color)] hover:underline font-medium"
                      >
                        Why this market?
                      </button>

                    </div>

                  </div>

                  {/* PRICE GRID */}

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">

                    {/* PRICE */}

                    <div className="bg-white border border-[var(--border)] rounded-xl p-3 text-center">

                      <div className="font-mono font-bold text-sm text-[var(--foreground)]">
                        ₹
                        {Number(
                          market.modal_price ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)]">
                        /quintal
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        Market Price
                      </div>

                    </div>

                    {/* DISTANCE */}

                    <div className="bg-white border border-[var(--border)] rounded-xl p-3 text-center">

                      <div className="font-mono font-bold text-sm text-[var(--foreground)]">
                        {market.distance_km}
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)]">
                        km
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        Road Distance
                      </div>

                    </div>

                    {/* TRANSPORT */}

                    <div className="bg-orange-50 border border-[var(--border)] rounded-xl p-3 text-center">

                      <div className="font-mono font-bold text-sm text-[var(--foreground)]">
                        ₹
                        {market.transport_cost.toLocaleString(
                          "en-IN"
                        )}
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)]">
                        /quintal
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        Est. Transport
                      </div>

                    </div>

                    {/* NET */}

                    <div
                      className={`border border-[var(--border)] rounded-xl p-3 text-center ${
                        market.recommended
                          ? "bg-[var(--green-pale)]"
                          : "bg-white"
                      }`}
                    >

                      <div
                        className={`font-mono font-bold text-sm ${
                          market.recommended
                            ? "text-[var(--green-mid)]"
                            : "text-[var(--foreground)]"
                        }`}
                      >
                        ₹
                        {Math.round(
                          market.net
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)]">
                        /quintal
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        Est. Net
                      </div>

                    </div>

                    {/* DATE */}

                    <div className="bg-[var(--muted)] border border-[var(--border)] rounded-xl p-3 text-center">

                      <div className="font-mono text-sm text-[var(--muted-foreground)]">
                        {market.arrival_date ||
                          "N/A"}
                      </div>

                      <div className="text-xs text-[var(--muted-foreground)]">
                        Data Date
                      </div>

                    </div>

                  </div>

                  {/* WHY */}

                  {showWhy ===
                    String(
                      market.id
                    ) && (

                    <div className="mt-4 bg-[var(--ai-bg)] border border-indigo-200 rounded-xl p-4 fade-in-up">

                      <div className="flex items-center gap-2 mb-3">

                        <span className="text-[var(--ai-color)]">
                          ✦
                        </span>

                        <span className="text-sm font-semibold text-[var(--ai-color)]">
                          Transparent Calculation
                        </span>

                      </div>

                      <div className="text-sm space-y-2">

                        <div className="flex justify-between">

                          <span className="text-[var(--muted-foreground)]">
                            Market price
                          </span>

                          <span className="font-mono font-semibold">
                            ₹
                            {Number(
                              market.modal_price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                            /quintal
                          </span>

                        </div>

                        <div className="flex justify-between">

                          <span className="text-[var(--muted-foreground)]">
                            Real road distance
                          </span>

                          <span className="font-mono">
                            {market.distance_km} km
                          </span>

                        </div>

                        <div className="flex justify-between">

                          <span className="text-[var(--muted-foreground)]">
                            Est. transport cost
                          </span>

                          <span className="font-mono text-orange-600">
                            − ₹
                            {market.transport_cost.toLocaleString(
                              "en-IN"
                            )}
                            /quintal
                          </span>

                        </div>

                        <div className="border-t border-indigo-200 pt-2 flex justify-between font-semibold">

                          <span className="text-[var(--foreground)]">
                            Est. Net Realization
                          </span>

                          <span className="font-mono text-[var(--green-mid)]">
                            = ₹
                            {Math.round(
                              market.net
                            ).toLocaleString(
                              "en-IN"
                            )}
                            /quintal
                          </span>

                        </div>

                      </div>

                      <p className="text-xs text-[var(--muted-foreground)] mt-3">
                        Road distance is calculated using
                        the AgriLink backend routing service.
                        Transport cost is an indicative estimate,
                        not a guaranteed transporter quotation,
                        selling price or profit.
                      </p>

                    </div>

                  )}

                  {/* BUTTONS */}

                  <div className="flex gap-2 mt-4">

                    <Button
                      variant="primary"
                      size="sm"
                    >
                      Sell Here
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        getDirections(
                          market
                        )
                      }
                    >
                      🗺️ Get Directions
                    </Button>

                  </div>

                </Card>

              )
            )}

          </div>

          {/* SOURCE */}

          <div className="flex items-center justify-between">

            <Badge variant="success">
              Real AGMARKNET Data
            </Badge>

            <DataSourceTag />

          </div>

        </>
      )}

    </div>
  );
}