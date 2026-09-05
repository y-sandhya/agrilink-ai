import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cron from "node-cron";
import marketRoutes from "./routes/marketRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import { testDb } from "./config/db.js";
import { syncMarketData } from "./services/marketData.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    await testDb();
    res.json({ ok: true, database: "connected", time: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ ok: false, database: "disconnected", error: error.message });
  }
});

app.use("/api", marketRoutes);
app.use("/api", routeRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`AgriLink backend running on http://localhost:${port}`);
});

const cronExpression = process.env.MARKET_SYNC_CRON || "30 18 * * *";
const timezone = process.env.MARKET_SYNC_TZ || "Asia/Kolkata";

cron.schedule(cronExpression, async () => {
  console.log("Starting scheduled market sync...");
  try {
    const result = await syncMarketData();
    console.log("Scheduled market sync complete:", result);
  } catch (error) {
    console.error("Scheduled market sync failed:", error);
  }
}, { timezone });
