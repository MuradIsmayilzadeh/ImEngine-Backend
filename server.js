const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 8000;
const pluginsFilePath = path.join(__dirname, "plugins.json");

// === File helpers ===
const readPlugins = () => {
  try {
    return JSON.parse(fs.readFileSync(pluginsFilePath, "utf8"));
  } catch (err) {
    console.error("Error reading plugins file:", err.message);
    return [];
  }
};
const writePlugins = (plugins) => fs.writeFileSync(pluginsFilePath, JSON.stringify(plugins, null, 2), "utf8");
const nextId = (plugins) => plugins.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;

// === ROUTES ===
app.get("/health", (req, res) => res.json({ ok: true, plugins: readPlugins().length }));

app.get("/plugins", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  const plugins = readPlugins();
  res.json(q ? plugins.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(q)) : plugins);
});

app.get("/plugins/:id", (req, res) => {
  const plugin = readPlugins().find((p) => String(p.id) === req.params.id);
  if (!plugin) return res.status(404).json({ message: "Plugin not found" });
  res.json(plugin);
});

app.post("/plugins", (req, res) => {
  const { name, description = "", version = "1.0.0" } = req.body || {};
  if (!name || typeof name !== "string") return res.status(400).json({ message: "Plugin name is required" });
  if (!/^\d+\.\d+\.\d+$/.test(version)) return res.status(400).json({ message: "Version must look like 1.2.3" });
  const plugins = readPlugins();
  const plugin = { id: nextId(plugins), name: name.trim(), description: String(description).trim(), version };
  plugins.push(plugin);
  writePlugins(plugins);
  res.status(201).json(plugin);
});

app.delete("/plugins/:id", (req, res) => {
  const plugins = readPlugins();
  const index = plugins.findIndex((p) => String(p.id) === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Plugin not found" });
  plugins.splice(index, 1);
  writePlugins(plugins);
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Plugin server running on http://localhost:${PORT}`));
