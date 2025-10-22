// logger.js → classe personnalisée étendant EventEmitter.
import { EventEmitter } from "node:events";
import fs from "node:fs";
class Logger extends EventEmitter {
  log(msg) {
    this.on("messageLogged", (msg) => {
      console.log("Message logged:", msg);
    });

    fs.appendFileSync("./log.txt", msg + "\n");

    this.emit("messageLogged", msg);
  }
}

export default Logger;
