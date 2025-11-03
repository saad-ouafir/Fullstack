const {
  getResourcesService,
  getResourceByIDService,
  addResourceService,
  updateResourceService,
  deleteResourceService,
} = require("../services/resources.service.js");

function setResult(result, res) {
  res.status(result.statusCode);
  res.send(result.data);
}

function getResourcesController(res) {
  setResult(getResourcesService(), res);
}

function getResourceByIDController(id, res) {
  setResult(getResourceByIDService(id), res);
}

function addResourceController(req, res) {
  setResult(addResourceService(req.body), res);
}

function updateResourceController(req, res) {
  setResult(updateResourceService(req.params.id, req.body), res);
}

function deleteResourceController(req, resp) {
  setResult(deleteResourceService(req.params.id), resp);
}

module.exports = {
  getResourcesController,
  getResourceByIDController,
  addResourceController,
  updateResourceController,
  deleteResourceController,
};
