const morgan = require("morgan");

function Logger(app) {
  app.use(morgan(":date[iso] :method :url -> :status :response-time ms"));
}

module.exports = Logger;
