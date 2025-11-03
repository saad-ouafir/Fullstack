const API_RESOURCES = "/api/resources";
const {
  getResourcesController,
  getResourceByIDController,
  addResourceController,
  updateResourceController,
  deleteResourceController,
} = require("../controllers/resources.controller.js");

const validateResource = require("../middlewares/resources.validation.js");

function resourcesRoutes(express, app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get(`${API_RESOURCES}`, (req, res) => {
    getResourcesController(res);
  });

  app.get(`${API_RESOURCES}/:id`, (req, res) => {
    getResourceByIDController(req.params.id, res);
  });

  app.post("/api/resources", validateResource, (req, res) =>
    addResourceController(req, res)
  );

  app.put(`${API_RESOURCES}/:id`, validateResource, (req, res) => {
    updateResourceController(req, res);
  });

  app.delete(`${API_RESOURCES}/:id`, (req, res) => {
    deleteResourceController(req, res);
  });
}

module.exports = resourcesRoutes;
