export function requireSyncSecret(req, res, next) {
  const expected = process.env.SYNC_SECRET;
  const provided = req.get("x-sync-secret");

  if (!expected || !provided || provided !== expected) {
    return res.status(401).json({ error: "Unauthorized sync request" });
  }

  next();
}
