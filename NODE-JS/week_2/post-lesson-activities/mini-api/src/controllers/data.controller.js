const { getAllProuctsService } = require("../services/data.service.js");

function getAllProuctsController(req, res) {
  res.status(200).json(getAllProuctsService(req.query));
}

module.exports = {
  getAllProuctsController,
};
