function timeLimiter(req, res, next) {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 22 || hour < 6) {
    res.status(403).send("Service unavailable at night");
  } else {
    next();
  }
}

module.exports = timeLimiter;
