const fs = require("node:fs");
const settings = require("../config/settings");

function appendAuditEvent(event) {
  fs.mkdirSync(settings.dataDir, { recursive: true });

  let events = [];
  if (fs.existsSync(settings.auditPath)) {
    try {
      events = JSON.parse(fs.readFileSync(settings.auditPath, "utf8"));
      if (!Array.isArray(events)) events = [];
    } catch {
      events = [];
    }
  }

  events.push({
    timestamp: new Date().toISOString(),
    ...event
  });

  fs.writeFileSync(settings.auditPath, JSON.stringify(events, null, 2) + "\n");
}

module.exports = { appendAuditEvent };
