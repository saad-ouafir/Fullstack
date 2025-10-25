function toNumber(data) {
  if (data !== undefined) {
    return String(data);
  }
}

function toBoolean(data) {
  if (data !== undefined) {
    return Boolean(data);
  }
}

function parseData(data, type) {
  switch (type) {
    case "number":
      return toNumber(data);
    case "boolean":
      return toBoolean(data);
    default:
      return data;
  }
}

module.exports = parseData;
