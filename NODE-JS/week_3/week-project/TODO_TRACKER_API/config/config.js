require("dotenv").config();

module.exports = {
  PORT_APP: process.env.PORT_APP || 3000,
  MONGO_URL: process.env.MONGO_URL,
};
