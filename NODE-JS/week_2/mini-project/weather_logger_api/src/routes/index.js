const weatherController = require("../controllers/weatherController");
const statsController = require("../controllers/statsController");
const healthController = require("../controllers/healthController");

const { filterObservations } = require("../services/weatherService");
const { loadWeatherData } = require("../services/dataService");

const apiLimiter = require("../middlewares/rateLimiter");
const { logger } = require("../middlewares/logger");

const config = require("../config/config");

const express = require("express");
const router = express.Router();
const zlib = require("zlib");
const crypto = require("crypto");

router.get("/health", healthController.getHealth);

router.get("/api/weather", apiLimiter, weatherController.getWeather);
router.get("/api/weather/stream", apiLimiter, weatherController.streamWeather);
router.get("/api/weather/:id", apiLimiter, weatherController.getWeatherById);

router.get("/api/stats/city", apiLimiter, statsController.getCityStats);
router.get("/api/stats/cities", apiLimiter, statsController.getCitiesRanking);
router.get("/api/stats/summary", apiLimiter, statsController.getSummary);
router.get("/api/stats/daily", apiLimiter, statsController.getDailyStats);

router.get("/export.gz", apiLimiter, async (req, res, next) => {
  try {
    const { city, country, from, to, conditions } = req.query;

    const data = await loadWeatherData();
    const filtered = filterObservations(data, {
      city,
      country,
      from,
      to,
      conditions: conditions ? conditions.split(",") : undefined,
    });

    const jsonData = JSON.stringify(filtered);
    const buffer = Buffer.from(jsonData, "utf-8");

    zlib.gzip(buffer, (err, compressed) => {
      if (err) {
        return next(err);
      }

      let signature = "";
      if (config.hmacSecret) {
        const hmac = crypto.createHmac("sha256", config.hmacSecret);
        hmac.update(compressed);
        signature = hmac.digest("hex");
        res.set("X-Signature", signature);
      }

      res.set("Content-Type", "application/gzip");
      res.set(
        "Content-Disposition",
        'attachment; filename="weather-export.json.gz"'
      );
      res.set("Content-Encoding", "gzip");

      logger.emit("export:completed", {
        count: filtered.length,
        bytes: compressed.length,
        signature,
      });

      res.send(compressed);
    });
  } catch (error) {
    next(error);
  }
});

router.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      statusCode: 404,
      path: req.url,
    },
  });
});

module.exports = router;
