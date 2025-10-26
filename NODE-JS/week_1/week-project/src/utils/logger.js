const EventEmitter = require("events");

class Logger extends EventEmitter {
  constructor() {
    super();

    this.on("request:received", this.logRequest);
    this.on("response:sent", this.logResponse);
  }

  logRequest({ method, url }) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] → ${method} ${url}`);
  }

  logResponse({ statusCode, url }) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ← ${statusCode} ${url}`);
  }
}

module.exports = new Logger();
