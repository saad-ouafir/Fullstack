function sendJson(res, data, statusCode) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data, null, 2));
}

module.exports = sendJson;
