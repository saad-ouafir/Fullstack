const fs = require("node:fs");
const path = require("node:path");

const JSON_DATA_FILE = `${path.dirname(__dirname)}/data/resources.json`;

function parsedData() {
  const JSON_DATA = fs.readFileSync(JSON_DATA_FILE, "utf-8");
  return JSON.parse(JSON_DATA);
}

function getResourcesService() {
  return { statusCode: 200, data: parsedData() };
}

function getResourceByIDService(id) {
  let result = parsedData().find(
    (resource) => Number(resource.id) === Number(id)
  );
  if (result !== undefined) {
    return { statusCode: 200, data: result };
  } else {
    return { statusCode: 404, data: "Resource Not Found !" };
  }
}

function addResourceService(newResource) {
  const data = [...parsedData()];
  data.push(newResource);
  fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
  return { statusCode: 201, data: "Resource Added Successfully" };
}

function updateResourceService(id, updated_data) {
  const data = [...parsedData()];
  let index = data.findIndex((resource) => Number(resource.id) === Number(id));

  if (index !== -1) {
    data[index] = { ...data[index], ...updated_data };
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
    return { statusCode: 200, data: "Resource Updated Successfully" };
  } else {
    return { statusCode: 404, data: "Resource Not Found !" };
  }
}

function deleteResourceService(id) {
  const data = [...parsedData()];
  const filtered = data.filter((resource) => Number(resource.id) !== Number(id));
  if (data.length === filtered.length) {
    return { statusCode: 404, data: "Resource Not Found !" };
  }
  fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(filtered));
  return { statusCode: 204, data: "Resource Deleted Successfully" };
}

module.exports = {
  getResourcesService,
  getResourceByIDService,
  addResourceService,
  updateResourceService,
  deleteResourceService,
};
