const path = require("path");
const fs = require("fs");

const JSON_DATA_FILE = path.join(__dirname, "../data/todos.json");
const JSON_DATA = fs.readFileSync(JSON_DATA_FILE, "utf-8");

function getAllTodosService() {
  return JSON_DATA;
}

function getTodosByIdService(id) {
  let raw_data = JSON.parse(JSON_DATA);
  return raw_data.find((todo) => Number(todo.id) === Number(id)) || "NOT FOUND";
}

module.exports = {
  getAllTodosService,
  getTodosByIdService,
};
