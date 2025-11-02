function validateResource(req, res, next) {
  const { name, creation_date } = req.body;
  if (!name || typeof name !== 'string' || !creation_date || typeof creation_date !== 'string') {
    return res.status(400).send('Missing or invalid data');
  }
  next();
}

module.exports = validateResource;
