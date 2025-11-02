const morgan = require("morgan");

function logger(app) {
  return app.use(morgan("dev"));
}

module.exports = logger;
