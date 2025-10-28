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
  const product = products.find((product) => product.id === id);
  return product ? { data: [product] } : { data: [] };
}

function getProductBySku(params) {
  return { data: products.filter((product) => product.sku === params.sku) };
}

function filterProducts(params) {
  return products.filter((product) => {
    const matchesQuery = !params.q || 
      Object.values(product).some(val => 
        String(val).toLowerCase().includes(params.q.toLowerCase())
      );
    const matchesCategory =
      !params.category ||
      product.category.toLowerCase().includes(params.category.toLowerCase());
    const matchesMinPrice =
      params.minPrice === undefined ||
      isNaN(Number(params.minPrice)) ||
      product.price >= Number(params.minPrice);
    const matchesMaxPrice =
      params.maxPrice === undefined ||
      isNaN(Number(params.maxPrice)) ||
      product.price <= Number(params.maxPrice);
    const matchesStock =
      params.inStock === undefined ||
      product.inStock === (params.inStock === "true");
    return (
      matchesQuery &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesStock
    );
  });
}

function sortResults(results, sort, order) {
  if (!sort) return results;
  
  const sortOrder = order?.toLowerCase() === 'desc' ? -1 : 1;
  return [...results].sort((a, b) => {
    if (a[sort] < b[sort]) return -1 * sortOrder;
    if (a[sort] > b[sort]) return 1 * sortOrder;
    return 0;
  });
}

function validateParams(params) {
  if (params.minPrice && params.maxPrice) {
    if (Number(params.minPrice) > Number(params.maxPrice)) {
      throw new Error('minPrice must be less than or equal to maxPrice');
    }
  }
}

function getProductsService(params) {
  try {
    validateParams(params);
    
    if (params.id !== undefined) {
      return getProductById(params);
    } else if (params.sku !== undefined) {
      return getProductBySku(params);
    } else {
      const filtered = filterProducts(params);
      const sorted = sortResults(filtered, params.sort, params.order);
      const { page, limit } = parsePaginationParams(params);
      const paginated = paginateResults(sorted, { page, limit });
      const total = filtered.length;
      const pages = limit ? Math.ceil(total / limit) : 1;
      
      return { 
        data: paginated,
        total,
        page: page || 1,
        pages
      };
    }
  } catch (error) {
    throw error;
  }
}

function getAllProducts() {
  return products;
}

module.exports = {
  getProductsService,
  getAllProducts,
};
