import http from "node:http";
process.loadEnvFile(".env");
const PORT_APP = process.env.PORT_APP || 3000;

import routing from "./router.js";
const server = http.createServer(routing);

server.listen(PORT_APP, () => console.log(`Serveur is on port ${PORT_APP}...`));
