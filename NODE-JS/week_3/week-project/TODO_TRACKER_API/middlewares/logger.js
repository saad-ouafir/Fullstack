const morgan = require("morgan");

function Logger() {
  return morgan(":date[iso] :method :url -> :status :response-time ms");
}

module.exports = Logger;
