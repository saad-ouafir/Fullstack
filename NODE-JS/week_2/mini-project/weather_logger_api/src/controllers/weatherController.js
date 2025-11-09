const weatherService = require('../services/weatherService');
const { validatePagination, validateConditions, validateSortFields } = require('../utils/validation');
const { convertObservation } = require('../utils/conversion');

const getWeather = async (req, res, next) => {
  try {
    const { city, country, from, to, conditions, minTemp, maxTemp, page, limit, sort, units } = req.query;

    const paginationValidation = validatePagination(page, limit);
    if (!paginationValidation.valid) {
      return res.status(400).json({ error: paginationValidation.error });
    }

    const filters = { city, country, from, to, minTemp, maxTemp };

    if (conditions) {
      const conditionValidation = validateConditions(conditions);
      if (!conditionValidation.valid) {
        return res.status(400).json({ error: conditionValidation.error });
      }
      filters.conditions = conditionValidation.conditions;
    }

    let sortFields = [{ field: 'timestamp', order: 'desc' }];
    if (sort) {
      const sortValidation = validateSortFields(sort);
      if (!sortValidation.valid) {
        return res.status(400).json({ error: sortValidation.error });
      }
      sortFields = sortValidation.sort;
    }

    const result = await weatherService.getObservations(
      filters,
      sortFields,
      paginationValidation.page,
      paginationValidation.limit
    );

    if (units === 'imperial') {
      result.data = result.data.map(obs => convertObservation(obs, 'imperial'));
    }

    res.set('Cache-Control', 'public, max-age=300');
    res.set('ETag', `W/"${result.total}-${result.page}"`);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getWeatherById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { units } = req.query;

    const observation = await weatherService.getObservationById(id);

    if (!observation) {
      return res.status(404).json({ error: 'Observation not found' });
    }

    const result = units === 'imperial' 
      ? convertObservation(observation, 'imperial')
      : observation;

    res.set('Cache-Control', 'public, max-age=600');
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const streamWeather = async (req, res, next) => {
  try {
    const { city, country, from, to, conditions } = req.query;

    const filters = { city, country, from, to };

    if (conditions) {
      const conditionValidation = validateConditions(conditions);
      if (!conditionValidation.valid) {
        return res.status(400).json({ error: conditionValidation.error });
      }
      filters.conditions = conditionValidation.conditions;
    }

    const observations = await weatherService.streamObservations(filters);

    res.set('Content-Type', 'application/x-ndjson');
    res.set('Cache-Control', 'no-cache');

    observations.forEach(obs => {
      res.write(JSON.stringify(obs) + '\n');
    });

    res.end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeather,
  getWeatherById,
  streamWeather
};
