const express = require("express");
const cors = require("cors");
const path = require("path");

const weightsRouter = require("./routes/weights");
const settingsRouter = require("./routes/settings");
const metricsRouter = require("./routes/metrics");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/weights", weightsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/metrics", metricsRouter);

const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
