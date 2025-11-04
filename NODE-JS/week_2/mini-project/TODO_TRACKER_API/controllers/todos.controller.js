const {
  getAllTodosService,
  getTodosByIdService,
  createTodosService,
  updateTodosService,
  deleteTodosService,
  toggleTodoService,
} = require("../services/todos.service");

function validateData(req, res, next) {
  const priorities = ["low", "medium", "high"];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (
    !req.title ||
    req.title === "" ||
    req.complete === "" ||
    !dateRegex.test(req.dueDate)
  ) {
    if (!req.priority) {
      req.priority = "medium";
    } else if (req.priority !== req.priority.includes(priorities)) {
      req.priority = "medium";
    }
    return res.status(404).json({
      statusCode: 404,
      status: "Error",
      message: "Invalid or missing data!",
    });
  } else {
    next();
  }
}

function getAllTodosController(req, res) {
  // res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(getAllTodosService(req.query));
}

function getTodosByIdController(req, res) {
  const result = getTodosByIdService(req.params.id);
  if (result !== false) {
    res.status(200).send(result);
  } else {
    res.status(404).json({
      status: "error",
      message: "Todos ID NOT FOUND !",
      code: 404,
      timestamp: new Date().toISOString(),
    });
  }
}

function createTodosCOntroller(req, res) {
  validateData(req.body, res, () => {
    if (createTodosService(req.body) === true) {
      res.status(201).json("Todos Created Secussfully !");
    }
  });
}

function updateTodosController(req, res) {
  validateData(req.body, res, () => {
    if (updateTodosService(req.params.id, req.body) === true) {
      res.status(200).json("Todos Updated Secussfully !");
    } else {
      res.status(404).json("Todos ID NOT FOUND !");
    }
  });
}

function deleteTodosController(req, res) {
  if (deleteTodosService(req.params.id) === true) {
    res.status(200).json("Todos Deleted Secussfully !");
  } else {
    res.status(404).json("Todos ID NOT FOUND !");
  }
}

function toggleTodoController(req, res) {
  const result = toggleTodoService(req.params.id);
  if (result !== false) {
    res.status(200).json(result);
  } else {
    res.status(404).json({
      status: "error",
      message: "Todos ID NOT FOUND !",
      code: 404,
      timestamp: new Date().toISOString(),
    });
  }
}

module.exports = {
  getAllTodosController,
  getTodosByIdController,
  createTodosCOntroller,
  updateTodosController,
  deleteTodosController,
  toggleTodoController,
};
