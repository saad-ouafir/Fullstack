## Membre du goupe

Ce projet est realisé par le groupe `G5` du Bootcamp `YNOVxJOBINTECH MERN Stack` - Rabat

- Saad Ouafir
- Achraf Tabchi
- Asma Hamma

## 🖥️ Node System Logger

Un mini-projet Node.js qui surveille les ressources système en temps réel et enregistre les informations dans un fichier log.txt.
Le programme collecte la mémoire libre, la mémoire totale et le temps d’activité toutes les 5 secondes, puis les enregistre à l’aide d’un module de journalisation personnalisé.

## 🔧 Fonctionnalités principales

- `logger.js` : module de journalisation basé sur EventEmitter
  - écrit les messages dans log.txt et déclenche des événements (messageLogged, lowMemory).
- `monitor.js` : surveille la mémoire et le temps d’activité système
  - émet un avertissement si la mémoire libre passe sous 20 %.
- `server.js` : serveur HTTP simple
  - `/` affiche un message d’accueil
  - `/logs` affiche le contenu du fichier log.txt
  - `/stats` renvoie les dernières statistiques système en JSON.

## 🚀 Setup et Exécution

1. Lancer `monitor.js` pour démarrer la surveillance.
2. Lancer `server.js` pour accéder aux logs sur `http://localhost:3000`
3. Le fichier `log.txt` se met à jour automatiquement toutes les 5 secondes.
