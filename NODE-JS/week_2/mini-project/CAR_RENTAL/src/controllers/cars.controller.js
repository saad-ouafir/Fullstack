const {
  getAllCarsService,
  getCarByIdService,
  createCarService,
  updateCarService,
  deleteCarService,
} = require("../services/car.service");
const { validateCarData } = require("../middlewares/validators");

function getAllCarsController(req, res) {
  console.log(req.query);
  res.status(200).json(getAllCarsService(req.query));
}

function getCarByIdController(req, res) {
  const result = getCarByIdService(req.params.id);
  result !== false
    ? res.status(200).send(result)
    : res.status(404).json("Error, car Not Found !");
}

function createCarController(req, res) {
  const validationErrors = validateCarData(req.body, false);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const result = createCarService(req.body);
  if (result === true) {
    res.status(201).json("car Created Secussfully !");
  } else if (result.error) {
    res.status(409).json({ error: result.error });
  }
}

function updateCarController(req, res) {
  const validationErrors = validateCarData(req.body, true);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const result = updateCarService(req.params.id, req.body);
  if (result === true) {
    res.status(200).json("car Updated Secussfully !");
  } else if (result === false) {
    res.status(404).json("car NOT FOUND !");
  } else if (result.error) {
    res.status(409).json({ error: result.error });
  }
}

function deleteCarController(req, res) {
  if (deleteCarService(req.params.id) === true) {
    res.status(200).json("car Deleted Secussfully !");
  } else {
    res.status(404).json("car NOT FOUND !");
  }
}

module.exports = {
  getAllCarsController,
  getCarByIdController,
  createCarController,
  updateCarController,
  deleteCarController,
};
