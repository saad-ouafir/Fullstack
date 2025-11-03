function errorHandler(err, req, res, next) {
  let params = { ...req.body };
  if (
    !params.title ||
    params.title === undefined ||
    params.complete === undefined ||
    params.priority === undefined ||
    params.dueDate === undefined
  ) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      code: err.statusCode,
      timestamp: new Date().toISOString(),
    });
  } else {
    next();
  }
}
