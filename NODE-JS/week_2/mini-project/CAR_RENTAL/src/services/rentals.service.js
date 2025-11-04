const path = require("path");
const fs = require("fs");
const { updateCarService, getCarByIdService } = require("./car.service.js");
const JSON_DATA_FILE = path.join(__dirname, "../data/rents.json");
const JSON_DATA = fs.readFileSync(JSON_DATA_FILE, "utf-8");

// Helper function to check if two date ranges overlap
function overlaps(aFrom, aTo, bFrom, bTo) {
  return aFrom < bTo && bFrom < aTo;
}

// Helper function to calculate difference in days
function differenceInDays(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const diffTime = toDate - fromDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

function filterRental(rentals, query) {
  const { status, from, to, carId } = query;
  if (status !== undefined) {
    rentals = rentals.filter((r) => r.status === status);
  }

  if (carId !== undefined) {
    rentals = rentals.filter((r) => r.carId === Number(carId));
  }
  if (from && /^20[0-9]{2}\-[0-9]{2}\-[0-9]{2}$/.test(from))
    rentals = rentals.filter((r) => r.from === from);

  if (to && /^20[0-9]{2}\-[0-9]{2}\-[0-9]{2}$/.test(to))
    rentals = rentals.filter((r) => r.to === to);

  return rentals;
}
function paginateData(data, page, limit) {
  let start;
  let end;
  if (page && limit) {
    page = parseInt(page) || 0;
    limit = parseInt(limit) || 10;
    start = page * limit;
    end = start + limit;
  }
  return data.slice(start, end);
}
function getAllRentalsService(query) {
  let rentals = [...JSON.parse(JSON_DATA)];
  let filter_rental = filterRental(rentals, query);
  let result = paginateData(filter_rental, query.page, query.limit);
  return result;
}

function getRentalByIdService(id) {
  let data = JSON.parse(JSON_DATA);
  return data.find((c) => c.id === Number(id)) || false;
}

function createRentalService(rentalData) {
  let data = JSON.parse(JSON_DATA);
  const car = getCarByIdService(rentalData.carId);
  
  if (!car) {
    return { error: "car not found" };
  }
  
  if (!car.available) {
    return { error: "car not available", conflict: true };
  }
  
  // Calculate rental dates
  const fromDate = new Date(rentalData.from);
  const days = parseInt(rentalData.days);
  const toDate = new Date(fromDate);
  toDate.setDate(fromDate.getDate() + days);
  const toDateString = toDate.toISOString().split("T")[0];
  
  // Check for overlapping active rentals
  const activeRentals = data.filter(
    (rental) =>
      rental.carId === rentalData.carId && rental.status === "active"
  );
  
  for (const rental of activeRentals) {
    if (overlaps(rentalData.from, toDateString, rental.from, rental.to)) {
      return {
        error: `car has an active rental from ${rental.from} to ${rental.to}`,
        conflict: true,
      };
    }
  }
  
  // Calculate total with proper days calculation
  const calculatedDays = Math.max(1, days);
  
  rentalData.to = toDateString;
  rentalData.id = data.length + 1;
  rentalData.days = calculatedDays;
  rentalData.dailyRate = car.pricePerDay;
  rentalData.total = rentalData.dailyRate * calculatedDays;
  rentalData.status = "active";
  rentalData.createdAt = new Date().toISOString();
  rentalData.updatedAt = new Date().toISOString();
  
  data.push(rentalData);
  updateCarService(car.id, { available: false });
  fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
  
  return true;
}

function returnRentalService(id, body) {
  let data = [...JSON.parse(JSON_DATA)];
  let index = data.findIndex((r) => Number(r.id) === Number(id));
  if (index !== -1 && data[index].status == "active") {
    data[index].status = "returned";
    data[index].updatedAt = new Date().toISOString();
    updateCarService(data[index].carId, { available: true });
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
    return true;
  } else {
    return false;
  }
}

function cancelRentalService(id) {
  let data = [...JSON.parse(JSON_DATA)];
  let index = data.findIndex((r) => Number(r.id) === Number(id));
  if (index !== -1 && data[index].status == "active") {
    data[index].status = "cancelled";
    data[index].updatedAt = new Date().toISOString();
    updateCarService(data[index].carId, { available: true });
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
    return true;
  } else {
    return false;
  }
}
module.exports = {
  getAllRentalsService,
  getRentalByIdService,
  createRentalService,
  returnRentalService,
  cancelRentalService,
};
