const fs = require("node:fs");
const path = require("node:path");

const JSON_DATA_FILE = `${path.dirname(__dirname)}/data/resources.json`;
const PARSED_DATA = JSON.parse(fs.readFileSync(JSON_DATA_FILE, "utf-8"));

function getResourcesService() {
  return {
    statusCode: 200,
    data: PARSED_DATA,
    error: false,
  };
}

function getResourceByIDService(id) {
  let result = PARSED_DATA.find(
    (resource) => Number(resource.id) === Number(id)
  );
  if (result !== undefined) {
    return {
      statusCode: 200,
      data: result,
      error: false,
    };
  } else {
    return {
      statusCode: 404,
      message: "Resource not found",
      error: true,
    };
  }
}

function addResourceService(newResource) {
  const data = [...PARSED_DATA];
  newResource.id = Number(data.length + 1);
  data.push(newResource);
  fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
  return {
    statusCode: 200,
    data: "Resource Added Successfully",
    error: false,
  };
}

function updateResourceService(id, updated_data) {
  const data = [...PARSED_DATA];
  console.log(id);
  let index = data.findIndex((resource) => Number(resource.id) === Number(id));

  if (index !== -1) {
    data[index].name = updated_data.name;
    data[index].creation_date = updated_data.creation_date;
    fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(data));
    return {
      statusCode: 200,
      data: "Resource Updated Successfully",
      error: false,
    };
  } else {
    return {
      statusCode: 404,
      message: "Resource not found !",
      error: true,
    };
  }
}

function deleteResourceService(id) {
  const data = [...PARSED_DATA];
  const filtered = data.filter(
    (resource) => Number(resource.id) !== Number(id)
  );
  if (filtered === undefined) {
    return {
      statusCode: 404,
      message: "Resource not found !",
      error: true,
    };
  }
  fs.writeFileSync(JSON_DATA_FILE, JSON.stringify(filtered));
  return {
    statusCode: 204,
    data: { message: "Resource deleted successfully" },
    error: false,
  };
}

module.exports = {
  getResourcesService,
  getResourceByIDService,
  addResourceService,
  updateResourceService,
  deleteResourceService,
};
