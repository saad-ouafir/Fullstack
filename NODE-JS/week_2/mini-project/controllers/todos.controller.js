const {
  getAllTodosService,
  getTodosByIdService,
  createTodosService,
  updateTodosService,
  deleteTodosService,
} = require("../services/todos.service");

function validateData(params, next) {
  if (
    !params.title ||
    params.title === "" ||
    params.complete === "" ||
    params.priority === "" ||
    params.dueDate === ""
  ) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      code: err.statusCode,
      timestamp: new Date().toISOString(),
    });
  } else {
    next();
  }
}

function getAllTodosController(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(getAllTodosService());
}

function getTodosByIdController(req, res) {
  res.status(200);
  result = getTodosByIdService(req.params.id);
  result !== false
    ? res.status(200).send(result)
    : res.status(404).json("Error, Todos Not Found !");
}

function createTodosCOntroller(req, res) {
  if (createTodosService(req.body) === true) {
    res.status(201).json("Todos Created Secussfully !");
  }
}

function updateTodosController(req, res) {
  if (updateTodosService(req.params.id, req.body) === true) {
    res.status(200).json("Todos Updated Secussfully !");
  } else {
    res.status(404).json("Todos ID NOT FOUND !");
  }
}

function deleteTodosController(req, res) {
  if (deleteTodosService(req.params.id) === true) {
    res.status(200).json("Todos Deleted Secussfully !");
  } else {
    res.status(404).json("Todos ID NOT FOUND !");
  }
}

module.exports = {
  getAllTodosController,
  getTodosByIdController,
  createTodosCOntroller,
  updateTodosController,
  deleteTodosController,
};
