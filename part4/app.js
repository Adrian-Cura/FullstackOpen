const blogsRouter = require("./controllers/blogsRouter");
const usersRouter = require("./controllers/usersRouter");
const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const loginRouter = require("./controllers/login");
const testingRouter = require("./controllers/testingRouter");

const middleware = require("./utils/middleware");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

//app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use("/api/login", loginRouter);
app.use(middleware.tokenExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
