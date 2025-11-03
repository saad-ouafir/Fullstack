function auth(req, res, next) {
  if (req.headers.authorization === "1234") {
    next();
  } else {
    res.status(401).send("Token refuse");
  }
}

module.exports = auth;
