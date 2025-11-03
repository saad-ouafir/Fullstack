const path = require("path");
const fs = require("fs");

const JSON_DATA_FILE = path.join(__dirname, "../data/data.json");
const JSON_DATA = JSON.parse(fs.readFileSync(JSON_DATA_FILE, "utf-8"));

function filterCars(cars, query) {
  const { category, available, minpricePerDay, maxpricePerDay, q } = query;
  if (category !== undefined) {
    cars = cars.filter((c) => c.category === category);
  }

  if (available !== undefined) {
    const isAvailable = available === "true" || available === true;
    cars = cars.filter((c) => c.available === isAvailable);
  }

  const minPrice = parseFloat(minpricePerDay);
  const maxPrice = parseFloat(maxpricePerDay);

  if (!isNaN(minPrice) && !isNaN(maxPrice)) {
    if (minPrice > maxPrice) {
      throw new Error("minpricePerDay must be less than maxpricePerDay");
    }
    cars = cars.filter(
      (c) => c.pricePerDay >= minPrice && c.pricePerDay <= maxPrice
    );
  } else {
    if (!isNaN(minPrice) && minPrice > 0) {
      cars = cars.filter((c) => c.pricePerDay >= minPrice);
    }
    if (!isNaN(maxPrice) && maxPrice > 0) {
      cars = cars.filter((c) => c.pricePerDay <= maxPrice);
    }
  }
  if (q) {
    const lowerQ = q.toLowerCase();
    cars = cars.filter(
      (c) => c.plate && c.plate.toLowerCase().includes(lowerQ)
    );
  }

  return cars;
}

function paginateData(data, page, limit) {
  let start;
  let end;
  if (page && limit) {
    page = parseInt(page) || 0;
    limit = parseInt(limit) || 10;
    start = page * 10;
    end = start + limit;
  }
  return data.slice(start, end);
}

function getAllCarsService(query) {
  let cars = [...JSON_DATA];
  let filtered_cars = filterCars(cars, query);
  let result = paginateData(filtered_cars, query.page, query.limit);
  return result;
}

function getCarByIdService(id) {
  let data = JSON_DATA;
  return data.find((c) => c.id === Number(id)) || false;
}

function createCarService(carData) {
  let data = [...JSON_DATA];
  carData.id = data.length + 1;
  carData.available = true;
  carData.createdAt = new Date().toISOString();
  carData.updatedAt = new Date().toISOString();
  data.push(carData);
  fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
  return true;
}

function updateCarService(id, carData) {
  let data = [...JSON_DATA];
  let index = data.findIndex((carData) => Number(carData.id === Number(id)));
  if (index !== -1) {
    data[index].pricePerDay = parseFloat(carData.pricePerDay);
    data[index].available = carData.available;
    data[index].updatedAt = new Date().toISOString();
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
    return true;
  } else {
    return false;
  }
}

function deleteCarService(id) {
  let data = [...JSON_DATA];
  let new_data =
    data.filter((carData) => Number(carData.id) !== Number(id)) || undefined;
  if (new_data !== undefined) {
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(new_data));
    return true;
  } else {
    return false;
  }
}
module.exports = {
  getAllCarsService,
  getCarByIdService,
  createCarService,
  updateCarService,
  deleteCarService,
};
