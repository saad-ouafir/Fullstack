const fs = require("fs").promises;
const config = require("../config/config");
const { LRUCache } = require("../utils/cache");
const dataCache = new LRUCache(50);

const loadWeatherData = async () => {
  try {
    const cached = dataCache.get("weather-data");
    if (cached) {
      return cached;
    }

    const data = await fs.readFile(config.dataFile, "utf-8");
    const weatherData = JSON.parse(data);

    dataCache.set("weather-data", weatherData);

    return weatherData;
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw new Error(`Failed to load weather data: ${error.message}`);
  }
};

const saveWeatherData = async (data) => {
  try {
    await fs.writeFile(config.dataFile, JSON.stringify(data, null, 2));
    dataCache.set("weather-data", data);
  } catch (error) {
    throw new Error(`Failed to save weather data: ${error.message}`);
  }
};

module.exports = {
  loadWeatherData,
  saveWeatherData,
};
