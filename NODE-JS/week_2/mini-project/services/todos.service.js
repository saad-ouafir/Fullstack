const path = require("path");
const fs = require("fs");

const JSON_DATA_FILE = path.join(__dirname, "../data/todos.json");
const JSON_DATA = fs.readFileSync(JSON_DATA_FILE, "utf-8");

function getAllTodosService() {
  return JSON_DATA;
}

function getTodosByIdService(id) {
  let data = JSON.parse(JSON_DATA);
  return data.find((todo) => Number(todo.id) === Number(id)) || "NOT FOUND";
}

function createTodosService(todos) {
  let data = [...JSON.parse(JSON_DATA)];
  todos.id = data.length + 1;
  todos.createdAt = new Date().toISOString();
  data.push(todos);
  fs.writeFileSync(JSON.stringify(data));
  return true;
}

function updateTodosService(id, todos) {
  let data = [...JSON.parse(JSON_DATA)];
  let index = data.findIndex((todo) => Number(todo.id === Number(id)));
  if (index !== -1) {
    data[index].title = todos.title;
    data[index].complete = todos.complete;
    data[index].priority = todos.priority;
    data[index].dueDate = todos.dueDate;
    data[index].dueDate = todos.dueDate;
    data[index].updatedAt = new Date().toISOString();
    fs.writeFileSync(JSON.stringify(data));
    return true;
  } else {
    return false;
  }
}

function deleteTodosService(id) {
  let data = [...JSON.parse(JSON_DATA)];
  let new_data =
    data.filter((todo) => Number(todo.id) !== Number(data.id)) || undefined;
  if (new_data !== undefined) {
    fs.writeFileSync(JSON.stringify(new_data));
    return true;
  } else {
    return false;
  }
}

module.exports = {
  getAllTodosService,
  getTodosByIdService,
  createTodosService,
  deleteTodosService,
};
