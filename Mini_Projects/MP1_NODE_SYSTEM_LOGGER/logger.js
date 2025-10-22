// logger.js → classe personnalisée étendant EventEmitter.
import { EventEmitter } from "node:events"; // import du l'`EventEmitter` du module `events`
import fs from "node:fs"; // import du l'`filesystem` du module `fs`

class Logger extends EventEmitter {
  // creation de la class `Logger` et l'heritage du class `EventEmitter`

  // creation de la methode log pour declencher les evenements et ecrir dans le fichier `log.txt`
  log(msg) {
    this.on("messageLogged", (msg) => {
      console.log("Message logged:", msg);
    }); // declaration de l'evenement `messageLogged`, qui affciher le message dans la console

    fs.appendFileSync("./log.txt", msg + "\n");

    this.emit("messageLogged", msg); // declanchement de l'evenement `messageLogged`
  }
}

export default Logger;
