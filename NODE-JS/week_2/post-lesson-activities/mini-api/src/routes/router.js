const getInfoRoutes = require("./info.routes.js");
const resourcesRoutes = require("./resources.routes.js");
const privateRoutes = require("./private.routes.js");
const productsRoutes = require("./products.routes.js");

function getGlobalRoutes(express, app) {
  app.get("/api", (req, res) => {
    res.status(200);
    res.send("welcome to mini-api app !");
  });

  getInfoRoutes(express, app);
  resourcesRoutes(express, app);
  privateRoutes(express, app);
  productsRoutes(express, app);
}

module.exports = getGlobalRoutes;
