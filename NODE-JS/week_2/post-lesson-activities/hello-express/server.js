const express = require("express"); // import du framework
const app = express(); // creation d'une instance

// methode get() pour envoyer une requette http de type `GET`
// definir une route '/' (root) et envoi de message
app.get("/", (req, resp) => {
  resp.send("Bienvenu sur mon premier serveur Express !");
});

// Le serveur écoute sur le port 3000
app.listen(3000, () =>
  console.log("Serveur en ecoute sur http://localhost:3000")
);

// Création des routes
// Méthode `GET` pour renvoyer une liste de produits
app.get("/api/products", (req, res) => {
  res.json([
    { id: 1, name: "Laptop" },
    { id: 2, name: "Phone" },
  ]);
});

// Méthode `GET` pour renvoyer un produit spécifique selon id
app.get("/api/products/:id", (req, res) => {
  res.json({ message: `Produit ${req.params.id}` });
});

// Middleware pour loguer des infos sur les requêtes
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware pour mesurer le temps d'exécution d'une requête
app.use((req, res, next) => {
  res.startTime = Date.now();
  next();
});

// Middleware pour afficher la durée de la requête
app.use("/ping", (req, res) => {
  const duration = Date.now() - req.startTime;
  res.json({ message: "pong", duration: `${duration}ms` });
});

// Route pour simuler une erreur
app.get("/api/crash", (req, res, next) => {
  const err = new Error("Erreur simulee ");
  next(err); // pour passer l'erreur au middleware d'erreur
});

// Middleware d'erreur pour intercepter et gérer les erreurs
app.use((err, req, res, next) => {
  console.log("Erreur detectee :", err.message);
  res.status(500).json({ error: err.message });
});

app.use(express.static("public"));

const fs = require("fs");

app.get("/api/products", (req, res) => {
  const data = fs.readFileSync("./data/products.json");
  const products = JSON.parse(data);
  res.json(products);
});
