const fs = require("fs");
const path = require("path");

const JSON_FILE = path.join(__dirname, "../data/products.json");
const JSON_DATA = fs.readFileSync(JSON_FILE, "utf-8");

// let products = JSON.parse(content);

function getAllProuctsService() {
  return JSON_DATA;
}

function getProductsByFilter() {
  const { category, minPrice, maxPrice, sort } = req.params;
  if (category) {
    products = products.filter((p) =>
      p.category.toLowerCase().includes(category)
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
}

// Logging
// console.log(
//   `[${new Date().toISOString()}] /products`,
//   req.query,
//   `Résultats : ${products.length}`
// );

module.exports = {
  getAllProuctsService,
};
