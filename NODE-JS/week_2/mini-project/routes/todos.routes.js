const {
  getAllTodosController,
  getTodosByIdController,
} = require("../controllers/todos.controller.js");

function todosGlobalRoutes(app) {
  app.get("/", (req, res) => {
    res.status(200);
    res.send("Welcome to TODO TRACKER API !");
  });
  app.get("/api/todos", (req, res) => {
    getAllTodosController(req, res);
  });

  app.get("/api/todos/:id", (req, res) => {
    getTodosByIdController(req, res);
  });
}

module.exports = todosGlobalRoutes;
