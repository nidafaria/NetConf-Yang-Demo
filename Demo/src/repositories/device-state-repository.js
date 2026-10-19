const fs = require("node:fs");
const path = require("node:path");
const settings = require("../config/settings");

function ensureDataDir() {
  fs.mkdirSync(settings.dataDir, { recursive: true });
}

function readState() {
  ensureDataDir();

  if (!fs.existsSync(settings.statePath)) {
    return {};
  }

  return JSON.parse(fs.readFileSync(settings.statePath, "utf8"));
}

function writeDeviceConfig(deviceId, config) {
  ensureDataDir();
  const state = readState();
  state[deviceId] = {
    updatedAt: new Date().toISOString(),
    configuration: config
  };
  fs.writeFileSync(settings.statePath, JSON.stringify(state, null, 2) + "\n");
  return state[deviceId];
}

function readDeviceConfig(deviceId) {
  const state = readState();
  return state[deviceId] || null;
}

module.exports = { writeDeviceConfig, readDeviceConfig };
