const {
  getAllTodosController,
  getTodosByIdController,
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

  app.post("/api/todos", (req, res) => {});

  app.patch("/api/todos/:id", (req, res) => {});

  app.delete("/api/todos/:id", (req, res) => {});

  app.patch("/api/todos/:id/toggle", (req, res) => {});
}

module.exports = todosGlobalRoutes;
