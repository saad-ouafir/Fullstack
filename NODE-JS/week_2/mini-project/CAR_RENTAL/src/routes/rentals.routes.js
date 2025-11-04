const {
  getAllRentalsController,
  getRentalByIdController,
  createRentalController,
  returnRentalController,
  cancelRentalController,
} = require("../controllers/rentals.controller");

const API_TOKEN = process.env.API_TOKEN;
const auth = require("../middlewares/auth");

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
    auth(API_TOKEN, req, res, createRentalController);
  });

  app.put(`${route}/:id`, (req, res) => {
    auth(API_TOKEN, req, res, returnRentalController);
  });

  app.delete(`${route}/:id`, (req, res) => {
    auth(API_TOKEN, req, res, cancelRentalController);
  });
}

module.exports = globalRentalsRoutes;
