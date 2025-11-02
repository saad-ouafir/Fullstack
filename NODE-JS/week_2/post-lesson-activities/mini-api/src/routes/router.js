const getInfoRoutes = require("./info.routes.js");
const resourcesRoutes = require("./resources.routes.js");

function getGlobalRoutes(app) {
  app.get("/api", (req, res) => {
    res.status(200);
    res.send("welcome to mini-api app !");
  });

  getInfoRoutes(app);
  resourcesRoutes(app);
}

module.exports = getGlobalRoutes;
