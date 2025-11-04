const API_RESOURCES = "/api/resources";
const {
  getResourcesController,
  getResourceByIDController,
  addResourceController,
  updateResourceController,
  deleteResourceController,
} = require("../controllers/resources.controller.js");

const validateResource = require("../middlewares/resources.validation.js");
const AppError = require("../middlewares/appError.js");
const errorHandler = require("../middlewares/errorHandler.js");

function resourcesRoutes(express, app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get(`${API_RESOURCES}`, (req, res, next) => {
    getResourcesController(res, next);
  });

  app.get(`${API_RESOURCES}/:id`, (req, res, next) => {
    getResourceByIDController(req.params.id, res, next);
  });

  app.post(API_RESOURCES, validateResource, (req, res, next) => {
    addResourceController(req, res, next);
  });

  app.put(`${API_RESOURCES}/:id`, validateResource, (req, res, next) => {
    updateResourceController(req, res, next);
  });

  app.delete(`${API_RESOURCES}/:id`, (req, res, next) => {
    deleteResourceController(req, res, next);
  });

  // app.use((req, res, next) => {
  //   next(new AppError(`Route not found`, 404));
  // });

  app.use(errorHandler);
}

module.exports = resourcesRoutes;
