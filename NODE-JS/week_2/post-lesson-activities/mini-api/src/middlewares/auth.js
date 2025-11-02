function auth(req, res, next) {
  if (req.headers.authorization === "1234") {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

module.exports = auth;
