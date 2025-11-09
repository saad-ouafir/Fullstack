const startTime = Date.now();

const getHealth = (req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  res.json({
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString()
  });
};

module.exports = { getHealth };
