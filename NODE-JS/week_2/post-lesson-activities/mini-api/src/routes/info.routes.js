const getProjectInfoConroller = require("../controllers/info.controller");

function getInfoRoutes(app) {
  app.get("/api/info", (req, res) => {
    res.send(getProjectInfoConroller());
  });
}

module.exports = getInfoRoutes;
