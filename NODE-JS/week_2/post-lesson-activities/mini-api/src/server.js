const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.APP_PORT || 3000;

const logger = require("./middlewares/logger.js");
logger(app);

const getGlobalRoutes = require("./routes/router.js");
getGlobalRoutes(express, app);

// const {
//   handleRoutingErrors,
//   handleGlobalErrors,
// } = require("./middlewares/errorHandler.js");
// app.use(handleRoutingErrors);
// app.use(handleGlobalErrors);

const AppError = require("./middlewares/errorHandler.js");
let newError = new AppError("Resource not found", 404);

app.listen(PORT, () =>
  console.log(`app is working on port http://localhost:${PORT}`)
);
