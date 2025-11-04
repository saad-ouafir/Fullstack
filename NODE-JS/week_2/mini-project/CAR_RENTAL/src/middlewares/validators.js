// Validation helpers

function validateCarData(carData, isUpdate = false) {
  const errors = [];
  const validCategories = ["eco", "sedan", "suv", "van"];

  if (!isUpdate || carData.brand !== undefined) {
    if (!carData.brand || carData.brand.trim() === "") {
      errors.push("brand is required and cannot be empty");
    }
  }

  if (!isUpdate || carData.model !== undefined) {
    if (!carData.model || carData.model.trim() === "") {
      errors.push("model is required and cannot be empty");
    }
  }

  if (!isUpdate || carData.category !== undefined) {
    if (!carData.category || !validCategories.includes(carData.category)) {
      errors.push(`category must be one of: ${validCategories.join(", ")}`);
    }
  }

  if (!isUpdate || carData.pricePerDay !== undefined) {
    const price = parseFloat(carData.pricePerDay);
    if (isNaN(price) || price <= 0) {
      errors.push("pricePerDay must be a number greater than 0");
    }
  }

  if (!isUpdate || carData.plate !== undefined) {
    if (carData.plate && carData.plate.trim() === "") {
      errors.push("plate cannot be empty if provided");
    }
  }

  return errors;
}

function validateRentalData(rentalData) {
  const errors = [];

  if (!rentalData.carId || isNaN(parseInt(rentalData.carId))) {
    errors.push("carId is required and must be a valid number");
  }

  // if (!rentalData.customer) {
  //   errors.push("customer is required");
  // } else {
  if (!rentalData.customer.name || rentalData.customer.name.trim() === "") {
    errors.push("customer.name is required and cannot be empty");
  }

  if (!rentalData.customer.email) {
    errors.push("customer.email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rentalData.customer.email)) {
      errors.push("customer.email must be a valid email format");
    }
  }
  // }

  if (!rentalData.from) {
    errors.push("from date is required");
  } else {
    const dateRegex = /^20[0-9]{2}-[0-9]{2}-[0-9]{2}$/;
    if (!dateRegex.test(rentalData.from)) {
      errors.push("from must be in format YYYY-MM-DD");
    }
  }

  if (
    !rentalData.days ||
    isNaN(parseInt(rentalData.days)) ||
    parseInt(rentalData.days) <= 0
  ) {
    errors.push("days is required and must be a number greater than 0");
  }

  return errors;
}

module.exports = {
  validateCarData,
  validateRentalData,
};
