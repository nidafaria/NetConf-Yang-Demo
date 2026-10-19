const { run } = require("./src/app");
const logger = require("./src/utils/logger");

run().catch((error) => {
  logger.error("Application failed", { message: error.message });
  process.exitCode = 1;
});
