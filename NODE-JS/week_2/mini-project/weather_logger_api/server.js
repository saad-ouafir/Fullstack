require("dotenv").config();
const app = require("./src/app");
const config = require("./src/config/config");

app.listen(config.port, () => {
  console.log(`Weather Logger API running on port ${config.port}`);
});
