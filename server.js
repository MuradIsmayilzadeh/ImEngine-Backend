const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// === File path for plugins ===
const pluginsFilePath = 'plugins.json';

// === File helpers ===
const readPluginsFile = () => {
  try {
    const data = fs.readFileSync(pluginsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading plugins file:', err);
    return [];
  }
};

const writePluginsFile = (plugins) => {
  try {
    fs.writeFileSync(pluginsFilePath, JSON.stringify(plugins, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing plugins file:', err);
  }
};

// === ROUTES ===

// Get all plugins
app.get('/plugins', (req, res) => {
  const plugins = readPluginsFile();
  res.json(plugins);
});

// Get plugin by ID (optional, by index)
app.get('/plugins/:id', (req, res) => {
  const plugins = readPluginsFile();
  const id = parseInt(req.params.id);
  if (id >= 0 && id < plugins.length) {
    res.json(plugins[id]);
  } else {
    res.status(404).send('Plugin not found');
  }
});

// Add a new plugin
app.post('/plugins', (req, res) => {
  const newPlugin = req.body;
  const plugins = readPluginsFile();
  newPlugin.id = plugins.length;
  plugins.push(newPlugin);
  writePluginsFile(plugins);
  res.status(201).json(newPlugin);
});

// Delete a plugin by ID
app.delete('/plugins/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const plugins = readPluginsFile();
  if (id >= 0 && id < plugins.length) {
    plugins.splice(id, 1);
    writePluginsFile(plugins);
    res.sendStatus(200);
  } else {
    res.status(404).send('Plugin not found');
  }
});

// === Start server ===
app.listen(8000, () => {
  console.log('✅ Plugin server running on port 8000');
});
