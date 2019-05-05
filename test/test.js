require("coralian");
require("../src/index");
require("./FlyHighLighter");

var fs = require("fs");

var src = fs.readFileSync("./test/file", "utf-8");
FlyCodes.setHighLighter(FlyHighLighter.execute);

let output = FlyCodes.toHTML(src, "HitOn_0.0.1");

let html = `<html><head>
<title>测试</title>
<link rel="stylesheet" type="text/css" href="./style.css" />
<link rel="stylesheet" type="text/css" href="./read.css" />
<link rel="stylesheet" type="text/css" href="./FlyHighLighter.css" />
</head>
<body>${output}</body></html>`;

fs.writeFileSync("./test/output.html", html);