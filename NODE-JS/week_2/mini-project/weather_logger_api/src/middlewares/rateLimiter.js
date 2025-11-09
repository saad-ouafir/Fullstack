const rateLimit = require("express-rate-limit");
const config = require("../config/config");

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: {
      message: "Too many requests from this IP, please try again later.",
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
