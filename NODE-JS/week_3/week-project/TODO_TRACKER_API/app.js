const express = require("express");
const app = express();

const Logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

const todosRouter = require("./routes/todos.routes");
const authRouter = require("./routes/auth.routes");
const config = require("./config/config");

const connectToDB = require("./config/database");
const MONGO_URL = config.MONGO_URL;
connectToDB(MONGO_URL);

Logger(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to TODO TRACKER API",
    version: "2.0.0",
    endpoints: {
      auth: "/api/auth",
      todos: "/api/todos",
    },
  });
});

app.use("/api/auth", authRouter);
app.use("/api/todos", todosRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    code: 404,
    timestamp: new Date().toISOString(),
  });
});

app.use(Logger);
app.use(errorHandler);

module.exports = app;
