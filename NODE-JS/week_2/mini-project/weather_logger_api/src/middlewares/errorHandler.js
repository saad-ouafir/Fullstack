const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      path: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;
