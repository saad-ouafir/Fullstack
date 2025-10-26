const productsService = require("../services/productsService");
const sendJson = require("../utils/sendJson");
const logger = require("../utils/logger");
function getProductsController(req, res) {
  const { id, sku, category, minPrice, maxPrice, inStock, page, limit } =
    req.query || {};

  try {
    const result = productsService.getProductsService({
      id,
      sku,
      category,
      minPrice,
      maxPrice,
      inStock,
      page,
      limit,
    });
    sendJson(res, result, 200);
    logger.emit("response:sent", { statusCode: 200, url: req.url });
  } catch (error) {
    console.error("Error in while finding the product");
    sendJson(res, { error: "Internal server error" }, 500);
    logger.emit("response:sent", { statusCode: 500, url: req.url });
  }
}

module.exports = {
  getProductsController,
};
