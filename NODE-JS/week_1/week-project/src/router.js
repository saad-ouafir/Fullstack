const controllerMethods = require("./controllers/productsController.js");
const controllerOrdersMethods = require("./controllers/ordersController.js");
const exportController = require("./controllers/exportController.js");
const sendJson= require("./utils/sendJson.js");
const logger=require("./utils/logger.js")
const os = require("os")

const { parse } = require("url");
process.loadEnvFile(".env");

const PRODUCTS_API = process.env.API_PRODUCTS;
const ORDERS_API = process.env.API_ORDERS;
const HEALTH_API = process.env.API_HEALTH;
const EXPORT_API = process.env.API_EXPORT;

const routes = {
  [PRODUCTS_API]: controllerMethods.getProductsController,
  [ORDERS_API]: controllerOrdersMethods.getOrdersController,
  [HEALTH_API]: (req, resp) => {
    const timestamp = new Date();
    const uptime=os.uptime();
    return sendJson(resp,`Health Check - OK, ${timestamp}, UPTIME : ${uptime}`, 200);
  },
  [EXPORT_API]: exportController.exportProductsController,
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
  logger.emit("response:sent", { statusCode: resp.statusCode, url: req.url });
};


module.exports = routing;
