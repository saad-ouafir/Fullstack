import http from "node:http"; // n importiw module http bach ndir serveur
import fs from "node:fs"; // n importiw module fs bach nkhdmo b fichier

const server = http.createServer((req, res) => {
  // n khlqo wahd serveur
  if (req.url === "/") {
    // ila l'utilisateur mcha l'home page   "/"
    res.end("Bienvenue sur le Node System Logger");
  } else if (req.url === "/logs") {
    // ila mcha logs
    fs.readFile("log.txt", "utf8", (err, data) => {
      //n9raw f fichier log.txt
      if (err) {
        //ila makaynch fichier
        res.statusCode = 404;
        res.end("Fichier log.txt introuvable");
      } else {
        //ila l9ah irja3 lina le contenu dialo
        res.end(data);
      }
    });
  } else if (req.url === "/stats") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(latestStats, null, 2));
  } else {
    // ila URL ma kaynach
    res.statusCode = 404;
    res.end("Page non trouvée");
  }
});
// serveur kay sma3 f port 3000 ay drna wahd event listen 3la had port
server.listen(3000, () => console.log("Serveur en écoute sur le port 3000...")); // server.js → serveur HTTP pour afficher les logs.

export let latestStats = {};
