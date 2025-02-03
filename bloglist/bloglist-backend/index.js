const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

console.log("Environment:", process.env.NODE_ENV);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
