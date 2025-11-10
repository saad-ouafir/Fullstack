const authLimiter = require("express-rate-limit");

const authLimiter = authLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Trop de tentatives de connexion. Veuillez patienter 15 minutes.",
});

module.exports = authLimiter;
