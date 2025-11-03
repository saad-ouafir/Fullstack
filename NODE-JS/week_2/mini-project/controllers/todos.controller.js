const {
  getAllTodosService,
  getTodosByIdService,
} = require("../services/todos.service");

function getAllTodosController(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(getAllTodosService());
}

function getTodosByIdController(req, res) {
  res.status(200);
  result = getTodosByIdService(req.params.id);
  result === true
    ? res.status(200).send(result)
    : res.status(404).json("Error, Todos Not Found !");
}

module.exports = {
  getAllTodosController,
  getTodosByIdController,
};
