// monitor.js → script principal qui lit les infos système.
import Logger from "./logger.js";
import os from "node:os";

const logger = new Logger();

function logSystemRessources() {
  const freeMemory = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
  const totalMemory = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
  const upTime = (os.uptime() / 3600).toFixed(2);
  const FreeMemoryPercentage = ((freeMemory * 100) / totalMemory).toFixed(2);
  const message = `
-------------------------------------------------
| Free Memory       : ${freeMemory} GB          
| Free Memory (%)   : ${FreeMemoryPercentage}%  
| Total Memory      : ${totalMemory} GB         
| Uptime (hours)    : ${upTime} H               
-------------------------------------------------
`;
  logger.log(message);
}

setInterval(logSystemRessources, 5000);
