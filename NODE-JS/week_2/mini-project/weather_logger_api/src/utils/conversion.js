const convertTemperature = (tempC, units) => {
  if (units === 'imperial') {
    return (tempC * 9/5) + 32;
  }
  return tempC;
};

const convertObservation = (observation, units) => {
  if (units === 'imperial') {
    return {
      ...observation,
      tempC: convertTemperature(observation.tempC, 'imperial')
    };
  }
  return observation;
};

const convertStats = (stats, units) => {
  if (units === 'imperial' && stats.temp) {
    return {
      ...stats,
      temp: {
        avg: convertTemperature(stats.temp.avg, 'imperial'),
        min: convertTemperature(stats.temp.min, 'imperial'),
        max: convertTemperature(stats.temp.max, 'imperial')
      }
    };
  }
  return stats;
};

const formatWithTimezone = (timestamp, tz) => {
  if (!tz) return timestamp;

  try {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  } catch (error) {
    return timestamp;
  }
};

module.exports = {
  convertTemperature,
  convertObservation,
  convertStats,
  formatWithTimezone
};
