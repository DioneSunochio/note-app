const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const emmiteEvents = async (message, logFileName) => {
  const logItem = `${new Date()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (error) {
    console.error(error);
  }
};

const logger = (req, res, next) => {
  emmiteEvents(
    `${req.method}\t${req.url}\t${req.headers.origin}`,
    "reqLogs.log"
  );
  next();
};

module.exports = { emmiteEvents, logger };
