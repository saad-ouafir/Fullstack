const express = require("express");
const router = express.Router();

const {
  getAllTodosController,
  getTodosByIdController,
  createTodosController,
  updateTodosController,
  deleteTodosController,
  toggleTodoController,
} = require("../controllers/todos.controller.js");

router.get("/api/todos", (req, res, next) =>
  getAllTodosController(req, res, next)
);
router.get("/api/todos/:id", (req, res, next) =>
  getTodosByIdController(req, res, next)
);
router.post("/api/todos", (req, res, next) =>
  createTodosController(req, res, next)
);
router.patch("/api/todos/:id", (req, res, next) =>
  updateTodosController(req, res, next)
);
router.delete("/api/todos/:id", (req, res, next) =>
  deleteTodosController(req, res, next)
);
router.patch("/api/todos/:id/toggle", (req, res, next) =>
  toggleTodoController(req, res, next)
);

module.exports = router;
