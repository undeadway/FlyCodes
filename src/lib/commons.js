
function replaceObjects(str, arg) {

	while ((matched = str.match(arg.regexp)) !== null) {

		let htmlTag = arg.tag.html;
		let inner = matched[1];
		let input = arg.tag.start + inner + arg.tag.end;

		if (arg.replace) { // 内部还有切换需求的时候进行处理
			inner = inner.replace(arg.replace.start.from, arg.replace.start.to);
			inner = inner.replace(arg.replace.end.from, arg.replace.end.to);
		}

		let output = `<${htmlTag}>${inner}</${htmlTag}>`;

		str = str.replace(input, output);
	}

	return str;
}

const BUILT_IN_ASPECTS = {
	simpleLineCode: (arg) => {

		var lineCodes = [];

		return {
			before: function (input) {
				while (arg.regexp.test(input)) {
					let obj = RegExp.$1;
					input = input.replace(arg.tag.start + obj + arg.tag.end, "{lineCode" + lineCodes.length + "}");
					lineCodes.push("<code class=\"code\">" + obj + "</code>");
				}
				return input;
			},
			after: function (input) {
				Array.forEach(lineCodes, function (i, obj) {
					input = input.replace(new RegExp('\\{lineCode' + i + '\\}', 'g'), obj);
				});
				return input;
			}
		}
	},
	escapeSequence: (arg) => {
		var escapeSequences = [];
		return {
			before: function (input) {
				while (arg.test(input)) {
					input = input.replace(arg, '{backslash' + escapeSequences.length + '}');
					escapeSequences.push(RegExp.$1);
				}
				return input;
			},
			after: function (input) {
				Object.forEach(escapeSequences, function (i, obj) {
					input = input.replace(new RegExp('\\{backslash' + i + '\\}', 'g'), obj);
				});
				return input;
			}
		}
	}
};

module.exports = {
	create: (parse, arg) => {

		function replaceURI(str) {

			try {
				str = decodeURIComponent(str);// 最后的转义出处理
			} catch (e) {
				// 如果出错，就当不存在
			}
			return str;
		}

		return {
			toHTML: (str, plugIns) => {
				let { queue, aspect, object } = plugIns;

				let aspects = [];

				if (aspect) { // 定制插片前处理
					Array.forEach(aspect, (i, a) => {
						let aspect = a.method(a.object);
						str = aspect.before(str);
						aspects.push(aspect);
					});
				}
				if (arg.aspect) { // 内置插片前处理
					Object.forEach(arg.aspect, (n, o) => {
						let aspect = BUILT_IN_ASPECTS[n](o);
						if (aspect) {
							str = aspect.before(str);
							aspects.push(aspect);
						}
					});
				}

				str = parse(str);

				if (arg.object) { // 内置对象处理
					Array.forEach(arg.object, (i, o) => {
						str = replaceObjects(str, o);
					});
				}
				if (object) { // 定制对象处理
					Array.forEach(object, (i, o) => {
						str = replaceObjects(str, o);
					});
				}

				// 插片后处理
				Array.forEach(aspects, (i, a) => {
					str = a.after(str);
				});

				if (arg.queue) { // 内置队列处理
					Array.forEach(arg.queue, (i, obj) => {
						str = obj(str);
					});
				}
				if (queue) { // 定制队列处理
					Array.forEach(queue, (i, obj) => {
						str = obj(str);
					});
				}

				return replaceURI(str);
			}
		}
	}
};
