import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import SettingsForm from "./components/SettingsForm";
import HistoryTable from "./components/HistoryTable";

function getInitialTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="app">
      <nav className="nav">
        <h1>Weight Tracker</h1>
        <div className="nav-links">
          <button
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={page === "settings" ? "active" : ""}
            onClick={() => setPage("settings")}
          >
            Settings
          </button>
          <button
            className={page === "history" ? "active" : ""}
            onClick={() => setPage("history")}
          >
            History
          </button>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle dark mode">
            {theme === "light" ? "\u263D" : "\u2600"}
          </button>
        </div>
      </nav>
      <main>
        {page === "dashboard" && <Dashboard />}
        {page === "settings" && <SettingsForm />}
        {page === "history" && <HistoryTable />}
      </main>
    </div>
  );
}
