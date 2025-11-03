const auth = require("../middlewares/auth.js");
const timeLimiter = require("../middlewares/timeLimiter.js");

function privateRoutes(express, app) {
  app.get("/api/private", auth, timeLimiter, (req, res) => {
    res.send("Welcome to the private area!");
  });
}

module.exports = privateRoutes;
