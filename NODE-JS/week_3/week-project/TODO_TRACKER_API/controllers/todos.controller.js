const {
  getAllTodosService,
  getTodosByIdService,
  createTodosService,
  updateTodosService,
  deleteTodosService,
  toggleTodoService,
} = require("../services/todos.service");
const {
  PRIORITIES,
  DATE_REGEX,
  ALLOWED_UPDATE_FIELDS,
} = require("../config/constants");

function validateData(data, res, next) {
  const errors = [];

  // Validate title
  if (!data.title || data.title.trim() === "") {
    errors.push("Title is required and cannot be empty");
  }

  // Validate priority (optional, but must be valid if provided)
  if (data.priority && !PRIORITIES.includes(data.priority)) {
    errors.push(`Priority must be one of: ${PRIORITIES.join(", ")}`);
  }

  // Validate dueDate (optional, but must be valid format if provided)
  if (data.dueDate && !DATE_REGEX.test(data.dueDate)) {
    errors.push("Due date must be in YYYY-MM-DD format");
  }

  // Validate completed (optional, but must be boolean if provided)
  if (data.completed !== undefined && typeof data.completed !== "boolean") {
    errors.push("Completed must be a boolean value");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors,
      code: 400,
      timestamp: new Date().toISOString(),
    });
  }

  next();
}

async function getAllTodosController(req, res, next) {
  try {
    const result = await getAllTodosService(
      req.query,
      req.user.id,
      req.user.role
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getTodosByIdController(req, res, next) {
  try {
    const result = await getTodosByIdService(
      req.params.id,
      req.user.id,
      req.user.role
    );
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        status: "error",
        message: "Todo not found",
        code: 404,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    next(error);
  }
}

async function createTodosController(req, res, next) {
  try {
    validateData(req.body, res, async () => {
      const newTodo = await createTodosService(req.body, req.user.id);
      res.status(201).json({
        status: "success",
        message: "Todo created successfully",
        data: newTodo,
      });
    });
  } catch (error) {
    next(error);
  }
}

async function updateTodosController(req, res, next) {
  try {
    // For updates, allow partial data (no title required)
    const updateData = {};
    
    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No valid fields to update",
        code: 400,
        timestamp: new Date().toISOString(),
      });
    }

    const updatedTodo = await updateTodosService(
      req.params.id,
      updateData,
      req.user.id,
      req.user.role
    );
    if (updatedTodo) {
      res.status(200).json({
        status: "success",
        message: "Todo updated successfully",
        data: updatedTodo,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Todo not found",
        code: 404,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    next(error);
  }
}

async function deleteTodosController(req, res, next) {
  try {
    const deleted = await deleteTodosService(
      req.params.id,
      req.user.id,
      req.user.role
    );
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({
        status: "error",
        message: "Todo not found",
        code: 404,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    next(error);
  }
}

async function toggleTodoController(req, res, next) {
  try {
    const result = await toggleTodoService(
      req.params.id,
      req.user.id,
      req.user.role
    );
    if (result) {
      res.status(200).json({
        status: "success",
        message: "Todo toggled successfully",
        data: result,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Todo not found",
        code: 404,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    next(error);
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
