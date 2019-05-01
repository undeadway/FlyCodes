require("coralian");
require("../src/index");
require("./FlyHighLighter");

var fs = require("fs");

var src = fs.readFileSync("./test/file", "utf-8");
FlyCodes.setHighLighter(FlyHighLighter.execute);

console.log(FlyCodes.toHTML(src, "HitOn"));