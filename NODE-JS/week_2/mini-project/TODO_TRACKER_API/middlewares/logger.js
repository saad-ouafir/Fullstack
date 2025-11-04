const morgan = require("morgan");

module.exports = morgan(":date[iso] :method :url -> :status :response-time ms");
