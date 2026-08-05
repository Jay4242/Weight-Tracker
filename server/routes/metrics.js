const { Router } = require("express");
const { getDb } = require("../db");

const router = Router();

function lbsToKg(lbs) {
  return lbs / 2.205;
}

function inchesToCm(inches) {
  return inches * 2.54;
}

router.get("/", (_req, res) => {
  const db = getDb();

  const settings = db.prepare("SELECT * FROM settings WHERE id = 1").get();
  const entries = db
    .prepare(
      "SELECT date, weight FROM weight_entries ORDER BY date DESC LIMIT 7"
    )
    .all();

  if (entries.length === 0) {
    return res.json({
      currentWeight: null,
      avg7Day: null,
      bmr: null,
      tdee: null,
      dailyCalories: null,
      deficit: null,
      lbsLeft: null,
      daysLeft: null,
      monthsLeft: null,
    });
  }

  const currentWeight = entries[0].weight;
  const avg7Day =
    entries.reduce((sum, e) => sum + e.weight, 0) / entries.length;

  const effectiveWeight = settings.use_avg_weight ? avg7Day : currentWeight;

  const wtKg = lbsToKg(effectiveWeight);
  const htCm = inchesToCm(settings.height_inches);
  const bmr = 10 * wtKg + 6.25 * htCm - 5 * settings.age_years + 5;
  const tdee = bmr * settings.tdee_factor;
  const deficit = tdee - settings.calorie_target;
  const lbsLeft = effectiveWeight - settings.goal_weight;
  const daysLeft = deficit > 0 ? (lbsLeft * 3500) / deficit : Infinity;
  const monthsLeft = daysLeft / 30;
  const poundsPerDay = deficit > 0 ? deficit / 3500 : 0;
  const daysPerPound = deficit > 0 ? 3500 / deficit : Infinity;

  res.json({
    currentWeight,
    avg7Day,
    bmr,
    tdee,
    dailyCalories: tdee,
    calorieTarget: settings.calorie_target,
    deficit,
    lbsLeft,
    daysLeft: daysLeft === Infinity ? Infinity : Math.round(daysLeft * 100) / 100,
    monthsLeft: monthsLeft === Infinity ? Infinity : Math.round(monthsLeft * 100) / 100,
    poundsPerDay: Math.round(poundsPerDay * 100) / 100,
    daysPerPound: daysPerPound === Infinity ? Infinity : Math.round(daysPerPound * 100) / 100,
  });
});

module.exports = router;
