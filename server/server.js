require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const { logger, emmiteEvents } = require("./middlewares/emmiteEvents");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const port = process.env.PORT || 8080;

connectDB();

app.use(logger);

app.use(express.json());

app.use(cookieParser());

app.use("/auth", require("./routes/authRoutes.js"));

app.use("/users", require("./routes/userRoutes.js"));

app.use("/notes", require("./routes/noteRoutes.js"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

  app.get("*", (req, res) =>
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    )
  );
} else {
  app.get("/", (req, res) => res.send("Please set to production."));
}

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log(`Connected to MongoDB!`);
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  );
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  emmiteEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
