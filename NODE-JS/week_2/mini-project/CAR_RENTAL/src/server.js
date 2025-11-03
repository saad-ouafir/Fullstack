const express = require("express");
const app = express();
const Logger = require("./middlewares/logger");
require("dotenv").config();

const APP_PORT = process.env.APP_PORT;
const API_CARS_URL = process.env.API_CARS_URL;
const API_RENTS_URL = process.env.API_RENTS_URL;

Logger(app);

router.get("/", (req, res) => {
  res.status(200).json("Welcome to car rental API");
});

const globalCarRoutes = require("./routes/cars.routes");
globalCarRoutes(express, app, API_CARS_URL);
const globalRentalsRoutes = require("./routes/rentals.routes");
globalRentalsRoutes(express, app, API_RENTS_URL);

app.listen(3000, () =>
  console.log("app is launched on  http://localhost:3000")
);
