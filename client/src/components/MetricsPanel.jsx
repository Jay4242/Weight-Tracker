import { useState, useEffect, useCallback } from "react";
import { fetchMetrics } from "../api";

export default function MetricsPanel({ refreshKey }) {
  const [metrics, setMetrics] = useState(null);

  const load = useCallback(async () => {
    const m = await fetchMetrics();
    setMetrics(m);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load, refreshKey]);

  if (!metrics || metrics.currentWeight == null) {
    return (
      <div className="metrics-panel card">
        <h2>Metrics</h2>
        <p className="empty">No weight data yet. Add an entry to see metrics.</p>
      </div>
    );
  }

  return (
    <div className="metrics-panel card">
      <h2>Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-item">
          <span className="metric-label">BMR</span>
          <span className="metric-value">{metrics.bmr.toFixed(2)} kcal</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">TDEE</span>
          <span className="metric-value">{metrics.tdee.toFixed(2)} kcal</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Daily Calories</span>
          <span className="metric-value">{metrics.dailyCalories.toFixed(2)} kcal</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Target Calories</span>
          <span className="metric-value">{metrics.calorieTarget} kcal</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Deficit</span>
          <span className="metric-value">{metrics.deficit >= 0 ? "+" : ""}{metrics.deficit.toFixed(2)} kcal</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Lbs to Goal</span>
          <span className="metric-value">{metrics.lbsLeft?.toFixed(2)} lbs</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Est. Days</span>
          <span className="metric-value">
            {metrics.daysLeft === Infinity ? "∞" : metrics.daysLeft.toFixed(2)}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Est. Months</span>
          <span className="metric-value">
            {metrics.monthsLeft === Infinity ? "∞" : metrics.monthsLeft.toFixed(2)}
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Lbs / Day</span>
          <span className="metric-value">{metrics.poundsPerDay?.toFixed(2)}</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Days / Lb</span>
          <span className="metric-value">
            {metrics.daysPerPound === Infinity ? "∞" : metrics.daysPerPound.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
