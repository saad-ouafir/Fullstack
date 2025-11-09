const validateDateRange = (from, to) => {
  if (!from || !to) {
    return { valid: false, error: 'from and to dates are required' };
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return { valid: false, error: 'Invalid date format. Use ISO 8601 format' };
  }

  if (fromDate >= toDate) {
    return { valid: false, error: 'from date must be before to date' };
  }

  return { valid: true };
};

const validatePagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 50;

  if (pageNum < 1) {
    return { valid: false, error: 'page must be >= 1' };
  }

  if (limitNum < 1 || limitNum > 200) {
    return { valid: false, error: 'limit must be between 1 and 200' };
  }

  return { valid: true, page: pageNum, limit: limitNum };
};

const validateConditions = (conditions) => {
  const validConditions = ['clear', 'clouds', 'rain', 'storm', 'snow'];
  const conditionArray = conditions.split(',').map(c => c.trim());

  for (const condition of conditionArray) {
    if (!validConditions.includes(condition)) {
      return { valid: false, error: `Invalid condition: ${condition}` };
    }
  }

  return { valid: true, conditions: conditionArray };
};

const validateSortFields = (sort) => {
  const validFields = ['timestamp', 'tempC', 'humidity', 'pressure', 'city', 'country'];
  const sortArray = sort.split(',').map(s => s.trim());

  const parsedSort = [];

  for (const sortField of sortArray) {
    const [field, order] = sortField.split(':');

    if (!validFields.includes(field)) {
      return { valid: false, error: `Invalid sort field: ${field}` };
    }

    if (order && !['asc', 'desc'].includes(order)) {
      return { valid: false, error: `Invalid sort order: ${order}. Use asc or desc` };
    }

    parsedSort.push({ field, order: order || 'asc' });
  }

  return { valid: true, sort: parsedSort };
};

const validateMetric = (metric) => {
  const validMetrics = ['temp.avg', 'temp.max', 'humidity.avg', 'wind.max'];

  if (!validMetrics.includes(metric)) {
    return { valid: false, error: `Invalid metric: ${metric}` };
  }

  return { valid: true };
};

module.exports = {
  validateDateRange,
  validatePagination,
  validateConditions,
  validateSortFields,
  validateMetric
};
