import { useState, useEffect, useCallback } from "react";
import { fetchWeights, deleteWeight } from "../api";

function fmtDate(d) {
  const parts = d.split("-");
  return `${parts[1]}/${parts[2]}`;
}

function compute7DayAvg(entries, idx) {
  const window = entries.slice(Math.max(0, idx - 6), idx + 1);
  return window.reduce((s, e) => s + e.weight, 0) / window.length;
}

export default function HistoryTable() {
  const [entries, setEntries] = useState([]);

  const load = useCallback(async () => {
    const data = await fetchWeights();
    setEntries(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(date) {
    await deleteWeight(date);
    load();
  }

  if (entries.length === 0) {
    return (
      <div className="history-table card">
        <h2>History</h2>
        <p className="empty">No entries yet.</p>
      </div>
    );
  }

  return (
    <div className="history-table card">
      <h2>History (last 31 days)</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Weight</th>
              <th>7-Day Avg</th>
              <th>Difference</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...entries].reverse().map((e, idx) => {
              const avg = compute7DayAvg(entries, entries.length - 1 - idx);
              const diff = avg - e.weight;
              return (
                <tr key={e.date}>
                  <td>{fmtDate(e.date)}</td>
                  <td>{e.weight} lbs</td>
                  <td>{avg.toFixed(1)}</td>
                  <td>{diff >= 0 ? "+" : ""}{diff.toFixed(1)}</td>
                  <td>
                    <button
                      className="danger-btn"
                      onClick={() => handleDelete(e.date)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
