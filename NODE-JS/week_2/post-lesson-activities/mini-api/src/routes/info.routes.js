const getProjectInfoConroller = require("../controllers/info.controller");

function getInfoRoutes(express, app) {
  app.get("/api/info", (req, res) => {
    res.send(getProjectInfoConroller());
  });
}

module.exports = getInfoRoutes;
