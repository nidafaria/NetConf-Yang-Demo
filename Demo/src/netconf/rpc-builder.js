const { escapeXml } = require("../utils/xml");

const NETCONF_BASE_NS = "urn:ietf:params:xml:ns:netconf:base:1.0";
const MODEL_NS = "urn:example:interface-config";

function buildEditConfigRpc(config, messageId = "101") {
  const entries = config.interfaces.interface.map((intf) => {
    const mtu = intf.mtu === undefined ? 1500 : intf.mtu;

    return `
        <interface>
          <name>${escapeXml(intf.name)}</name>
          <enabled>${intf.enabled}</enabled>
          <mtu>${mtu}</mtu>
        </interface>`;
  }).join("");

  return `<rpc message-id="${escapeXml(messageId)}" xmlns="${NETCONF_BASE_NS}">
  <edit-config>
    <target><running/></target>
    <config>
      <interfaces xmlns="${MODEL_NS}">${entries}
      </interfaces>
    </config>
  </edit-config>
</rpc>`;
}

module.exports = { buildEditConfigRpc };
