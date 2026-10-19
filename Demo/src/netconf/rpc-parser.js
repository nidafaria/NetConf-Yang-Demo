const { unescapeXml } = require("../utils/xml");

function readTag(xml, tagName) {
  const escapedName = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<${escapedName}(?:\\s[^>]*)?>([\\s\\S]*?)</${escapedName}>`, "i");
  const match = xml.match(pattern);
  return match ? unescapeXml(match[1].trim()) : undefined;
}

module.exports = { readTag };
