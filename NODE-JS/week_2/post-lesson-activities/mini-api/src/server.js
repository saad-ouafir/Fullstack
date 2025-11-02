const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.APP_PORT || 3000;

const logger = require("./middlewares/logger.js");
logger(app);

app.use(express.json());

const getGlobalRoutes = require("./routes/router.js");
getGlobalRoutes(app);

const { handleRoutingErrors, handleGlobalErrors } = require("./controllers/errors.controller.js");
app.use(handleRoutingErrors);
app.use(handleGlobalErrors);

app.listen(PORT, () =>
  console.log(`app is working on port http://localhost:${PORT}`)
);
