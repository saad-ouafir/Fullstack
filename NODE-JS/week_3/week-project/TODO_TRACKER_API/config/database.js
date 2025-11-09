const mongoose = require("mongoose");

function connectToDB(MONGO_URL) {
  try {
    if (!MONGO_URL) {
      throw new Error("Please provide a MONGO_URL in the configuration");
    } else {
      mongoose.connect(MONGO_URL);
      console.log("Connected to MongoDB");
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectToDB;
