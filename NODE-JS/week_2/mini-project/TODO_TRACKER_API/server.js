const express = require("express");
const app = express();
const Logger = require("./middlewares/logger");
require("dotenv").config();

const errorHandler = require("./middlewares/errorHandler");

const PORT_APP = process.env.PORT_APP || 3000;

Logger(app);
const todosGlobalRoutes = require("./routes/todos.routes");
todosGlobalRoutes(express, app);

app.use(errorHandler);

app.listen(PORT_APP, () =>
  console.log(`app is launched on  http://localhost:${PORT_APP}`)
);
