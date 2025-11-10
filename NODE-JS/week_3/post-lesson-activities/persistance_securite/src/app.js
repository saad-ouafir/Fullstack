const express = require("express");
const productsRouter = require("./routes/products.routes");
const ordersRouter = require("./routes/orders.routes");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

const helmet = require("helmet");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(logger);
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(authLimiter);
app.get("/api/users", ordersRouter);

app.use(errorHandler);
module.exports = app;
