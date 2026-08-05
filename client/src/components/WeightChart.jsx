import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchWeights } from "../api";

function fmtDate(d) {
  const parts = d.split("-");
  return `${parts[1]}/${parts[2]}`;
}

function padData(entries) {
  const today = new Date();
  const dates = [];
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const weightMap = {};
  for (const e of entries) {
    weightMap[e.date] = e.weight;
  }

  return dates.map((date, idx, arr) => {
    const weight = weightMap[date] ?? null;
    const window = entries.filter((e) => e.date <= date).slice(-7);
    const avg =
      window.length > 0
        ? window.reduce((s, e) => s + e.weight, 0) / window.length
        : null;
    return { date: date, displayDate: fmtDate(date), weight, avg7Day: avg ? +avg.toFixed(1) : null };
  });
}

function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

export default function WeightChart({ refreshKey }) {
  const [data, setData] = useState(() => padData([]));
  const dark = getTheme() === "dark";

  useEffect(() => {
    async function load() {
      const entries = await fetchWeights();
      setData(padData(entries));
    }
    load();

    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [refreshKey]);

  const allWeights = data
    .filter((d) => d.weight != null)
    .map((d) => d.weight);
  const allAvgs = data
    .filter((d) => d.avg7Day != null)
    .map((d) => d.avg7Day);
  const allVals = [...allWeights, ...allAvgs];
  const yMin = allVals.length > 0 ? Math.floor(Math.min(...allVals) - 5) : 140;
  const yMax = allVals.length > 0 ? Math.ceil(Math.max(...allVals) + 5) : 200;

  return (
    <div className="weight-chart card">
      <h2>31-Day Weight Chart</h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#475569" : "#e2e8f0"} />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 11, fill: dark ? "#94a3b8" : "#475569" }}
            interval={4}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 12, fill: dark ? "#94a3b8" : "#475569" }}
          />
          <Tooltip
            contentStyle={{
              background: dark ? "#1e293b" : "#fff",
              border: `1px solid ${dark ? "#334155" : "#e2e8f0"}`,
              borderRadius: "6px",
              color: dark ? "#e2e8f0" : "#1e293b",
            }}
          />
          <Legend
            wrapperStyle={{ color: dark ? "#cbd5e1" : undefined }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#3b82f4"
            strokeWidth={2}
            dot={{ r: 3, fill: "#3b82f4" }}
            name="Weight"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="avg7Day"
            stroke="#f87171"
            strokeWidth={2}
            strokeDasharray="8 4"
            dot={false}
            name="7-Day Avg"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
