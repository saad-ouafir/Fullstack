const path = require("path");
const fs = require("fs");

const JSON_DATA_FILE = path.join(__dirname, "../data/data.json");
const JSON_DATA = fs.readFileSync(JSON_DATA_FILE, "utf-8");


function getAllCarsService() {
  return JSON_DATA;
}

function getCarByIdService(id) {
  let data = JSON.parse(JSON_DATA)
  return data.find(c=>c.id===Number(id))
}

function createCarService(carData) {
  let data = [...JSON.parse(JSON_DATA)];
  carData.id = data.length + 1;
  carData.available=true;
  carData.createdAt = new Date().toISOString();
  carData.updatedAt=new Date().toISOString();
  data.push(carData);
  fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
  return true;
}

function updateCarService(id, carData) {
  let data = [...JSON.parse(JSON_DATA)];
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
  let data = [...JSON.parse(JSON_DATA)];
  let new_data =
    data.filter((carData) => Number(carData.id) !== Number(id)) || undefined;
  if (new_data !== undefined) {
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(new_data));
    return true;
  } else {
    return false;
  }
}
module.exports={
  getAllCarsService,
  getCarByIdService,
  createCarService,
  updateCarService,
  deleteCarService,
}
