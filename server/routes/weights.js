const { Router } = require("express");
const { getDb } = require("../db");

const router = Router();

function getLocalCutoff(timeZone) {
  const now = new Date();
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone })
    .format(now)
    .split("-")
    .map(Number);
  const cutoff = new Date(Date.UTC(y, m - 1, d));
  cutoff.setUTCDate(cutoff.getUTCDate() - 31);
  return cutoff.toISOString().slice(0, 10);
}

router.get("/", (_req, res) => {
  const db = getDb();
  const settings = db.prepare("SELECT timezone FROM settings WHERE id = 1").get();
  const cutoff = getLocalCutoff(settings.timezone || "UTC");
  const rows = db
    .prepare(
      "SELECT date, weight FROM weight_entries WHERE date >= ? ORDER BY date ASC"
    )
    .all(cutoff);
  res.json({ data: rows });
});

router.post("/", (req, res) => {
  const { date, weight } = req.body;
  if (!date || weight == null) {
    return res.status(400).json({ error: "date and weight are required" });
  }
  const db = getDb();
  db.prepare(
    "INSERT INTO weight_entries (date, weight) VALUES (?, ?) ON CONFLICT(date) DO UPDATE SET weight = excluded.weight"
  ).run(date, weight);

  const settings = db.prepare("SELECT timezone FROM settings WHERE id = 1").get();
  const cutoff = getLocalCutoff(settings.timezone || "UTC");
  db.prepare(
    "DELETE FROM weight_entries WHERE date < ?"
  ).run(cutoff);

  const row = db
    .prepare("SELECT date, weight FROM weight_entries WHERE date = ?")
    .get(date);
  res.json({ data: row });
});

router.delete("/:date", (req, res) => {
  const db = getDb();
  db.prepare("DELETE FROM weight_entries WHERE date = ?").run(req.params.date);
  res.json({ success: true });
});

module.exports = router;
