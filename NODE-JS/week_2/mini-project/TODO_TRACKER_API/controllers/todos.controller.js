const {
  getAllTodosService,
  getTodosByIdService,
  createTodosService,
  updateTodosService,
  deleteTodosService,
  toggleTodoService,
} = require("../services/todos.service");

const PRIORITIES = ["low", "medium", "high"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateCreate(body) {
  const errors = [];
  if (!body || typeof body.title !== "string" || body.title.trim() === "") {
    errors.push("title is required and must be a non-empty string");
  }
  if (
    body.priority &&
    !PRIORITIES.includes(String(body.priority).toLowerCase())
  ) {
    errors.push("priority must be one of low|medium|high");
  }
  if (
    body.dueDate !== undefined &&
    body.dueDate !== null &&
    !DATE_RE.test(String(body.dueDate))
  ) {
    errors.push("dueDate must be in YYYY-MM-DD format or null");
  }
  if (body.completed !== undefined && typeof body.completed !== "boolean") {
    errors.push("completed must be a boolean if provided");
  }
  return errors;
}

function validatePatch(body) {
  const allowed = new Set(["title", "completed", "priority", "dueDate"]);
  const keys = Object.keys(body || {});
  const errors = [];
  for (const k of keys) {
    if (!allowed.has(k)) errors.push(`Unknown field: ${k}`);
  }
  if (
    body.title !== undefined &&
    (typeof body.title !== "string" || body.title.trim() === "")
  ) {
    errors.push("title must be a non-empty string");
  }
  if (
    body.priority !== undefined &&
    !PRIORITIES.includes(String(body.priority).toLowerCase())
  ) {
    errors.push("priority must be one of low|medium|high");
  }
  if (
    body.dueDate !== undefined &&
    body.dueDate !== null &&
    !DATE_RE.test(String(body.dueDate))
  ) {
    errors.push("dueDate must be in YYYY-MM-DD format or null");
  }
  if (body.completed !== undefined && typeof body.completed !== "boolean") {
    errors.push("completed must be a boolean if provided");
  }
  return errors;
}

async function getAllTodosController(req, res, next) {
  try {
    const result = await getAllTodosService(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function getTodosByIdController(req, res, next) {
  try {
    const result = await getTodosByIdService(req.params.id);
    if (!result) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function createTodosController(req, res, next) {
  try {
    const errors = validateCreate(req.body);
    if (errors.length) {
      return res.status(400).json({
        status: "error",
        message: errors.join(", "),
        code: 400,
        timestamp: new Date().toISOString(),
      });
    }
    const created = await createTodosService({
      title: req.body.title.trim(),
      completed: req.body.completed === true,
      priority: req.body.priority
        ? String(req.body.priority).toLowerCase()
        : "medium",
      dueDate: req.body.dueDate ?? null,
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function updateTodosController(req, res, next) {
  try {
    const errors = validatePatch(req.body || {});
    if (errors.length) {
      return res.status(400).json({
        status: "error",
        message: errors.join(", "),
        code: 400,
        timestamp: new Date().toISOString(),
      });
    }
    const updated = await updateTodosService(req.params.id, {
      ...req.body,
      priority: req.body.priority
        ? String(req.body.priority).toLowerCase()
        : req.body.priority,
    });
    if (!updated) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteTodosController(req, res, next) {
  try {
    const ok = await deleteTodosService(req.params.id);
    if (!ok) return res.status(404).json({ message: "Todo not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function toggleTodoController(req, res, next) {
  try {
    const toggled = await toggleTodoService(req.params.id);
    if (!toggled) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(toggled);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTodosController,
  getTodosByIdController,
  createTodosController,
  updateTodosController,
  deleteTodosController,
  toggleTodoController,
};
