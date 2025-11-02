const {
  getResourcesService,
  getResourceByIDService,
  addResourceService,
  updateResourceService,
  deleteResourceService,
} = require("../services/resources.service.js");

const validateResource = require("../middlewares/resources.validation.js");

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

function addResourceController(resource, resp) {
  setResult(addResourceService(resource), resp);
}

function updateResourceController(id, resource, resp) {
  setResult(updateResourceService(id, resource), resp);
}

function deleteResourceController(id, resp) {
  setResult(deleteResourceService(id), resp);
}

module.exports = {
  getResourcesController,
  getResourceByIDController,
  addResourceController,
  updateResourceController,
  deleteResourceController,
};
