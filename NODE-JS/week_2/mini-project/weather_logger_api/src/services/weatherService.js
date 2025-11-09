const { loadWeatherData } = require('./dataService');
const { LRUCache, generateCacheKey } = require('../utils/cache');

const queryCache = new LRUCache(100);

const filterObservations = (data, filters) => {
  let filtered = [...data];

  if (filters.city) {
    filtered = filtered.filter(obs => 
      obs.city.toLowerCase() === filters.city.toLowerCase()
    );
  }

  if (filters.country) {
    filtered = filtered.filter(obs => 
      obs.country.toLowerCase() === filters.country.toLowerCase()
    );
  }

  if (filters.from && filters.to) {
    const fromDate = new Date(filters.from);
    const toDate = new Date(filters.to);
    filtered = filtered.filter(obs => {
      const obsDate = new Date(obs.timestamp);
      return obsDate >= fromDate && obsDate <= toDate;
    });
  }

  if (filters.conditions && filters.conditions.length > 0) {
    filtered = filtered.filter(obs => 
      filters.conditions.includes(obs.conditions)
    );
  }

  if (filters.minTemp !== undefined) {
    filtered = filtered.filter(obs => obs.tempC >= parseFloat(filters.minTemp));
  }

  if (filters.maxTemp !== undefined) {
    filtered = filtered.filter(obs => obs.tempC <= parseFloat(filters.maxTemp));
  }

  return filtered;
};

const sortObservations = (data, sortFields) => {
  return [...data].sort((a, b) => {
    for (const { field, order } of sortFields) {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'timestamp') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

const paginateData = (data, page, limit) => {
  const total = data.length;
  const pages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: data.slice(startIndex, endIndex),
    total,
    page,
    pages,
    limit
  };
};

const getObservations = async (filters, sort, page, limit) => {
  const cacheKey = generateCacheKey({ filters, sort, page, limit });
  const cached = queryCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const data = await loadWeatherData();
  let filtered = filterObservations(data, filters);

  if (sort && sort.length > 0) {
    filtered = sortObservations(filtered, sort);
  }

  const result = paginateData(filtered, page, limit);
  queryCache.set(cacheKey, result);

  return result;
};

const getObservationById = async (id) => {
  const data = await loadWeatherData();
  return data.find(obs => obs.id == id);
};

const streamObservations = async (filters) => {
  const data = await loadWeatherData();
  return filterObservations(data, filters);
};

module.exports = {
  getObservations,
  getObservationById,
  streamObservations,
  filterObservations
};
