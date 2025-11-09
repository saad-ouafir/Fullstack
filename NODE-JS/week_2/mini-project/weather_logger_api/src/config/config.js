module.exports = {
  port: process.env.PORT || 3000,
  dataFile: process.env.DATA_FILE || "./data/weather-data.json",
  hmacSecret: process.env.HMAC_SECRET,
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
};
