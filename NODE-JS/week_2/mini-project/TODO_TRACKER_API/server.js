const express = require("express");
const app = express();
const Logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
require("dotenv").config();
const PORT = process.env.PORT_APP || 3000;

app.use(express.json());
app.use(Logger);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to TODO TRACKER API !");
});

const todosRouter = require("./routes/todos.routes");
app.use("", todosRouter);

app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`app is launched on  http://localhost:${PORT}`)
);
