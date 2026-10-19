const path = require("node:path");

const ROOT_DIR = path.resolve(__dirname, "../..");

module.exports = {
  rootDir: ROOT_DIR,
  configPath: path.join(ROOT_DIR, "config", "interfaces.json"),
  devicesPath: path.join(ROOT_DIR, "config", "devices.json"),
  dataDir: path.join(ROOT_DIR, "data"),
  statePath: path.join(ROOT_DIR, "data", "device-state.json"),
  auditPath: path.join(ROOT_DIR, "data", "audit-log.json")
};
