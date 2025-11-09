const app = require("./app");
const config = require("./config/config");

app.listen(config.PORT_APP, () => {
  console.log(`✓ Server running at http://localhost:${config.PORT_APP}`);
});
