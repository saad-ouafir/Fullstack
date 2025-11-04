const path = require("path");
const fs = require("fs");

const JSON_DATA_FILE = path.join(__dirname, "../data/todos.json");
const fsp = fs.promises;

async function readAll() {
  try {
    const raw = await fsp.readFile(JSON_DATA_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}

async function writeAll(data) {
  const json = JSON.stringify(data, null, 2);
  await fsp.writeFile(JSON_DATA_FILE, json, "utf-8");
}

function applyFilters(data, filters = {}) {
  let result = [...data];

  const status = (filters.status || "all").toLowerCase();
  if (status === "active") {
    result = result.filter((t) => t.completed === false);
  } else if (status === "completed") {
    result = result.filter((t) => t.completed === true);
  }

  const priority = filters.priority && String(filters.priority).toLowerCase();
  if (priority && ["low", "medium", "high"].includes(priority)) {
    result = result.filter((t) => t.priority === priority);
  }

  const q = filters.q && String(filters.q).toLowerCase();
  if (q) {
    result = result.filter((t) => String(t.title).toLowerCase().includes(q));
  }

  // default sort: createdAt desc
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return result;
}

function paginate(list, pageParam, limitParam) {
  const page = Math.max(parseInt(pageParam || 1, 10), 1);
  const limit = Math.max(parseInt(limitParam || 10, 10), 1);
  const total = list.length;
  const pages = Math.max(Math.ceil(total / limit), 1);
  const start = (page - 1) * limit;
  const end = start + limit;
  return { data: list.slice(start, end), total, page, pages };
}

async function getAllTodosService(filters = {}) {
  const data = await readAll();
  const filtered = applyFilters(data, filters);
  return paginate(filtered, filters.page, filters.limit);
}

async function getTodosByIdService(id) {
  const data = await readAll();
  return data.find((todo) => String(todo.id) === String(id)) || null;
}

async function createTodosService(payload) {
  const data = await readAll();
  const now = new Date().toISOString();
  const nextId = data.length > 0 ? (Number(data[data.length - 1].id) + 1) : 1;
  const todo = {
    id: nextId,
    title: payload.title,
    completed: payload.completed === true ? true : false,
    priority: payload.priority || "medium",
    dueDate: payload.dueDate ?? null,
    createdAt: now,
    updatedAt: now,
  };
  data.push(todo);
  await writeAll(data);
  return todo;
}

async function updateTodosService(id, patch) {
  const data = await readAll();
  const idx = data.findIndex((t) => String(t.id) === String(id));
  if (idx === -1) return null;
  const now = new Date().toISOString();
  const current = data[idx];
  const updated = {
    ...current,
    ...(patch.title !== undefined ? { title: patch.title } : {}),
    ...(patch.completed !== undefined ? { completed: !!patch.completed } : {}),
    ...(patch.priority !== undefined ? { priority: patch.priority } : {}),
    ...(patch.dueDate !== undefined ? { dueDate: patch.dueDate } : {}),
    updatedAt: now,
  };
  data[idx] = updated;
  await writeAll(data);
  return updated;
}

async function deleteTodosService(id) {
  const data = await readAll();
  const idx = data.findIndex((t) => String(t.id) === String(id));
  if (idx === -1) return false;
  data.splice(idx, 1);
  await writeAll(data);
  return true;
}

async function toggleTodoService(id) {
  const data = await readAll();
  const idx = data.findIndex((t) => String(t.id) === String(id));
  if (idx === -1) return null;
  data[idx].completed = !data[idx].completed;
  data[idx].updatedAt = new Date().toISOString();
  await writeAll(data);
  return data[idx];
}

module.exports = {
  getAllTodosService,
  getTodosByIdService,
  createTodosService,
  updateTodosService,
  deleteTodosService,
  toggleTodoService,
};
