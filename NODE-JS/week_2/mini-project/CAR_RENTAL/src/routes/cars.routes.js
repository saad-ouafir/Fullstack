const {
  getAllCarsController,
  getCarByIdController,
  createCarController,
  updateCarController,
  deleteCarController,
} = require("../controllers/cars.controller");

const API_TOKEN = process.env.API_TOKEN;
const auth = require("../middlewares/auth");

function globalCarRoutes(express, app, route) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Selection des tous les véhicule
  app.get(`${route}`, (req, res) => {
    getAllCarsController(req, res);
  });

  // Détails d'un véhicule
  app.get(`${route}/:id`, (req, res) => {
    getCarByIdController(req, res);
  });

  // Créer un véhicule
  app.post(`${route}`, (req, res) => {
    auth(API_TOKEN, req, res, createCarController);
  });

  // Modifier un véhicule
  app.put(`${route}/:id`, (req, res) => {
    auth(API_TOKEN, req, res, updateCarController);
  });

  // Supprimer un véhicule
  app.delete(`${route}/:id`, (req, res) => {
    auth(API_TOKEN, req, res, deleteCarController);
  });
}

module.exports = globalCarRoutes;
