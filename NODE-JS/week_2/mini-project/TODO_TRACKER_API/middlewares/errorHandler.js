function errorHandler(err, req, res, next) {
  if (err) {
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      status: "error",
      message: err.message || "Internal Server Error",
      code: statusCode,
      timestamp: new Date().toISOString(),
    });
  } else {
    next();
  }
}

module.exports = errorHandler;
