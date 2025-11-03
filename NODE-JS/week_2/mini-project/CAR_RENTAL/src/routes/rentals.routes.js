const {
  getAllRentalsController,
  getRentalByIdController,
  createRentalController,
  returnRentalController,
  cancelRentalController,
} = require("../controllers/rentals.controller");

function globalRentalsRoutes(express, app, route) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get(`${route}`, (req, res) => {
    getAllRentalsController(req, res);
  });

  app.get(`${route}/:id`, (req, res) => {
    getRentalByIdController(req, res);
  });

  app.post(`${route}`, (req, res) => {
    createRentalController(req, res);
  });

  app.put(`${route}/:id`, (req, res) => {
    returnRentalController(req, res);
  });

  app.delete(`${route}/:id`, (req, res) => {
    cancelRentalController(req, res);
  });
}

module.exports = globalRentalsRoutes;
