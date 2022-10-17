const { emmiteEvents } = require("./emmiteEvents");

const errorHandler = (err, req, res, next) => {
  emmiteEvents(
    `Status:${res.statusCode}\t${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLogs.log"
  );

  const status = res.statusCode && res.statusCode > 300 ? res.statusCode : 500;

  res.status(status);

  process.env.NODE_ENV === "development"
    ? res.json({ message: err.message })
    : null;
};

module.exports = errorHandler;
