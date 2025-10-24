const productsService = require("../services/productsService");
const sendJson = require("../utils/sendJson");

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
  } catch (error) {
    console.error("Error in getProductsController");
    sendJson(res, { error: "Internal server error" }, 500);
  }
}

module.exports = {
  getProductsController,
};
