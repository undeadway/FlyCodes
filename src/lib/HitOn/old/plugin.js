
const highLighter = FlyHighLighter.execute;
const CodeRegExp = {
	regexp: /```(.*[\r\n]+)((.|\s)*?)```/,
	code: "$2",
	name: "$1"
};

function getCodeParser() {

	let toCode = [];

	return {
		before: function (str) {

			while (CodeRegExp.regexp.test(str)) {

				var codeWithLang;

				var code = RegExp[CodeRegExp.code];
				var name = RegExp[CodeRegExp.name];

				if (name) {
					codeWithLang = "```" + name + code + "```";
				} else {
					codeWithLang = "```" + code + "```";
				}

				str = str.replace(codeWithLang, "[toCode" + toCode.length + "]");
				code = highLighter(code, String.trim(name));

				toCode.push(code);
			}

			return str;
		},
		after: function (str) {
			Object.forEach(toCode, function (i, obj) {
				str = str.replace("[toCode" + i + "]", obj);
			});
			return str;
		}
	}
}

module.exports = () => [getCodeParser()];