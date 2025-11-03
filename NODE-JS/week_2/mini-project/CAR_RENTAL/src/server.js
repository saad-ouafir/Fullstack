const express = require("express");
const app = express();
const Logger = require("./middlewares/logger");

Logger(app);
// const todosGlobalRoutes = require("./routes/todos.routes");
// todosGlobalRoutes(express, app);

app.listen(3000, () =>
  console.log("app is launched on  http://localhost:3000")
);
