const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Enregistrer un nouvel utilisateur
async function register(data) {
  const { name, email, password, role } = data;

  // Vérifier si l'email existe déjà
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("Cet email est déjà enregistré");
    error.status = 400;
    throw error;
  }

  // Hasher le mot de passe
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Créer l'utilisateur
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  // Retourner l'utilisateur sans le mot de passe
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

// Connexion d'un utilisateur
async function login(email, password) {
  // Trouver l'utilisateur par email
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Email ou mot de passe incorrect");
    error.status = 401;
    throw error;
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Email ou mot de passe incorrect");
    error.status = 401;
    throw error;
  }

  // Générer un token JWT
  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

// Générer un token JWT
function generateToken(user) {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  };

  return jwt.sign(payload, secret, options);
}

// Vérifier un token JWT
function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    const err = new Error("Token invalide ou expiré");
    err.status = 401;
    throw err;
  }
}

// Récupérer un utilisateur par ID
async function getUserById(userId) {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new Error("Utilisateur non trouvé");
    error.status = 404;
    throw error;
  }
  return user;
}

module.exports = {
  register,
  login,
  generateToken,
  verifyToken,
  getUserById,
};
