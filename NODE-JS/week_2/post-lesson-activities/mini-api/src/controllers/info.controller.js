const path = require("path");
const fs = require("fs");

function getProjectInfoConroller() {
  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const date = new Date().toISOString();
  return `nom du projet : ${packageJson.name}, version : ${packageJson.version}, date : ${date}`;
}

module.exports = getProjectInfoConroller;
