const { verifyToken, getUserById } = require("../services/user.service");

// Middleware d'authentification JWT
// Vérifie le token et attache l'utilisateur à req.user
async function authenticate(req, res, next) {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Token d'authentification manquant",
        code: 401,
        timestamp: new Date().toISOString(),
      });
    }

    // Extraire le token
    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier le token
    const decoded = verifyToken(token);

    // Récupérer l'utilisateur complet
    const user = await getUserById(decoded.id);

    // Attacher l'utilisateur à la requête
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: error.message || "Token invalide",
      code: 401,
      timestamp: new Date().toISOString(),
    });
  }
}

// Middleware pour vérifier le rôle admin
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Authentification requise",
      code: 401,
      timestamp: new Date().toISOString(),
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Accès refusé. Droits administrateur requis.",
      code: 403,
      timestamp: new Date().toISOString(),
    });
  }

  next();
}

// Middleware optionnel d'authentification
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      const user = await getUserById(decoded.id);

      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      };
    }

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans utilisateur
    next();
  }
}

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth,
};
