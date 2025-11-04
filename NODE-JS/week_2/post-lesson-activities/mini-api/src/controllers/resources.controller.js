const {
  getResourcesService,
  getResourceByIDService,
  addResourceService,
  updateResourceService,
  deleteResourceService,
} = require("../services/resources.service.js");

const AppError = require("../middlewares/appError.js");

function setResult(result, res, next) {
  if (result.error) {
    return next(new AppError(result.message, result.statusCode));
  }

  res.status(result.statusCode);
  res.send(result.data);
}

function getResourcesController(res, next) {
  setResult(getResourcesService(), res, next);
}

function getResourceByIDController(id, res, next) {
  setResult(getResourceByIDService(id), res, next);
}

function addResourceController(req, res, next) {
  setResult(addResourceService(req.body), res, next);
}

function updateResourceController(req, res, next) {
  setResult(updateResourceService(req.params.id, req.body), res, next);
}

function deleteResourceController(req, res, next) {
  setResult(deleteResourceService(req.params.id), resp, next);
}

module.exports = {
  getResourcesController,
  getResourceByIDController,
  addResourceController,
  updateResourceController,
  deleteResourceController,
};
