const BASE = "/api";

export async function fetchWeights() {
  const res = await fetch(`${BASE}/weights`);
  const json = await res.json();
  return json.data;
}

export async function saveWeight(date, weight) {
  const res = await fetch(`${BASE}/weights`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, weight: Number(weight) }),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteWeight(date) {
  await fetch(`${BASE}/weights/${date}`, { method: "DELETE" });
}

export async function fetchSettings() {
  const res = await fetch(`${BASE}/settings`);
  const json = await res.json();
  return json.data;
}

export async function saveSettings(data) {
  const res = await fetch(`${BASE}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function fetchMetrics() {
  const res = await fetch(`${BASE}/metrics`);
  return res.json();
}
