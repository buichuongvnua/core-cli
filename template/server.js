require("dotenv").config();
const app = require("./app");
const logger = require("./helpers/logger");
const { PORT } = require("./config");
const server = require("http").createServer(app);

server.listen(PORT, function () {
  logger.info("start server at port " + PORT + " at:" + new Date());
});
