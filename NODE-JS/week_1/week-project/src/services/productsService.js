const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../../data/products.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

function getProductsService(params) {
  try {
    let results = [...data];

    if (isNaN(params.id) === false) {
      results = results.filter(
        (product) => Number(params.id) === Number(product.id)
      );
      return {
        data: results,
      };
    } else if (params.sku !== undefined) {
      results = results.filter((product) => params.sku === product.sku);
      return {
        data: results,
      };
    } else {
      if (params.category) {
        results = results.filter((product) =>
          product.category.toLowerCase().includes(params.category.toLowerCase())
        );
      }

      if (params.minPrice !== undefined && !isNaN(Number(params.minPrice))) {
        results = results.filter(
          (product) => product.price >= Number(params.minPrice)
        );
      }

      if (params.maxPrice !== undefined && !isNaN(Number(params.maxPrice))) {
        results = results.filter(
          (product) => product.price <= Number(params.maxPrice)
        );
      }

      if (params.inStock !== undefined) {
        const inStockValue =
          params.inStock === "true" || params.inStock === true;
        results = results.filter((product) => product.inStock === inStockValue);
      }

      if (params.quantity !== undefined && !isNaN(Number(params.quantity))) {
        results = results.filter(
          (product) => product.quantity >= Number(params.quantity)
        );
      }

      const page = parseInt(params.page) || undefined;
      const limit = parseInt(params.limit) || undefined;

      let paginatedResults;
      if (page >= 1 && limit != undefined) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        paginatedResults = results.slice(startIndex, endIndex);
      } else {
        paginatedResults = results;
      }

      return {
        data: paginatedResults,
      };
    }
  } catch (error) {
    console.error("Error in getProductsService:", error);
    throw new Error("Failed to fetch products");
  }
}

module.exports = {
  getProductsService,
};
