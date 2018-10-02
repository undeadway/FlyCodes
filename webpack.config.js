var path = require("path");

module.exports = {
	entry: {FlyCodes : "./src/index.js", HitOn : "./src/lib/HitOn/index.js"},
	output: {
		path:path.resolve(__dirname ,"dist"),
		filename:"[name].js"
	}
};

