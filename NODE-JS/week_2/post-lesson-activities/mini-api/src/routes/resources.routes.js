const API_RESOURCES = "/api/resources";
const {
  getResourcesController,
  getResourceByIDController,
  addResourceController,
  updateResourceController,
  deleteResourceController,
} = require("../controllers/resources.controller.js");

function resourcesRoutes(app) {
  app.get(`${API_RESOURCES}`, (req, res) => {
    getResourcesController(res);
  });

  app.get(`${API_RESOURCES}/:id`, (req, res) => {
    getResourceByIDController(req.params.id, res);
  });

  app.post(`${API_RESOURCES}`, (req, res) => {
    console.log(req.body);
    addResourceController(req.body, res);
  });

  app.put(`${API_RESOURCES}/:id`, (req, res) => {});
  app.delete(`${API_RESOURCES}`, (req, res) => {});
}

module.exports = resourcesRoutes;
