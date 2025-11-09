const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const config = require("./config/config");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger } = require("./middlewares/logger");

const app = express();

app.use(helmet());
app.use(cors(config.cors));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/", routes);

app.use(errorHandler);

module.exports = app;
