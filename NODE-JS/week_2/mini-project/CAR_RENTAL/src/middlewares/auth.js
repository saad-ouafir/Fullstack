function auth(auth_key, req, res, next) {
  if (req.headers.authorization === auth_key) {
    next(req, res);
  } else {
    res.status(401).send("Token refuse");
  }
}

module.exports = auth;
