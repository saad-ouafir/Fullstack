const http = require("node:http");
const routing = require("./router.js");

process.loadEnvFile(".env");

const PORT_APP = process.env.PORT_APP || 3000;
const server = http.createServer(routing);

server.listen(PORT_APP, () => console.log(`Serveur is on port ${PORT_APP}...`));
