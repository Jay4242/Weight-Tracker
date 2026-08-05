import { useState, useCallback, useEffect } from "react";
import WeightForm from "./WeightForm";
import WeightChart from "./WeightChart";
import MetricsPanel from "./MetricsPanel";
import { fetchSettings, saveSettings } from "../api";

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [useAvgWeight, setUseAvgWeight] = useState(false);

  useEffect(() => {
    fetchSettings().then((s) => setUseAvgWeight(s.use_avg_weight));
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  async function handleToggle(checked) {
    setUseAvgWeight(checked);
    await saveSettings({ use_avg_weight: checked });
    triggerRefresh();
  }

  return (
    <div className="dashboard">
      <div className="dashboard-left">
        <WeightForm onDataChanged={triggerRefresh} />
        <WeightChart refreshKey={refreshKey} />
      </div>
      <div className="dashboard-right">
        <MetricsPanel refreshKey={refreshKey} />
        <div className="dashboard-toggle card">
          <div className="toggle-info">
            <span className="toggle-current">
              Stats based on: <strong>{useAvgWeight ? "7-Day Avg" : "Current Weight"}</strong>
            </span>
            <button
              className="toggle-btn"
              onClick={() => handleToggle(!useAvgWeight)}
            >
              {useAvgWeight ? "Current" : "7-Day"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
