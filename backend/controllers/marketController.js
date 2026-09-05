import { getMarketPrices, syncMarketData } from "../services/marketData.js";

export async function listMarketPrices(req, res) {
  try {
    const rows = await getMarketPrices(req.query);
    res.json({
      source: "Agmarknet / data.gov.in",
      unit: "₹/quintal",
      count: rows.length,
      records: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to load market prices" });
  }
}

export async function runMarketSync(req, res) {
  try {
    const result = await syncMarketData();
    res.json({ ok: true, ...result, synced_at: new Date().toISOString() });
  } catch (error) {
    console.error(error);
    res.status(502).json({ ok: false, error: error.message });
  }
}
