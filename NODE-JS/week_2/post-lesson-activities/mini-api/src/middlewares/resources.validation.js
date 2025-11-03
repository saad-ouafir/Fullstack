function validateResource(req, res, next) {
  const { name, creation_date } = req.body;
  if (!name || !creation_date) {
    return res.status(400).send("Missing or invalid data");
  }
  next();
}

module.exports = validateResource;
