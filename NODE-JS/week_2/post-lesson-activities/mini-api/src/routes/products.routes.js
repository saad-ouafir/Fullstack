const {
  getAllProuctsController,
} = require("../controllers/data.controller.js");

function productsRoutes(express, app) {
  app.use(express.json());

  app.use("/api/products", (req, res) => {
    getAllProuctsController(req, res);
  });

  // app.use()
}

module.exports = productsRoutes;
