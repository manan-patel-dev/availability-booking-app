const fs = require("fs");

const readFile = (path) => {
  const data = fs.readFileSync(path, "utf-8");
  return JSON.parse(data);
};

const writeFile = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
};

module.exports = {
  readFile,
  writeFile,
};
