const path = require("path");
const fs = require("fs");
const parseData = require("../utils/parseQuery.js");

const filePath = path.resolve(__dirname, "../../data/orders.json");
const rawData = fs.readFileSync(filePath, "utf-8");

const parsedData = JSON.parse(rawData).map((element) => {
  const parsedElement = {};
  for (let key in element) {
    parsedElement[key] = parseData(element[key], typeof element[key]);
  }
  return parsedElement;
});

let orders = [...parsedData];

function parsePaginationParams(params) {
  return {
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : undefined,
  };
}

function paginateResults(results, { page, limit }) {
  if (limit === undefined) return results;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return results.slice(startIndex, endIndex);
}

function getorderById(params) {
  if (isNaN(params.id)) return { data: [] };
  const id = parseData(params.id, "number");
  return { data: orders.filter((order) => order.id === id) };
}

function getOrderByNumber(params) {
  return { data: orders.filter((order) => order.orderNumber === params.orderNumber) };
}

function filterorders(params) {
  return orders.filter((order) => {

    const fromOk = params.from ? new Date(order.date) >= new Date(params.from) : true;
    const toOk = params.to ? new Date(order.date) <= new Date(params.to) : true;
    const statusOk = params.status ? order.status === params.status : true;

    return (
      fromOk &&
      toOk &&
      statusOk 
    );
  });
}

function getordersService(params) {
  if (params.id !== undefined) {
    return getorderById(params);
  } else if (params.orderNumber !== undefined) {
    return getOrderByNumber(params);
  } else {
    const filtered = filterorders(params);
    const { page, limit } = parsePaginationParams(params);
    const paginated = paginateResults(filtered, { page, limit });
    return { data: paginated };
  }
}

module.exports = {
  getordersService,
};
