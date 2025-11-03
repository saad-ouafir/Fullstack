const {
  getAllCarsController,
  getCarByIdController,
  createCarController,
  updateCarController,
  deleteCarController,
} = require("../controllers/cars.controller");

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
    createCarController(req, res);
  });

  // Modifier un véhicule
  app.put(`${route}/:id`, (req, res) => {
    updateCarController(req, res);
  });

  // Supprimer un véhicule
  app.delete(`${route}/:id`, (req, res) => {
    deleteCarController(req, res);
  });
}

module.exports = globalCarRoutes;
