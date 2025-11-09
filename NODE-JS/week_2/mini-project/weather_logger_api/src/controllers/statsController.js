const statsService = require('../services/statsService');
const { validateDateRange, validateMetric } = require('../utils/validation');
const { convertStats } = require('../utils/conversion');

const getCityStats = async (req, res, next) => {
  try {
    const { city, from, to, units } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'city parameter is required' });
    }

    if (from && to) {
      const validation = validateDateRange(from, to);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }

    const stats = await statsService.getCityStats(city, from, to);

    if (!stats) {
      return res.status(404).json({ error: 'No data found for this city' });
    }

    const result = units === 'imperial' ? convertStats(stats, 'imperial') : stats;

    res.set('Cache-Control', 'public, max-age=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getCitiesRanking = async (req, res, next) => {
  try {
    const { metric, top, from, to, units } = req.query;

    if (!metric) {
      return res.status(400).json({ error: 'metric parameter is required' });
    }

    const metricValidation = validateMetric(metric);
    if (!metricValidation.valid) {
      return res.status(400).json({ error: metricValidation.error });
    }

    if (from && to) {
      const validation = validateDateRange(from, to);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }

    const ranking = await statsService.getCitiesRanking(metric, top, from, to);

    const result = units === 'imperial' 
      ? ranking.map(stats => convertStats(stats, 'imperial'))
      : ranking;

    res.set('Cache-Control', 'public, max-age=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const { from, to, units } = req.query;

    if (from && to) {
      const validation = validateDateRange(from, to);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }

    const summary = await statsService.getSummary(from, to);

    const result = units === 'imperial' ? convertStats(summary, 'imperial') : summary;

    res.set('Cache-Control', 'public, max-age=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getDailyStats = async (req, res, next) => {
  try {
    const { city, from, to, units } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'city parameter is required' });
    }

    if (from && to) {
      const validation = validateDateRange(from, to);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }

    const dailyStats = await statsService.getDailyStats(city, from, to);

    if (units === 'imperial' && dailyStats.daily) {
      dailyStats.daily = dailyStats.daily.map(day => convertStats(day, 'imperial'));
    }

    res.set('Cache-Control', 'public, max-age=600');
    res.json(dailyStats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCityStats,
  getCitiesRanking,
  getSummary,
  getDailyStats
};
