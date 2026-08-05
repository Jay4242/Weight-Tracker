import { useState, useEffect, useCallback } from "react";
import { saveWeight, fetchWeights, fetchMetrics } from "../api";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function WeightForm({ onDataChanged }) {
  const [date, setDate] = useState(todayStr());
  const [weight, setWeight] = useState("");
  const [saving, setSaving] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const loadMetrics = useCallback(async () => {
    const m = await fetchMetrics();
    setMetrics(m);
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [loadMetrics]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!date || !weight) return;
    setSaving(true);
    await saveWeight(date, weight);
    setWeight("");
    await loadMetrics();
    onDataChanged?.();
    setSaving(false);
  }

  const diff =
    metrics?.currentWeight != null && metrics?.avg7Day != null
      ? (metrics.avg7Day - metrics.currentWeight).toFixed(1)
      : null;

  return (
    <div className="weight-form card">
      <h2>Today&apos;s Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Weight (lbs)
            <input
              type="number"
              step="0.1"
              min="50"
              max="600"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="180.0"
            />
          </label>
          <button type="submit" disabled={saving || !date || !weight}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
      <div className="quick-stats">
        <div className="stat">
          <span className="stat-label">Current</span>
          <span className="stat-value">
            {metrics?.currentWeight?.toFixed(1) ?? "--"} lbs
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">7-Day Avg</span>
          <span className="stat-value">
            {metrics?.avg7Day?.toFixed(1) ?? "--"} lbs
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Diff</span>
          <span className="stat-value">
            {diff != null ? `${diff} lbs` : "--"}
          </span>
        </div>
      </div>
    </div>
  );
}
