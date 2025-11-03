const { log } = require("console");
const {
  getAllCarsService,
  getCarByIdService,
  createCarService,
  updateCarService,
  deleteCarService,
} = require("../services/car.service");

function getAllCarsController(req, res) {
  console.log(req.query);
  res.status(200).json(getAllCarsService(req.query));
}

function getCarByIdController(req, res) {
  res.status(200);
  result = getCarByIdService(req.params.id);
  result !== false
    ? res.status(200).send(result)
    : res.status(404).json("Error, car Not Found !");
}

function createCarController(req, res) {
  if (createCarService(req.body) === true) {
    res.status(201).json("car Created Secussfully !");
  }
}

function updateCarController(req, res) {
  if (updateCarService(req.params.id, req.body) === true) {
    res.status(200).json("car Updated Secussfully !");
  } else {
    res.status(404).json("car  NOT FOUND !");
  }
}

function deleteCarController(req, res) {
  if (deleteCarService(req.params.id) === true) {
    res.status(200).json("car Deleted Secussfully !");
  } else {
    res.status(404).json("car  NOT FOUND !");
  }
}

module.exports = {
  getAllCarsController,
  getCarByIdController,
  createCarController,
  updateCarController,
  deleteCarController,
};
