const express = require("express");
const {
  getAllTodosController,
  getTodosByIdController,
  createTodosController,
  updateTodosController,
  deleteTodosController,
  toggleTodoController,
} = require("../controllers/todos.controller.js");
const { authenticate } = require("../middlewares/auth");
const {validateTodo,validateTodoPatch} = require ("../middlewares/validation.middleware.js");
const router = express.Router();

// Appliquer l'authentification à toutes les routes todos
router.use(authenticate);

// GET /api/todos - Get all todos with filters and pagination
router.get("/", getAllTodosController);

// GET /api/todos/:id - Get a specific todo by ID
router.get("/:id", getTodosByIdController);

// POST /api/todos - Create a new todo
router.post("/", validateTodo,createTodosController);

// PATCH /api/todos/:id - Update a todo
router.patch("/:id",validateTodoPatch, updateTodosController);

// PATCH /api/todos/:id/toggle - Toggle todo completion status
router.patch("/:id/toggle", toggleTodoController);

// DELETE /api/todos/:id - Delete a todo
router.delete("/:id", deleteTodosController);

module.exports = router;
