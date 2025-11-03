function timeLimiter(req, res, next) {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 22 || hour < 6) {
    res.status(403).send({
      error: "Access refuse",
      reason: "Token invalide ou horaire interdit",
    });
  } else {
    next();
  }
}

module.exports = timeLimiter;
