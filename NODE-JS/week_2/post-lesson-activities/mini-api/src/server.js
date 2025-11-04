const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.APP_PORT || 3000;

const logger = require("./middlewares/logger.js");
logger(app);

const getGlobalRoutes = require("./routes/router.js");
getGlobalRoutes(express, app);

app.listen(PORT, () =>
  console.log(`app is working on port http://localhost:${PORT}`)
);
