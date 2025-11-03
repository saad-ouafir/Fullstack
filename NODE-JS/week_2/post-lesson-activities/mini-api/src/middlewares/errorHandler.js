// function handleRoutingErrors(req, res, next) {
//   const error = new Error("Not Found");
//   error.status = 404;
//   next(error);
// }

// function handleGlobalErrors(error, req, res, next) {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// }

// module.exports = { handleRoutingErrors, handleGlobalErrors };

class AppError {
  AppError(message, statusCode) {
    return {
      status: "error",
      message: message,
      code: statusCode,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = AppError;
