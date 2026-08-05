const { Router } = require("express");
const { getDb } = require("../db");

const router = Router();

const FIELDS = [
  "height_inches",
  "age_years",
  "goal_weight",
  "tdee_factor",
  "calorie_target",
  "use_avg_weight",
];

router.get("/", (_req, res) => {
  const db = getDb();
  const row = db.prepare("SELECT * FROM settings WHERE id = 1").get();
  const { id, ...data } = row;
  data.use_avg_weight = !!data.use_avg_weight;
  res.json({ data });
});

router.put("/", (req, res) => {
  const db = getDb();
  const updates = {};
  for (const field of FIELDS) {
    if (req.body[field] != null) {
      updates[field] = field === "use_avg_weight" ? (req.body[field] ? 1 : 0) : req.body[field];
    }
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "no valid fields provided" });
  }
  const setClauses = Object.keys(updates)
    .map((f) => `${f} = @${f}`)
    .join(", ");
  db.prepare(`UPDATE settings SET ${setClauses} WHERE id = 1`).run(updates);

  const row = db.prepare("SELECT * FROM settings WHERE id = 1").get();
  const { id, ...data } = row;
  data.use_avg_weight = !!data.use_avg_weight;
  res.json({ data });
});

module.exports = router;
