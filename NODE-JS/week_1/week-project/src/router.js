const controllerMethods = require("./controllers/productsController.js");
const controllerOrdersMethods = require("./controllers/ordersController.js");
const sendJson= require("./utils/sendJson.js");

const { parse } = require("url");
process.loadEnvFile(".env");

const PRODUCTS_API = process.env.API_PRODUCTS;
const ORDERS_API = process.env.API_ORDERS;
const HEALTH_API = process.env.API_HEALTH;

const routes = {
  [PRODUCTS_API]: controllerMethods.getProductsController,
  [ORDERS_API]: controllerOrdersMethods.getOrdersController,
  [HEALTH_API]: (req, resp) => {
    return sendJson(resp,"Health Check - OK", 200);
  },
  "/": (req, resp) => {
    return sendJson(resp, "WELCOME TO SMART INVENTORY SYSTEM !", 200);
  },
};


const notFoundHandler = (req, resp) => {
  return sendJson(resp, "Not Found" , 404);
};

const routing = (req, resp) => {
  const parsedUrl = parse(req.url, true);
  req.query = parsedUrl.query;
  const { pathname } = parsedUrl;

  const handler = routes[pathname] || notFoundHandler;
  handler(req, resp);
};


module.exports = routing;
