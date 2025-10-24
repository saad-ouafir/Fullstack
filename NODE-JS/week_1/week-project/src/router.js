import controllerMethods from "./controllers/productsController.js";

import { parse } from "url";
process.loadEnvFile(".env");

const PRODUCTS_API = process.env.API_PRODUCTS;
const ORDERS_API = process.env.API_ORDERS;
const HEALTH_API = process.env.API_HEALTH;

const routing = (req, resp) => {
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname;
  req.query = parsedUrl.query;
  console.log(req.query);

  switch (pathname) {
    case "/":
      resp.end("WELCOME TO SMART INVENTORY SYSTEM !");
      break;
    case PRODUCTS_API:
      controllerMethods.getProductsController(req, resp);
      break;
    case ORDERS_API:
      resp.end("Orders API - Coming Soon");
      break;
    case HEALTH_API:
      resp.end("Health Check - OK");
      break;
    default:
      resp.statusCode = 404;
      resp.end("Not Found");
  }
};

export default routing;
