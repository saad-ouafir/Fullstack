const fs = require("fs");
const path = require("path");

const JSON_FILE = path.join(__dirname, "../data/products.json");
const JSON_DATA = JSON.parse(fs.readFileSync(JSON_FILE, "utf-8"));

// let products = JSON.parse(content);
function paginateData(data, page, limit) {
  let start;
  let end;
  if (page || limit) {
    page = parseInt(page) || 0;
    limit = parseInt(limit) || 10;
    start = page * 10;
    end = start + limit;
  }
  return data.slice(start, end);
}

function getProductsByFilter(params, products) {
  const { category, minPrice, maxPrice, sort } = params;
  if (category) {
    products = products.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }
  if (minPrice) {
    products = products.filter((p) => Number(p.price) >= Number(minPrice));
  }
  if (maxPrice) {
    products = products.filter((p) => Number(p.price) <= Number(maxPrice));
  }

  if (sort === "asc") {
    products = products.sort((a, b) => a.price - b.price);
  } else if (sort === "desc") {
    products = products.sort((a, b) => b.price - a.price);
  }

  return products;
}

function getAllProuctsService(query) {
  let products = [...JSON_DATA];
  let filteredProducts = getProductsByFilter(query, products);
  console.log(
    `[${new Date().toISOString()}] /products`,
    query,
    `Résultats : ${products.length}`
  );
  return paginateData(filteredProducts, query.page, query.limit);
}

module.exports = {
  getAllProuctsService,
};
