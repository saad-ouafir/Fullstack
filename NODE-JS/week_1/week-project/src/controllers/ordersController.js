const ordersService = require("../services/ordersService");
const sendJson = require("../utils/sendJson");
const logger = require("../utils/logger");
function getOrdersController(req, res) {
  const { id, orderNumber, status, from, to, page, limit } =
    req.query || {};

  try {
    const result = ordersService.getordersService({
      id,
      orderNumber,
      status,
      from,
      to,
      page,
      limit,
    });
    sendJson(res, result, 200);
    logger.emit("response:sent", { statusCode: 200, url: req.url });
  } catch (error) {
    console.error("Error in while finding the order");
    sendJson(res, { error: "Internal server error" }, 500);
    logger.emit("response:sent", { statusCode: 500, url: req.url });
  }
}

module.exports = {
  getOrdersController,
};
