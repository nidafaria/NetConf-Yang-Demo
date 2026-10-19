const fs = require("node:fs");
const settings = require("./config/settings");
const logger = require("./utils/logger");
const { applyConfiguration } = require("./services/configuration-service");

async function run() {
  console.log("\n=== Mock YANG / NETCONF Controller: Phase 1 ===");
  console.log("Device: olt-lab-01 (simulated; no real device connection)\n");

  if (!fs.existsSync(settings.configPath)) {
    throw new Error(`Configuration file not found: ${settings.configPath}`);
  }

  const result = await applyConfiguration();

  if (!result.success) {
    logger.error("Configuration was not applied", result);
    process.exitCode = 1;
    return;
  }

  console.log("\n=== Final simulated device state ===");
  console.log(JSON.stringify(result.appliedConfig, null, 2));
  console.log("\n[NOTE] This is a mock NETCONF workflow; no real device was contacted.\n");
}

module.exports = { run };
