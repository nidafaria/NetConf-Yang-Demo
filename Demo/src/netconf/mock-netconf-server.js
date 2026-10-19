const { readTag } = require("./rpc-parser");
const { writeDeviceConfig } = require("../repositories/device-state-repository");
const { appendAuditEvent } = require("../repositories/audit-repository");
const logger = require("../utils/logger");

class MockNetconfServer {
  constructor(deviceId) {
    this.deviceId = deviceId;
  }

  async handleRpc(rpcXml) {
    logger.info("Mock NETCONF server received an RPC", { deviceId: this.deviceId });

    if (!rpcXml.includes("<edit-config>") || !rpcXml.includes("<config>")) {
      return {
        success: false,
        response: '<rpc-reply><rpc-error><error-tag>operation-not-supported</error-tag><error-message>Expected edit-config RPC</error-message></rpc-error></rpc-reply>'
      };
    }

    // This educational mock extracts values from the known RPC shape.
    // A production server uses a proper XML parser and NETCONF implementation.
    const interfaces = [];
    const blocks = [...rpcXml.matchAll(/<interface>([\s\S]*?)<\/interface>/g)];

    for (const block of blocks) {
      const body = block[1];
      const name = readTag(body, "name");
      const enabledText = readTag(body, "enabled");
      const mtuText = readTag(body, "mtu");

      if (!name || !["true", "false"].includes(enabledText) ||
          !mtuText || !Number.isInteger(Number(mtuText))) {
        return {
          success: false,
          response: '<rpc-reply><rpc-error><error-tag>invalid-value</error-tag><error-message>Malformed interface configuration</error-message></rpc-error></rpc-reply>'
        };
      }

      interfaces.push({
        name,
        enabled: enabledText === "true",
        mtu: Number(mtuText)
      });
    }

    if (interfaces.length === 0) {
      return {
        success: false,
        response: '<rpc-reply><rpc-error><error-tag>invalid-value</error-tag><error-message>No interfaces supplied</error-message></rpc-error></rpc-reply>'
      };
    }

    const config = { interfaces: { interface: interfaces } };
    writeDeviceConfig(this.deviceId, config);
    appendAuditEvent({
      deviceId: this.deviceId,
      operation: "edit-config",
      result: "success",
      interfaceCount: interfaces.length
    });

    return {
      success: true,
      response: '<rpc-reply><ok/></rpc-reply>',
      appliedConfig: config
    };
  }
}

module.exports = { MockNetconfServer };
