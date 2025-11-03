const express = require("express");
const app = express();

const {
  getAllTodosService,
  getTodosByIdService,
} = require("../services/todos.service");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getAllTodosController(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(200).send(getAllTodosService());
}

function getTodosByIdController(req, res) {
  res.status(200);
  result = getTodosByIdService(req.params.id);
  result !== "NOT FOUND"
    ? res.status(200).send(result)
    : res.status(404).json("Error, Todos Not Found !");
}

module.exports = {
  getAllTodosController,
  getTodosByIdController,
};
