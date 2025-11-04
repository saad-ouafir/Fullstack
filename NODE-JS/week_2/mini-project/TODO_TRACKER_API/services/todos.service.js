const path = require("path");
const fs = require("fs");

const JSON_DATA_FILE = path.join(__dirname, "../data/todos.json");
const JSON_DATA = fs.readFileSync(JSON_DATA_FILE, "utf-8");

function filterData(data, filters) {
  let result = data;

  if (filters.status) {
    if (filters.status === "active") {
      result = result.filter((todo) => todo.complete === false);
    }

    if (filters.status === "completed") {
      result = result.filter((todo) => todo.complete === true);
    }
  }

  if (filters.priority) {
    if (filters.priority === "low") {
      result = result.filter((todo) => todo.priority === "low");
    }

    if (filters.priority === "medium") {
      result = result.filter((todo) => todo.priority === "medium");
    }

    if (filters.priority === "high") {
      result = result.filter((todo) => todo.priority === "high");
    }
  }

  if (filters.q) {
    const searchTerm = filters.q.toLowerCase();
    result = result.filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm)
    );
  }

  result.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB - dateA;
  });

  return result;
}

function paginateData(data, page, limit) {
  let start;
  let end;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  start = (page - 1) * 10;
  end = start + limit;

  return { data: data.slice(start, end), page, limit };
}

function getAllTodosService(filters) {
  let data = [...JSON.parse(JSON_DATA)];
  return paginateData(filterData(data, filters), filters.page, filters.limit);
}

function getTodosByIdService(id) {
  let data = JSON.parse(JSON_DATA);
  return data.find((todo) => Number(todo.id) === Number(id)) || false;
}

function createTodosService(todos) {
  let data = [...JSON.parse(JSON_DATA)];
  todos.id = data.length + 1;
  todos.createdAt = new Date().toISOString();
  todos.priority = todos.priority === "" ? "medium" : todos.priority;
  data.push(todos);
  fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
  return true;
}

function updateTodosService(id, todos) {
  let data = [...JSON.parse(JSON_DATA)];
  let index = data.findIndex((todo) => Number(todo.id === Number(id)));
  if (index !== -1) {
    data[index].title = todos.title;
    data[index].complete = todos.complete;
    data[index].priority = todos.priority || "medium";
    data[index].dueDate = todos.dueDate;
    data[index].updatedAt = new Date().toISOString();
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
    return true;
  } else {
    return false;
  }
}

function deleteTodosService(id) {
  let data = [...JSON.parse(JSON_DATA)];
  let new_data =
    data.filter((todo) => Number(todo.id) !== Number(id)) || undefined;
  if (new_data !== undefined) {
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(new_data));
    return true;
  } else {
    return false;
  }
}

function toggleTodoService(id) {
  let data = [...JSON.parse(JSON_DATA)];
  const index = data.findIndex((t) => String(t.id) === String(id));
  if (index === -1) {
    return false;
  } else {
    data[index].complete = !data[index].complete;
    data[index].updatedAt = new Date().toISOString();
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
    return data[index];
  }
}

module.exports = {
  getAllTodosService,
  getTodosByIdService,
  createTodosService,
  updateTodosService,
  deleteTodosService,
  toggleTodoService,
};
