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

const routes = [
  {
    path: `${PRODUCTS_API}/sku/`,
    method: 'GET',
    handler: (req, resp) => {
      const sku = req.url.split('/sku/')[1];
      if (!sku) {
        return notFoundHandler(req, resp);
      }
      req.query = { ...req.query, sku };
      controllerMethods.getProductBySku(req, resp);
    }
  },
  {
    path: `${PRODUCTS_API}/`,
    method: 'GET',
    handler: (req, resp) => {
      const path = req.url.split(PRODUCTS_API + '/')[1];
      // If it's just the base products path without any ID
      if (!path) {
        controllerMethods.listProducts(req, resp);
        return;
      }
      // Extract ID from URL and add it to query
      if (!isNaN(path)) {
        req.query = { ...req.query, id: parseInt(path) };
        controllerMethods.getProductById(req, resp);
      } else {
        notFoundHandler(req, resp);
      }
    }
  },
  {
    path: PRODUCTS_API,
    method: 'GET',
    handler: controllerMethods.listProducts
  },
  {
    path: ORDERS_API,
    method: 'GET',
    handler: controllerOrdersMethods.getOrdersController
  },
  {
    path: HEALTH_API,
    method: 'GET',
    handler: (req, resp) => {
      const timestamp = new Date();
      const uptime = os.uptime();
      return sendJson(resp, `Health Check - OK, ${timestamp}, UPTIME : ${uptime}`, 200);
    }
  },
  {
    path: EXPORT_API,
    method: 'GET',
    handler: exportController.exportProductsController
  },
  {
    path: "/",
    method: 'GET',
    handler: (req, resp) => {
      return sendJson(resp, "WELCOME TO SMART INVENTORY SYSTEM !", 200);
    }
  }
];


const notFoundHandler = (req, resp) => {
  return sendJson(resp, "Not Found" , 404);
  
};

const routing = (req, resp) => {
  const parsedUrl = parse(req.url, true);
  req.query = parsedUrl.query;
  const { pathname } = parsedUrl;
  const method = req.method;

  // Find the matching route by checking the most specific routes first
  const route = routes.find(route => {
    if (route.path === '/') {
      return pathname === '/';
    }
    // Check if URL exactly matches the route path or starts with it followed by additional segments
    return pathname === route.path || 
           (pathname.startsWith(route.path) && 
            (pathname.charAt(route.path.length) === '/' || route.path.endsWith('/'))) && 
           method === route.method;
  });

  if (route) {
    route.handler(req, resp);
  } else {
    notFoundHandler(req, resp);
  }
  
  logger.emit("response:sent", { statusCode: resp.statusCode, url: req.url });
};


module.exports = routing;
