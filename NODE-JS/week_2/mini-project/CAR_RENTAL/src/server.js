const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config();
const APP_PORT = process.env.APP_PORT;
const API_CARS_URL = process.env.API_CARS_URL;
const API_RENTS_URL = process.env.API_RENTS_URL;

const Logger = require("./middlewares/logger");
Logger(app);

app.use(express.static("./public"));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

const globalCarRoutes = require("./routes/cars.routes");
globalCarRoutes(express, app, API_CARS_URL);
const globalRentalsRoutes = require("./routes/rentals.routes");
globalRentalsRoutes(express, app, API_RENTS_URL);

app.listen(3000, () =>
  console.log("app is launched on  http://localhost:3000")
);
