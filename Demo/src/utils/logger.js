function write(level, message, details) {
  const timestamp = new Date().toISOString();
  const extra = details === undefined ? "" : ` ${JSON.stringify(details)}`;
  console.log(`[${timestamp}] [${level}] ${message}${extra}`);
}

module.exports = {
  info: (message, details) => write("INFO", message, details),
  warn: (message, details) => write("WARN", message, details),
  error: (message, details) => write("ERROR", message, details)
};
