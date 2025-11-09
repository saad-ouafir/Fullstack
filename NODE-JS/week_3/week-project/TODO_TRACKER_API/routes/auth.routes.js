const express = require("express");
const {
  registerController,
  loginController,
  getMeController,
} = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

// POST /api/auth/register - Inscription
router.post("/register", registerController);

// POST /api/auth/login - Connexion
router.post("/login", loginController);

// GET /api/auth/me - Profil de l'utilisateur connecté (protégé)
router.get("/me", authenticate, getMeController);

module.exports = router;
