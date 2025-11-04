function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    status: "error",
    message,
    code: status,
    timestamp: new Date().toISOString(),
  });
}

module.exports = errorHandler;
