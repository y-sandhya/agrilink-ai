import dotenv from "dotenv";
import { syncMarketData } from "../services/marketData.js";
import { pool } from "../config/db.js";

dotenv.config();

try {
  const result = await syncMarketData();
  console.log("Market sync complete:", result);
} catch (error) {
  console.error("Market sync failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
