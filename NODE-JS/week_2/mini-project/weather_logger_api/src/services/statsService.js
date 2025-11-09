const { loadWeatherData } = require('./dataService');
const { filterObservations } = require('./weatherService');

const calculateStats = (observations) => {
  if (observations.length === 0) {
    return null;
  }

  const temps = observations.map(obs => obs.tempC);
  const humidities = observations.map(obs => obs.humidity);
  const windSpeeds = observations.map(obs => obs.wind.speed);

  const conditionCounts = observations.reduce((acc, obs) => {
    acc[obs.conditions] = (acc[obs.conditions] || 0) + 1;
    return acc;
  }, {});

  return {
    count: observations.length,
    temp: {
      avg: temps.reduce((a, b) => a + b, 0) / temps.length,
      min: Math.min(...temps),
      max: Math.max(...temps)
    },
    humidity: {
      avg: humidities.reduce((a, b) => a + b, 0) / humidities.length
    },
    wind: {
      avg: windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length,
      max: Math.max(...windSpeeds)
    },
    conditions: conditionCounts
  };
};

const getCityStats = async (city, from, to) => {
  const data = await loadWeatherData();
  const filtered = filterObservations(data, { city, from, to });

  if (filtered.length === 0) {
    return null;
  }

  const stats = calculateStats(filtered);

  return {
    city,
    from,
    to,
    ...stats
  };
};

const getCitiesRanking = async (metric, top, from, to) => {
  const data = await loadWeatherData();
  const filtered = from && to ? filterObservations(data, { from, to }) : data;

  const citiesMap = filtered.reduce((acc, obs) => {
    if (!acc[obs.city]) {
      acc[obs.city] = [];
    }
    acc[obs.city].push(obs);
    return acc;
  }, {});

  const citiesStats = Object.entries(citiesMap).map(([city, observations]) => {
    const stats = calculateStats(observations);
    return { city, ...stats };
  });

  const [mainMetric, subMetric] = metric.split('.');

  citiesStats.sort((a, b) => {
    const aValue = subMetric ? a[mainMetric][subMetric] : a[mainMetric];
    const bValue = subMetric ? b[mainMetric][subMetric] : b[mainMetric];
    return bValue - aValue;
  });

  return citiesStats.slice(0, parseInt(top) || 10);
};

const getSummary = async (from, to) => {
  const data = await loadWeatherData();
  const filtered = from && to ? filterObservations(data, { from, to }) : data;

  const stats = calculateStats(filtered);

  const citiesCount = new Set(filtered.map(obs => obs.city)).size;
  const countriesCount = new Set(filtered.map(obs => obs.country)).size;

  return {
    from,
    to,
    totalObservations: filtered.length,
    citiesCount,
    countriesCount,
    ...stats
  };
};

const getDailyStats = async (city, from, to) => {
  const data = await loadWeatherData();
  const filtered = filterObservations(data, { city, from, to });

  const dailyMap = filtered.reduce((acc, obs) => {
    const date = obs.timestamp.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(obs);
    return acc;
  }, {});

  const dailyStats = Object.entries(dailyMap)
    .map(([date, observations]) => ({
      date,
      ...calculateStats(observations)
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    city,
    from,
    to,
    daily: dailyStats
  };
};

module.exports = {
  getCityStats,
  getCitiesRanking,
  getSummary,
  getDailyStats
};
