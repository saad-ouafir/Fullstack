// monitor.js → script principal qui lit les infos système.
import Logger from "./logger.js"; // importation du class logger
import os from "node:os"; // importation du module `os`

const logger = new Logger(); // creation d'une instance de la classe `Logger`

function logSystemRessources() {
  // creation de la fonction pour preparer le message et appeler la methode log
  const freeMemory = (os.freemem() / 1024 / 1024 / 1024).toFixed(2); // garde la capacite vide de la memoire RAM en GB
  const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2); // garde la capacite totale de la memoire RAM en GB
  const upTime = (os.uptime() / 3600).toFixed(2); // garde en heure le nombre des heurs des le dernier demmarage de systeme
  const FreeMemoryPercentage = ((freeMemory * 100) / totalMemory).toFixed(2); // garde le pourcentage de la memoire vide en %
  const message = `
-------------------------------------------------
| Free Memory       : ${freeMemory} GB          
| Free Memory (%)   : ${FreeMemoryPercentage}%  
| Total Memory      : ${totalMemory} GB         
| Uptime (hours)    : ${upTime} H               
-------------------------------------------------
`; // formattage du message pour etre pret a l'ecriture
  logger.log(message); // appel de la methode `log` pour ecrire dans le fichier log le message formatte precedement
}

setInterval(logSystemRessources, 5000); // pour repeter l'execution de la fonction chaque 5 secondes
