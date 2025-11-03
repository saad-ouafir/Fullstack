const {
  getAllTodosController,
  getTodosByIdController,
  createTodosCOntroller,
  updateTodosController,
  deleteTodosController,
} = require("../controllers/todos.controller.js");

function todosGlobalRoutes(express, app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  app.post("/api/todos", (req, res) => {
    createTodosCOntroller(req, res);
  });

  app.patch("/api/todos/:id", (req, res) => {
    updateTodosController(req, res);
  });

  app.delete("/api/todos/:id", (req, res) => {
    deleteTodosController(req, res);
  });

  app.patch("/api/todos/:id/toggle", (req, res) => {});
}

module.exports = todosGlobalRoutes;
