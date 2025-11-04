const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const timestamp = err.timestamp || new Date().toISOString();

  console.error("Error:", {
    message: err.message,
    statusCode,
    stack: err.stack,
    timestamp,
  });

  res.status(statusCode).json({
    status: "error",
    message,
    code: statusCode,
    timestamp,
  });
};

module.exports = errorHandler;
