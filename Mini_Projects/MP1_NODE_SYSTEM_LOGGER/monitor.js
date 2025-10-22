// monitor.js → script principal qui lit les infos système.
import Logger from "./logger.js"; // importation du class logger
import os from "node:os"; // importation du module `os`
import { latestStats } from "./server.js"; // importation de la variable `latestStats` du fichier `server.js`

const logger = new Logger(); // creation d'une instance de la classe `Logger`

//Ecoute ce événement créer "lowMemory"
/*logger.on("lowMemory", (percent) => {
  //cette fct sera execute chaque fois que lévénement est émis
  console.log(`Attension Memoire libre!  ${percent}%`); //affiche ce message d’alerte dans la console.
});*/

// Écoute de l'événement "lowMemory" pour afficher une alerte console
logger.on("lowMemory", (memoryPercentage) => {
  console.warn(
    `Alerte ! Memoire faible !La memoire libre est ${memoryPercentage}%`
  );
});

function logSystemRessources() {
  // creation de la fonction pour preparer le message et appeler la methode log
  const freeMemory = (os.freemem() / 1024 / 1024 / 1024).toFixed(2); // garde la capacite vide de la memoire RAM en GB
  const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2); // garde la capacite totale de la memoire RAM en GB
  const upTime = (os.uptime() / 3600).toFixed(2); // garde en heure le nombre des heurs des le dernier demmarage de systeme
  const FreeMemoryPercentage = ((freeMemory * 100) / totalMemory).toFixed(2); // garde le pourcentage de la memoire vide en %

  const now = new Date(); // creation d'une instance de la classe `Date`
  const timestamp = now.toTimeString().split(" ")[0]; // recupere l'heure et la minute et la seconde

  const message = `
-------------------------------------------------
| [${timestamp}]
| Free Memory       : ${freeMemory} GB          
| Free Memory (%)   : ${FreeMemoryPercentage}%  
| Total Memory      : ${totalMemory} GB         
| Uptime (hours)    : ${upTime} H               
-------------------------------------------------
`; // formattage du message pour etre pret a l'ecriture
  logger.log(message); // appel de la methode `log` pour ecrire dans le fichier log le message formatte precedement

  // Mise à jour des dernières stats pour /stats
  latestStats.freeMemory = freeMemory;
  latestStats.totalMemory = totalMemory;
  latestStats.freePercentage = FreeMemoryPercentage;
  latestStats.uptimeHours = upTime;

  //Vérifie si la mémoire libre est inférieure à 20 % de la mémoire totale
  if (FreeMemoryPercentage < 20) {
    logger.emit("lowMemory", FreeMemoryPercentage); // Tous les écouteurs de 'lowMemory' seront exécutés
  }
}

setInterval(logSystemRessources, 5000); // pour repeter l'execution de la fonction chaque 5 secondes
