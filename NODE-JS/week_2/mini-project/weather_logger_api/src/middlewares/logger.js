const EventEmitter = require('events');

class Logger extends EventEmitter {
  constructor() {
    super();
    this.setupListeners();
  }

  setupListeners() {
    this.on('request:received', (data) => {
      console.log(`[REQUEST] ${data.method} ${data.url}`, data.query);
    });

    this.on('response:sent', (data) => {
      console.log(`[RESPONSE] ${data.statusCode} ${data.route} - ${data.durationMs}ms`);
    });

    this.on('export:completed', (data) => {
      console.log(`[EXPORT] ${data.count} records, ${data.bytes} bytes, signature: ${data.signature}`);
    });

    this.on('error', (error) => {
      console.error('[ERROR]', error.message);
    });
  }
}

const logger = new Logger();

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  logger.emit('request:received', {
    method: req.method,
    url: req.url,
    query: req.query
  });

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    logger.emit('response:sent', {
      statusCode: res.statusCode,
      route: req.route ? req.route.path : req.url,
      durationMs
    });
  });

  next();
};

module.exports = { logger, requestLogger };
