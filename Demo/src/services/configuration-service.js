const fs = require("node:fs");
const settings = require("../config/settings");
const logger = require("../utils/logger");
const { validateInterfaceConfiguration } = require("../validators/config-validator");
const { buildEditConfigRpc } = require("../netconf/rpc-builder");
const { MockNetconfServer } = require("../netconf/mock-netconf-server");
const { readDeviceConfig } = require("../repositories/device-state-repository");
const { appendAuditEvent } = require("../repositories/audit-repository");

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

async function applyConfiguration(deviceId = "olt-lab-01") {
  const config = loadJson(settings.configPath);
  logger.info("Configuration loaded", { path: settings.configPath });

  const errors = validateInterfaceConfiguration(config);
  if (errors.length > 0) {
    appendAuditEvent({ deviceId, operation: "edit-config", result: "validation-failed", errors });
    return { success: false, stage: "validation", errors };
  }
  logger.info("Configuration validation passed");

  const rpc = buildEditConfigRpc(config);
  logger.info("Built NETCONF edit-config RPC");

  const server = new MockNetconfServer(deviceId);
  const result = await server.handleRpc(rpc);

  if (!result.success) {
    appendAuditEvent({ deviceId, operation: "edit-config", result: "server-rejected" });
    return { ...result, stage: "server" };
  }

  logger.info("NETCONF RPC succeeded", { response: result.response });
  return {
    success: true,
    deviceId,
    response: result.response,
    appliedConfig: readDeviceConfig(deviceId)
  };
}

module.exports = { applyConfiguration };
