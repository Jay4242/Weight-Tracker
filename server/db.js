const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "weight-tracker.db");

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      height_inches REAL NOT NULL DEFAULT 74,
      age_years INTEGER NOT NULL DEFAULT 40,
      goal_weight REAL NOT NULL DEFAULT 165,
      tdee_factor REAL NOT NULL DEFAULT 1.3,
      calorie_target INTEGER NOT NULL DEFAULT 1600,
      use_avg_weight INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS weight_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      weight REAL NOT NULL
    );
  `);

  const row = db.prepare("SELECT COUNT(*) AS cnt FROM settings").get();
  if (row.cnt === 0) {
    db.prepare(
      "INSERT INTO settings (id, height_inches, age_years, goal_weight, tdee_factor, calorie_target) VALUES (1, 74, 40, 165, 1.3, 1600)"
    ).run();
  }

  const hasUseAvgWeight = db
    .prepare("PRAGMA table_info(settings)")
    .all()
    .some((c) => c.name === "use_avg_weight");
  if (!hasUseAvgWeight) {
    db.prepare("ALTER TABLE settings ADD COLUMN use_avg_weight INTEGER NOT NULL DEFAULT 0").run();
  }
}

module.exports = { getDb };
