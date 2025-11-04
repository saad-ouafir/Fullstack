const {
  getAllRentalsService,
  getRentalByIdService,
  createRentalService,
  returnRentalService,
  cancelRentalService,
} = require("../services/rentals.service");
const { validateRentalData } = require("../middlewares/validators");

function getAllRentalsController(req, res) {
  console.log(req.query);
  res.status(200).json(getAllRentalsService(req.query));
}

function getRentalByIdController(req, res) {
  const result = getRentalByIdService(req.params.id);
  result !== false
    ? res.status(200).send(result)
    : res.status(404).json("Error, rental Not Found !");
}

function createRentalController(req, res) {
  const validationErrors = validateRentalData(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const result = createRentalService(req.body);
  if (result === true) {
    res.status(201).json("rental Created Secussfully !");
  } else if (result.error) {
    const statusCode = result.conflict ? 409 : 400;
    res.status(statusCode).json({ error: result.error });
  }
}

function returnRentalController(req, res) {
  if (returnRentalService(req.params.id, req.body) === true) {
    res.status(200).json("return car Secussfully !");
  } else {
    res.status(404).json("rental NOT FOUND !");
  }
}

function cancelRentalController(req, res) {
  if (cancelRentalService(req.params.id) === true) {
    res.status(200).json("cancelled Secussfully !");
  } else {
    res.status(404).json("rental NOT FOUND !");
  }
}

module.exports = {
  getAllRentalsController,
  getRentalByIdController,
  createRentalController,
  returnRentalController,
  cancelRentalController,
};
