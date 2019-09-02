/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports) {


exports.compireH5Video = (input, args) => {

	return compireH5Object(input, args, 'iframe', 'h5video');
};

exports.compireH5Audio = (input, args) => {
	return input;
}

function compireH5Object(input, args, tag, className) {

	let result = compireObjectToXmlAtruibute(args);

	return `<${tag} class="${className}" src="${input}" ${result}></${tag}>`;
}

exports.parseEqualToObject = (input, obj) => {
	for (let item of input) {
		let kv = item.split("=");
		obj[kv[0]] = kv[1];
	}
};

function compireObjectToXmlAtruibute(input) {

	let str = String.BLANK;

	for (let k in input) {
		let v = input[k];
		str += ` ${k}="${v}"`;
	}

	return str;
}

exports.compireObjectToXmlAtruibute = compireObjectToXmlAtruibute;

exports.AspectBase = (key) => {

	let array = [];

	return {
		replace: (input, part, str) => {

			input = input.replace(part, `{${key}~${array.length}}`);
			array.push(str);

			return input;
		},
		after: (input) => {
			Array.forEach(array, (i, e) => {
				input = input.replace(`{${key}~${i}}`, e);
			});

			return input;
		}
	}

};

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


const util = __webpack_require__(1);

const BR_TAG = "<br />";
const NL_REGX = /\n/g;

function replaceObjects(str, arg) {

	while ((matched = str.match(arg.regexp)) !== null) {

		let htmlTag = arg.tag.html;
		let attrs = util.compireObjectToXmlAtruibute(arg.tag.attrs);
		let inner = matched[1];
		let input = arg.tag.start + inner + arg.tag.end;

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {


const util = __webpack_require__(1);

const MAIN_QUOT_REGX = /\n(\n(>(.*)\n)+)/,
	NL_RT_ANGLE_GLOBAL_REGX = /\n>/g;
const STRING_QUOTE = "引用";

function replaceQuote(input) {

	while (MAIN_QUOT_REGX.test(input)) { // 获取>列表行，从 \n> 开始 到 >\n 结束，中间每行都以 > 开头 \n 结束
		let protoQuotTxt = RegExp.$1;
		let quotTxt = protoQuotTxt.replace(NL_RT_ANGLE_GLOBAL_REGX, "\n"); // 去掉每行开头的 >(&gt;)
		quotTxt = quotTxt.slice(1); // 去掉第一行的换行符
		let indexNL = quotTxt.indexOf("\n");

		let quotTtlLn = quotTxt.slice(0, indexNL);
		let hasQuotTtl = String.startsWith(quotTtlLn, "(") && String.endsWith(quotTtlLn, ")");

		let legend = hasQuotTtl ? quotTtlLn.slice(1, quotTtlLn.length - 1) : STRING_QUOTE;
		let outTxt = hasQuotTtl ? quotTxt.slice(indexNL + 1) : quotTxt;

		outTxt = replaceQuote(outTxt); // 递归查找看是否有多重引用

		input = input.replace(MAIN_QUOT_REGX, `<fieldset><legend>${legend}</legend>${outTxt}</fieldset>`);
	}

	return input;
}

const replaceList = (function () {

	const UL_REGEX = /(\*+\. (.)+\n)+/,
		OL_1_REGEX = /([0-9]+\. (.)+\n)+/,
		OL_A_REGEX = /([a-z]+\. (.)+\n)+/,
		TYPE_1_LI_START = /[0-9]+\. /g,
		TYPE_A_LI_START = /[a-z]+\. /g,
		UL_LI_START = /\*+\. /g,
		LI_END = /\n/g;

	const LI_START_TAG = "<li>",
		LI_END_TAG = "</li>",
		UL_START_TAG = "<ul>",
		UL_END_TAG = "</ul>",
		OL_START_TYPE_1_TAG = '<ol class="list_type_1">',
		OL_START_TYPE_A_TAG = '<ol class="list_type_a">',
		OL_END_TAG = "</ol>";

	function replace(input, part, liStart, startTag, endTag) {

		var output = part.replace(liStart, LI_START_TAG);
		output = output.replace(LI_END, LI_END_TAG);

		return input.replace(part, startTag + output + endTag);
	}

	return function (input) {

		// ul
		while ((matches = input.match(UL_REGEX)) !== null) {
			input = replace(input, matches[0], UL_LI_START, UL_START_TAG, UL_END_TAG);
		}
		// ol -1
		while ((matches = input.match(OL_1_REGEX)) !== null) {
			input = replace(input, matches[0], TYPE_1_LI_START, OL_START_TYPE_1_TAG, OL_END_TAG);
		}
		// ol -a
		while ((matches = input.match(OL_A_REGEX)) !== null) {
			input = replace(input, matches[0], TYPE_A_LI_START, OL_START_TYPE_A_TAG, OL_END_TAG);
		}

		return input;
	};
})();

const COLOR_TAG_REGX = /\[#([0-9,A-F]{6})\|((.|\s)*?)\]/i;
function replaceColor(input) {
	while (COLOR_TAG_REGX.test(input)) {
		var color = RegExp.$1,
			inner = RegExp.$2,
			outs;
		var splits = inner.split("|");
		if (splits.length === 2) {
			outs = '<span class="' + splits[0] + "_" + color + '">' + splits[1] + '</span>';
		} else {
			outs = '<span class="color_' + color + '">' + splits[0] + '</span>';
		}
		input = input.replace("[#" + color + "|" + inner + "]", outs);
	}
	return input;
}

const LINK_REGX = /\[(#|@|\$|V|A)\]\(((.|\s)*?)\)/;
function replaceSrcLinks() {

	let links = util.AspectBase('links');
	links.before = input => {
		while (LINK_REGX.test(input)) {
			let tag = RegExp.$1;
			let value = RegExp.$2;

			let output = ReplaceHolder[tag](value);

			input = links.replace(input, `[${tag}](${value})`, output);
		}
		return input;
	};

	return links;
}

const ReplaceHolder = {
	'#': input => { // 链接  [#](url|txt|title|target)

		let splits = input.split("|");
		let url = splits[0];
		let txt = splits[1] || url;
		let title = (splits.length === 4 ? (splits[2] || url) : url);
		let target = splits[splits.length === 4 ? 3 : 2];

		let outs = `<a href="${url}" title="${title}"`;
		if (target) {
			outs += ` target="_${target}"`;
		}
		outs += `>${txt}</a>`;

		return outs;
	},
	"@": input => { // 邮件  [@](url|title)
		let splits = input.split("|");
		let url = splits[0];
		let title = splits[1] || url;

		return `<a href="mailto:${url}">${title}</a>`;
	},
	"$": input => { // 图像  [$](url|title|width|height)

		let splits = input.split("|");

		let str = splits[0];
		let title = splits[1] || str;

		let outs = `<img src="${str}" title="${title}"`;

		if (splits[2]) {
			outs += ' width="' + splits[2] + '"';
		}
		if (splits[3]) {
			outs += ' height="' + splits[3] + '"';
		}
		outs += ' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />';

		return outs;
	},
	"V": input => { // 视频  [V](url)

		let inputArr = input.split("|");
		let url = inputArr.shift();
		let args = {};

		util.parseEqualToObject(inputArr, args);

		return util.compireH5Video(url, args);
	},
	"A": input => { // 音频  [A](url)
		return util.compireH5Audio(input);
	}
};

const TABLE_REGEX = /(\|(.)+\|\n)+/,
	VERTICAL_BAR = /\|/g;
const TR_JOIN = "</tr><tr>",
	TD_JOIN = "</td><td>",
	TD_START = "<td>",
	TD_END = "</td>",
	TABLE_START = '<table class="table"><tr>',
	TABLE_END = '</tr></table>';
function replaceTable(input) {

	while ((matches = input.match(TABLE_REGEX)) !== null) {
		let part = matches[0]
		let output = [];

		Array.forEach(part.split("\n"), function (i, line) {
			if (i === 1) return;
			if (String.isEmpty(line)) return;
			line = line.slice(1, line.length - 1); // 去掉最开始和最后的 |
			output.push(TD_START + line.replace(VERTICAL_BAR, TD_JOIN) + TD_END);
		});

		let table = TABLE_START + output.join(TR_JOIN) + TABLE_END;

		input = input.replace(part, table);
	}

	return input;
}

const REFERENCE_REGX = /\[\^((\S)+)?\]/;
function replaceReference(input) {

	let tags = new Set(), index = 1;

	while((matches = input.match(REFERENCE_REGX)) !== null) {

		let part = matches[0];
		let tag = matches[1];

		if (!tags.has(part)) { // 没有出现过
			tags.add(part);
			let html = `<sup id="f_${tag}"><a href="#l_${tag}">${tags.size}</a></sup> `;
			input = input.replace(REFERENCE_REGX, html);
		} else { // 已经记载
			let html = `<a id="l_${tag}" href="#f_${tag}">^</a> ${index}: `;
			input = input.replace(REFERENCE_REGX, html);
			index++;
		}
	}

	return input;
}

const ESCAPER_REGX = /\\\//;
function replaceEscapers() {

	let escapes = util.AspectBase('escapes');
	escapes.before = input => {
		while ((matches = input.match(ESCAPER_REGX)) !== null) {
			input = escapes.replace(input, matches[0], part);
		}

		return input;
	}
	return escapes;
}

function replaceAlign() {

	let align = util.AspectBase('align');

	align.before = input => {
		while ((matches = input.match(CENTER_ALIGN_REGX)) !== null) {

			let part = matches[0];
			let str = part.replace(CENTER_ALIGN_REGX, CENTER_ALIGN_STR);
			input = align.replace(input, part, str);
		}

		while ((matches = input.match(LEFT_ALIGN_REGX)) !== null) {

			let part = matches[0];
			let str = part.replace(LEFT_ALIGN_REGX, LEFT_ALIGN_STR);
			input = align.replace(input, part, str);
		}

		while ((matches = input.match(RIGHT_ALIGN_REGX)) !== null) {

			let part = matches[0];
			let str = part.replace(RIGHT_ALIGN_REGX, RIGHT_ALIGN_STR);
			input = align.replace(input, part, str);
		}

		return input;
	};

	return align;
}

const COMMENT_REGX = /\/\*((.|\s)*?)\*\//g,
	ITALIC_REGX = /\/((.|\s){1,})\//g,
	BOLD_REGX = /!((.|\s)*?)!/g,
	DEL_LINE_REGX = /-((.|\s)*?)-/g,
	INS_LINE_REGX = /_((.|\s)*?)_/g,
	CENTER_ALIGN_REGX = /\n\|>((.|\s)+?)<\|\n/,
	LEFT_ALIGN_REGX = /\n\|\:((.|\s)+?)<\|\n/,
	RIGHT_ALIGN_REGX = /\n\|>((.|\s)+?)\:\|\n/,
	FONT_SIZE_REGX = /\?\(([1-9]([0-9]?)):((.|\s)*?)\)/,
	H6_REGX = /###### (.*?)(\n|$)/g,
	H5_REGX = /##### (.*?)(\n|$)/g,
	H4_REGX = /#### (.*?)(\n|$)/g,
	H3_REGX = /### (.*?)(\n|$)/g,
	H2_REGX = /## (.*?)(\n|$)/g,
	H1_REGX = /# (.*?)(\n|$)/g;

const ITALIC_STR = "<em>$1</em>",
	BOLD_STR = "<strong>$1</strong>",
	DEL_LINE_STR = "<del>$1</del>",
	INS_LINE_STR = "<ins>$1</ins>",
	CENTER_ALIGN_STR = '<div class="align_center">$1</div>',
	LEFT_ALIGN_STR = '<div class="align_left">$1</div>',
	RIGHT_ALIGN_STR = '<div class="align_right">$1</div>',
	FONT_SIZE_STR = '<span class="size_$1">$3</span>',
	H6_STR = "<h1 class=\"h6\">$1</h1>",
	H5_STR = "<h1 class=\"h5\">$1</h1>",
	H4_STR = "<h1 class=\"h4\">$1</h1>",
	H3_STR = "<h1 class=\"h3\">$1</h1>",
	H2_STR = "<h1 class=\"h2\">$1</h1>",
	H1_STR = "<h1 class=\"h1\">$1</h1>";

const commons = module.exports = __webpack_require__(3).create((input) => {

	input = input.replace(COMMENT_REGX, String.BLANK); // 去掉注释

	let link = replaceSrcLinks(); // 外部连接
	let align = replaceAlign(); // 对齐
	let escape = replaceEscapers(); // 转义字符

	input = link.before(input);
	input = escape.before(input);
	input = align.before(input);

	input = input.replace(ITALIC_REGX, ITALIC_STR); // 斜体字
	input = input.replace(INS_LINE_REGX, INS_LINE_STR); // 下划线

	input = align.after(input);
	input = escape.after(input);
	input = link.after(input);

	input = replaceQuote(input); // 引用
	input = input.replace(BOLD_REGX, BOLD_STR); // 粗体字
	input = input.replace(DEL_LINE_REGX, DEL_LINE_STR); // 删除线
	input = replaceList(input); // 列表
	input = replaceTable(input); // 表格

	input = input.replace(FONT_SIZE_REGX, FONT_SIZE_STR); // 字号

	input = replaceColor(input); // 颜色

	input = replaceReference(input); // 参考链接

	input = input.replace(H6_REGX, H6_STR); // 六级标题
	input = input.replace(H5_REGX, H5_STR); // 五级标题
	input = input.replace(H4_REGX, H4_STR); // 四级标题
	input = input.replace(H3_REGX, H3_STR); // 三级标题
	input = input.replace(H2_REGX, H2_STR); // 二级标题
	input = input.replace(H1_REGX, H1_STR); // 一级标题

	// 整个文本中，到处都有需要换行处理的地方，而且换行直接<br /> 更符合我自己的习惯，所以段落处理不再实现
	//input = replaceP(input); // 段落

	return input;
}, {
		object: [
			{
				regexp: /\[\[((.|\s)*?)\]\]/,
				tag: {
					start: "[[",
					end: "]]",
					html: "pre",
					attrs: {
						'class': 'pre'
					}
				}
			},
			{
				regexp: /{{((.|\s)*?)}}/,
				tag: {
					start: '{{',
					end: '}}',
					html: 'ruby'
				},
				replace: {
					start: {
						from: /\(/g,
						to: "<rp>(</rp><rt>"
					},
					end: {
						from: /\)/g,
						to: "</rt><rp>)</rp>"
					}
				}
			}
		],
		aspect: {
			simpleLineCode: {
				regexp: /`([^`]+?)`/,
				tag: {
					start: "`",
					end: "`"
				}
			},
			escapeSequence: /\\(\S)/
		}
	});

commons.clear = (str) => {
	return str;
};

/***/ })
/******/ ]);