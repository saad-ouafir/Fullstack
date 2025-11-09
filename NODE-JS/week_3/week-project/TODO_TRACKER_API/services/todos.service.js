const Todo = require("../models/todo.model");
const {
  DEFAULT_PRIORITY,
  DEFAULT_COMPLETED,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} = require("../config/constants");

// Construire les filtres MongoDB à partir des query params
function buildMongoFilters(filters, userId, userRole) {
  const mongoFilters = {};

  // Filtrer par utilisateur (sauf pour les admins qui voient tout)
  if (userRole !== "admin") {
    mongoFilters.user = userId;
  }

  // Filter by status
  if (filters.status) {
    if (filters.status === "active") {
      mongoFilters.completed = false;
    } else if (filters.status === "completed") {
      mongoFilters.completed = true;
    }
  }

  // Filter by priority
  if (filters.priority) {
    mongoFilters.priority = filters.priority;
  }

  // Search in title
  if (filters.q) {
    mongoFilters.title = { $regex: filters.q, $options: "i" };
  }

  return mongoFilters;
}

// Récupérer tous les todos avec filtres et pagination
async function getAllTodosService(filters, userId, userRole) {
  const page = parseInt(filters.page) || DEFAULT_PAGE;
  let limit = parseInt(filters.limit) || DEFAULT_LIMIT;

  // Enforce max limit
  if (limit > MAX_LIMIT) {
    limit = MAX_LIMIT;
  }

  const skip = (page - 1) * limit;

  // Construire les filtres MongoDB
  const mongoFilters = buildMongoFilters(filters, userId, userRole);

  // Exécuter la requête avec pagination
  const [todos, total] = await Promise.all([
    Todo.find(mongoFilters)
      .sort({ createdAt: -1 }) // Tri par date décroissante
      .skip(skip)
      .limit(limit)
      .populate("user", "name email"), // Inclure les infos de l'utilisateur
    Todo.countDocuments(mongoFilters),
  ]);

  const pages = Math.ceil(total / limit);

  return {
    data: todos,
    total,
    page,
    limit,
    pages,
  };
}

// Récupérer un todo par ID
async function getTodosByIdService(id, userId, userRole) {
  const query = { _id: id };

  // Les utilisateurs normaux ne peuvent voir que leurs propres todos
  if (userRole !== "admin") {
    query.user = userId;
  }

  const todo = await Todo.findOne(query).populate("user", "name email");
  return todo;
}

// Créer un nouveau todo
async function createTodosService(todoData, userId) {
  const newTodo = await Todo.create({
    title: todoData.title,
    completed: todoData.completed ?? DEFAULT_COMPLETED,
    priority: todoData.priority || DEFAULT_PRIORITY,
    dueDate: todoData.dueDate || null,
    user: userId,
  });

  return await Todo.findById(newTodo._id).populate("user", "name email");
}

// Mettre à jour un todo
async function updateTodosService(id, updateData, userId, userRole) {
  const query = { _id: id };

  // Les utilisateurs normaux ne peuvent modifier que leurs propres todos
  if (userRole !== "admin") {
    query.user = userId;
  }

  const updatedTodo = await Todo.findOneAndUpdate(
    query,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("user", "name email");

  return updatedTodo;
}

// Supprimer un todo
async function deleteTodosService(id, userId, userRole) {
  const query = { _id: id };

  // Les utilisateurs normaux ne peuvent supprimer que leurs propres todos
  if (userRole !== "admin") {
    query.user = userId;
  }

  const deletedTodo = await Todo.findOneAndDelete(query);
  return deletedTodo !== null;
}

// Basculer le statut completed d'un todo
async function toggleTodoService(id, userId, userRole) {
  const query = { _id: id };

  // Les utilisateurs normaux ne peuvent modifier que leurs propres todos
  if (userRole !== "admin") {
    query.user = userId;
  }

  const todo = await Todo.findOne(query);
  if (!todo) {
    return null;
  }

  todo.completed = !todo.completed;
  await todo.save();

  return await Todo.findById(todo._id).populate("user", "name email");
}

module.exports = {
  getAllTodosService,
  getTodosByIdService,
  createTodosService,
  updateTodosService,
  deleteTodosService,
  toggleTodoService,
};
