import { Router } from "express";
import { listMarketPrices, runMarketSync } from "../controllers/marketController.js";
import { requireSyncSecret } from "../middleware/syncAuth.js";

const router = Router();

router.get("/market-prices", listMarketPrices);
router.post("/market-prices/sync", requireSyncSecret, runMarketSync);

export default router;
