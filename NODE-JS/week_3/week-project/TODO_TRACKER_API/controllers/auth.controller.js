const { register, login } = require("../services/user.service");

/**
 * Inscription d'un nouvel utilisateur
 */
async function registerController(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    // Validation basique
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Nom, email et mot de passe sont requis",
        code: 400,
        timestamp: new Date().toISOString(),
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: "error",
        message: "Le mot de passe doit contenir au moins 6 caractères",
        code: 400,
        timestamp: new Date().toISOString(),
      });
    }

    // Créer l'utilisateur
    const user = await register({ name, email, password, role });

    res.status(201).json({
      status: "success",
      message: "Utilisateur créé avec succès",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Connexion d'un utilisateur
 */
async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email et mot de passe sont requis",
        code: 400,
        timestamp: new Date().toISOString(),
      });
    }

    // Authentifier l'utilisateur
    const result = await login(email, password);

    res.status(200).json({
      status: "success",
      message: "Connexion réussie",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Récupérer le profil de l'utilisateur connecté
 */
async function getMeController(req, res, next) {
  try {
    res.status(200).json({
      status: "success",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
  getMeController,
};
