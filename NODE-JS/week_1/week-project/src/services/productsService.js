const path = require("path");
const fs = require("fs");
const parseData = require("../utils/parseQuery.js");

const filePath = path.resolve(__dirname, "../../data/products.json");
const rawData = fs.readFileSync(filePath, "utf-8");

const parsedData = JSON.parse(rawData).map((element) => {
  const parsedElement = {};
  for (let key in element) {
    parsedElement[key] = parseData(element[key], typeof element[key]);
  }
  return parsedElement;
});

let products = [...parsedData];

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

function getProductById(params) {
  if (isNaN(params.id)) return { data: [] };
  const id = parseData(params.id, "number");
  return { data: products.filter((product) => product.id === id) };
}

function getProductBySku(params) {
  return { data: products.filter((product) => product.sku === params.sku) };
}

function filterProducts(params) {
  return products.filter((product) => {
    const matchesCategory =
      !params.category ||
      product.category.toLowerCase().includes(params.category.toLowerCase());
    const matchesMinPrice =
      params.minPrice === undefined ||
      isNaN(Number(params.minPrice)) ||
      product.price >= parseData(params.minPrice, "number");
    const matchesMaxPrice =
      params.maxPrice === undefined ||
      isNaN(Number(params.maxPrice)) ||
      product.price <= parseData(params.maxPrice, "number");
    const matchesStock =
      params.inStock === undefined ||
      product.inStock ===
        (params.inStock === "true" ||
          parseData(params.inStock, "boolean") === true);
    const matchesQuantity =
      params.quantity === undefined ||
      isNaN(Number(params.quantity)) ||
      product.quantity >= Number(params.quantity);
    return (
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesStock &&
      matchesQuantity
    );
  });
}

function getProductsService(params) {
  if (params.id !== undefined) {
    return getProductById(params);
  } else if (params.sku !== undefined) {
    return getProductBySku(params);
  } else {
    const filtered = filterProducts(params);
    const { page, limit } = parsePaginationParams(params);
    const paginated = paginateResults(filtered, { page, limit });
    return { data: paginated };
  }
}

module.exports = {
  getProductsService,
};
