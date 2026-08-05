const { Router } = require("express");
const { getDb } = require("../db");

const router = Router();

router.get("/", (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT date, weight FROM weight_entries WHERE date >= date('now', '-31 days') ORDER BY date ASC"
    )
    .all();
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

  db.prepare(
    "DELETE FROM weight_entries WHERE date < date('now', '-31 days')"
  ).run();

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
