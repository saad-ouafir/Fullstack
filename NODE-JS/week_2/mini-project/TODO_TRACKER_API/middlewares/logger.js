const morgan = require("morgan");

function Logger(app) {
  app.use(morgan("dev"));
}

module.exports = Logger;
