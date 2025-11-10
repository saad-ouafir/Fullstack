const Joi = require("joi");

const todoValidationSchema = Joi.object({
  title: Joi.string().min(1).required(),
  priority: Joi.string().valid("low", "medium", "high"),
  dueDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  completed: Joi.boolean(),
});

const todoPatchValidationSchema = Joi.object({
  title: Joi.string().min(1),
  priority: Joi.string().valid("low", "medium", "high"),
  dueDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  completed: Joi.boolean(),
});

function validateTodo(req, res, next) {
  const { error } = todoValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: error.details.map(e => e.message),
      code: 400,
      timestamp: new Date().toISOString(),
    });
  }
  next();
}

function validateTodoPatch(req, res, next) {
  const { error } = todoPatchValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: error.details.map(e => e.message),
      code: 400,
      timestamp: new Date().toISOString(),
    });
  }
  next();
}

module.exports = { validateTodo, validateTodoPatch };
