
const util = require("./util");

const BR_TAG = "<br />";
const NL_REGX = /\n/g;
const PRE_TAG = Coralian.constants.HtmlTag.PRE;

function replaceObjects(str, arg) {

	while ((matched = str.match(arg.regexp)) !== null) {

		let htmlTag = arg.tag.html;
		let attrs = util.compireObjectToXmlAtruibute(arg.tag.attrs);
		let inner = matched[1];
		let input = arg.tag.start + inner + arg.tag.end;
		if (htmlTag === PRE_TAG) {
			inner = inner.replace("<", "&lt;"); // 所有预定义标签中的HTML标签都无效化处理
			inner = inner.replace(">", "&gt;");
		}

		if (arg.replace) { // 内部还有切换需求的时候进行处理
			inner = inner.replace(arg.replace.start.from, arg.replace.start.to);
			inner = inner.replace(arg.replace.end.from, arg.replace.end.to);
		}

		let output = `<${htmlTag}${attrs}>${inner}</${htmlTag}>`;

		str = str.replace(input, output);
	}

	return str;
}

const BUILT_IN_ASPECTS = {
	simpleLineCode: (arg) => {

		let lineCode = util.AspectBase('linecode');
		lineCode.before = input => {
			while (arg.regexp.test(input)) {
				let obj = RegExp.$1;
				let part = arg.tag.start + obj + arg.tag.end;
				let output = `<code class="code">${obj}</code>`;
				input = lineCode.replace(input, part, output);
			}
			return input;
		};

		return lineCode;
	},
	escapeSequence: (arg) => {

		let backSlash = util.AspectBase('backslash');
		backSlash.before = input => {
			while (arg.test(input)) {
				let output = RegExp.$1;
				input = backSlash.replace(input, arg, output);
			}
			return input;
		};

		return backSlash;
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

				str = str.replace(NL_REGX, BR_TAG); // 单行换行

				return replaceURI(str);
			}
		}
	}
};
