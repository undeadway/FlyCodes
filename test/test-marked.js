const marked = require("marked");

const value = require("fs").readFileSync("./test/file", "utf-8");

const result = marked(value);

console.log(result);