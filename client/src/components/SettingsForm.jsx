import { useState, useEffect } from "react";
import { fetchSettings, saveSettings } from "../api";
import { getBrowserTimezone } from "../utils";

const FALLBACK_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "America/Vancouver",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "America/Argentina/Buenos_Aires",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Moscow",
  "Europe/Istanbul",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "UTC",
];

function getTimezoneList() {
  try {
    return Intl.supportedValuesOf("timeZone");
  } catch {
    return FALLBACK_TIMEZONES;
  }
}

export default function SettingsForm() {
  const [settings, setSettings] = useState({
    height_inches: 74,
    age_years: 40,
    goal_weight: 165,
    tdee_factor: 1.3,
    calorie_target: 1600,
    timezone: getBrowserTimezone(),
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  function handleChange(field, value) {
    setSettings((prev) => ({
      ...prev,
      [field]:
        field === "timezone"
          ? value
          : field === "tdee_factor" || field === "height_inches" || field === "goal_weight"
            ? parseFloat(value) || 0
            : parseInt(value, 10) || 0,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    await saveSettings(settings);
    setMsg("Settings saved!");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div className="settings-form card">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="settings-grid">
          <label>
            Height (inches)
            <input
              type="number"
              step="0.1"
              value={settings.height_inches}
              onChange={(e) => handleChange("height_inches", e.target.value)}
            />
          </label>
          <label>
            Age (years)
            <input
              type="number"
              value={settings.age_years}
              onChange={(e) => handleChange("age_years", e.target.value)}
            />
          </label>
          <label>
            Goal Weight (lbs)
            <input
              type="number"
              step="0.1"
              value={settings.goal_weight}
              onChange={(e) => handleChange("goal_weight", e.target.value)}
            />
          </label>
          <label>
            TDEE Factor
            <input
              type="number"
              step="0.1"
              min="0.8"
              max="2.5"
              value={settings.tdee_factor}
              onChange={(e) => handleChange("tdee_factor", e.target.value)}
            />
          </label>
          <label>
            Calorie Target (kcal/day)
            <input
              type="number"
              value={settings.calorie_target}
              onChange={(e) => handleChange("calorie_target", e.target.value)}
            />
          </label>
          <label>
            Timezone
            <input
              type="text"
              list="timezone-list"
              value={settings.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              placeholder="America/New_York"
            />
            <datalist id="timezone-list">
              {getTimezoneList().map((tz) => (
                <option key={tz} value={tz} />
              ))}
            </datalist>
          </label>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {msg && <span className="success-msg">{msg}</span>}
      </form>
    </div>
  );
}
