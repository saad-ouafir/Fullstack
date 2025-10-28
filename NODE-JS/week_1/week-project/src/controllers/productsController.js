const productsService = require("../services/productsService");
const sendJson = require("../utils/sendJson");
const logger = require("../utils/logger");

function validateQueryParams(params) {
  const { minPrice, maxPrice } = params;
  
  if (minPrice && isNaN(Number(minPrice))) {
    throw new Error('minPrice must be a number');
  }
  if (maxPrice && isNaN(Number(maxPrice))) {
    throw new Error('maxPrice must be a number');
  }
  if (params.page && isNaN(Number(params.page))) {
    throw new Error('page must be a number');
  }
  if (params.limit && isNaN(Number(params.limit))) {
    throw new Error('limit must be a number');
  }
}

function listProducts(req, res) {
  const { q, category, minPrice, maxPrice, inStock, page, limit, sort, order } = req.query || {};

  try {
    validateQueryParams(req.query);
    
    const result = productsService.getProductsService({
      q,
      category,
      minPrice,
      maxPrice,
      inStock,
      page,
      limit,
      sort,
      order
    });
    
    sendJson(res, result, 200);
    logger.emit("response:sent", { statusCode: 200, url: req.url });
  } catch (error) {
    if (error.message.includes('must be')) {
      sendJson(res, { error: error.message }, 400);
      logger.emit("response:sent", { statusCode: 400, url: req.url });
    } else {
      console.error("Error while finding products:", error);
      sendJson(res, { error: "Internal server error" }, 500);
      logger.emit("response:sent", { statusCode: 500, url: req.url });
    }
  }
}

function getProductById(req, res) {
  try {
    const result = productsService.getProductsService({ id: req.query.id });
    
    if (result.data.length === 0) {
      sendJson(res, { error: "Product not found" }, 404);
      logger.emit("response:sent", { statusCode: 404, url: req.url });
      return;
    }
    
    sendJson(res, result, 200);
    logger.emit("response:sent", { statusCode: 200, url: req.url });
  } catch (error) {
    console.error("Error while finding product by id:", error);
    sendJson(res, { error: "Internal server error" }, 500);
    logger.emit("response:sent", { statusCode: 500, url: req.url });
  }
}

function getProductBySku(req, res) {
  try {
    const result = productsService.getProductsService({ sku: req.query.sku });
    
    if (result.data.length === 0) {
      sendJson(res, { error: "Product not found" }, 404);
      logger.emit("response:sent", { statusCode: 404, url: req.url });
      return;
    }
    
    sendJson(res, result, 200);
    logger.emit("response:sent", { statusCode: 200, url: req.url });
  } catch (error) {
    console.error("Error while finding product by SKU:", error);
    sendJson(res, { error: "Internal server error" }, 500);
    logger.emit("response:sent", { statusCode: 500, url: req.url });
  }
}

module.exports = {
  listProducts,
  getProductById,
  getProductBySku
};
