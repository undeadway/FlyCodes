/**
 * FlyEditor 的主逻辑文件。
 * 对已经编码完成的输入进行解析最终输出可供显示的 HTML
 *
 * 内置了 UBB 解析和 HitOn 解析两种解析方式
 *
 * 文件解析的接口中只定义了
 * toHTML
 * clear
 */

var newXmlWrapper = Coralian.dom.newXmlWrapper;
var EMPTY_STRING = String.BLANK;
var isNumber = Number.isNumber,
	formatFileSize = Coralian.Formatter.formatFileSize;
let getPlugIn = require("./plugin");
const BR_TAG = "<br />";

function replacePhonics(str, regexp, startTag, endTag) {

	while (regexp.test(str)) {

		var inner = RegExp.$1;
		var input = startTag + inner + endTag;

		inner = inner.replace(/\(/g, "<rp>(</rp><rt>");
		inner = inner.replace(/\)/g, "</rt><rp>)</rp>");

		var output = '<ruby>' + inner + '</ruby>';

		str = str.replace(input, output);
	}

	return str;
}

function replaceURI(str) {

	try {
		str = decodeURIComponent(str);// 最后的转义出处理
	} catch (e) {
		// 如果出错，就当不存在
	}

	return str;
}

function escapseED2K(ed2kStart, ed2kEnd) {

	var ed2kIndex = 0;

	function __escapseED2K(str) {

		// 解析出 [ed2k] [/ed2k] 的结构
		var start = str.indexOf(ed2kStart);
		var end = str.indexOf(ed2kEnd);

		if (start < 0) return str; // decodeURI(str);
		if (end < 0) ed2KError();

		var box = newXmlWrapper('fieldset', {
			"class": "fieldset ed2k_box"
		}).add(newXmlWrapper("legend").add("ED2K资源"));
		// 分割 [ed2k] [/ed2k] 中间的字符串为数组
		var title = newXmlWrapper("ul", {
			'class': 'ed2k_title'
		}).add(newXmlWrapper('li', {
			'class': 'ed2k_cb'
		}).add("选择")).add(newXmlWrapper("li", {
			'class': 'ed2k_name'
		}).add("资源名称")).add(newXmlWrapper("li", {
			'class': 'ed2k_size'
		}).add("资源大小"));
		var div = newXmlWrapper('div');
		box.add(div);
		div.add(title);
		var ed2ks = str.slice(start + 6, end).split(BR_TAG);
		for (var i = 0, len = ed2ks.length; i < len; i++) {
			var ed2k = ed2ks[i];
			if (!String.isEmpty(String.trim(ed2k))) {
				// 以 | 为单位分割行，并判断每一行是否符合 ED2K 协议，不符合则直接显示原内容
				var ed2kElement = ed2k.split('|');
				// 符合 ED2K 协议的情况下，解析ED2K 相关部分，并显示内容到页面上
				// 关于 ED2K 协议参考：http://zh.wikipedia.org/wiki/ED2k%E9%93%BE%E6%8E%A5
				if (ed2kElement[0] !== 'ed2k://') {
					ed2KError();
				}
				var type = ed2kElement[1];
				var line = newXmlWrapper('ul', {
					'class': 'ed2k_line'
				}).add(newXmlWrapper('li', {
					'class': 'ed2k_cb'
				}).add(newXmlWrapper('input', {
					type: 'checkbox',
					name: 'ed2k_' + ed2kIndex,
					value: ed2k
				})));
				switch (type) {
					case 'file':
						var name = decodeURI(ed2kElement[2]);
						var size = ed2kElement[3],
							hash = ed2kElement[4];

						if (!isNumber(size) || !isNumber(hash, Number.HEX)) {
							ed2KError();
						}

						line.putAttribute('title', name);

						var showName = newXmlWrapper('li', {
							'class': 'ed2k_name',
							title: name
						}).add(newXmlWrapper('a', {
							href: ed2k
						}).add(name));
						var showSize = newXmlWrapper('li', {
							'class': 'ed2k_size'
						});
						showSize.add(formatFileSize(size));
						line.add(showName).add(showSize);
						break;
					// 其他链接模式暂时不实现
					/* case 'server':
						break; */
					default:
						ed2KError();
				}
				div.add(line);
			}
		}

		box.add(newXmlWrapper('div', {
			'class': 'ed2k_dl_div'
		}).add(newXmlWrapper('input', {
			type: 'checkbox',
			name: 'ed2k_' + ed2kIndex,
			onchange: 'NameBridge.codes.ed2k.change(' + ed2kIndex + ')'
		})).add('全选/全不选').add(newXmlWrapper('input', { // TODO 相关操作未实现
			type: 'button',
			'class': 'ed2k_dl_button',
			value: '下载选中的连接',
			onclick: 'NameBridge.codes.ed2k.downloadSelected(' + ed2kIndex + ')'
		})));

		ed2kIndex++;

		str = decodeURI(str.slice(0, start)) + box.toString() + str.slice(end + 7);

		// 递归查找下一处
		return __escapseED2K(str);
	};

	return __escapseED2K;
};

function replacePre(preArg) {
	var source = [];
	return {
		before: function (str) {
			while (preArg.PRE_REGEXP.test(str)) {
				var inner = RegExp.$1;
				str = str.replace(preArg.PRE_START_TAG + inner + preArg.PRE_END_TAG, "{pre" + source.length + "}");
				source.push('<pre class="pre">' + inner + '</pre>');
			}

			return str;
		},
		after: function (str) {

			Object.forEach(source, function (i, src) {
				str = str.replace("{pre" + i + "}", src);
			});

			return str;
		}
	};
}

function defaultReplaceFace(str) {

	for (var i = 0, len = FACE_NAME.length; i < len; i++) {
		var name = FACE_NAME[i];
		var regExp = new RegExp("\\[" + name + "\\]", "g");
		if (regExp.test(str)) {
			str = str.replace(regExp, '<img src="/res/flies/face/' + (100 + i) + '.gif" title="' + name + '" />');
		}
	}

	return str;
}

// 从名称到代码
const FONT_NAMES = {
	'宋体': 'song',
	'仿宋': 'fsong',
	'楷体': 'kai',
	'魏碑': 'weibei',
	'隶书': 'lishu',
	'黑体': 'hei',
	'Arial': 'arial',
	'Courier New': 'couriernew',
	'MS PGothic': 'mspgothic',
	'MS PMincho': 'mspmincho',
	'Tahoma': 'tahoma',
	'Times New Roman': 'timesnewroman'
};

const FACE_NAME = ['黑线', '怒', '眼泪', '炸毛', '蛋定', '微笑', '汗', '囧', '卧槽', '坏笑', '鼻血', '大姨妈', '瞪眼', '你说啥', '一脸血', '害羞',
	'大好', '喝茶看戏', '美～', '笑岔', '中箭', '呕', '撇嘴', '碎掉', '吐舌头', '纳尼', '泪流满面', '升仙', '扭曲', '闪闪亮', '山', '寨', '基',
	'惊', '头顶青天', '不错', '吃屎', '牛', '严肃', '作死', '帅' /*, '僵尸', '吸血鬼', '喵'*/, '腹黑', '喜闻乐见', '呵呵呵', '！', '？', '吓尿了',
	'嘁', '闪电', "S1", "战斗力爆表", "贼笑", "嗯...", "喵", "奸笑"
];

function ed2KError() {
	throw new Error("ED2K链接的格式不正确");
}

function hitOn() {

	var preArg = {
		PRE_REGEXP: /\[\[((.|\s)*?)\]\]/,
		PRE_START_TAG: '[[',
		PRE_END_TAG: ']]'
	};

	let ES_REGEXP = /\\(.)/;

	function replaceEscapeSequence() {
		var escapeSequences = [];
		return {
			before: function (input) {
				while (ES_REGEXP.test(input)) {
					input = input.replace(ES_REGEXP, '{backslash' + escapeSequences.length + '}');
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

	var replaceTable = (function () {

		const TABLE_REGEX = /(\|(.)+\|\n)+/,
			VERTICAL_BAR_G_REGX = /\|/g,
			NL_G_REGX = /\|\n\|/g;

		const TD_JOIN = "</td><td>",
			TABLE_START = '<table class="table">', TABLE_END = '</table>',
			TR_START = '<tr><td>', TR_END = '</td></tr>';

		return function (input) {

			while ((matches = input.match(TABLE_REGEX)) !== null) {

				let output = [];
				let part = matches[0];

				Array.forEach(part.split("\n"), (i, line) => {

					if (i === 1) return;
					if (String.isEmpty(String.trim(line))) return;

					output.push(TR_START);
					output.push(line.slice(1, line.length - 1) // 去头尾的 |
						.replace(VERTICAL_BAR_G_REGX, TD_JOIN));
					output.push(TR_END);
				})

				let table = TABLE_START + output.join("") + TABLE_END;

				input = input.replace(part, table);
			}

			return input;
		}

	})();

	var replaceList = (function () {

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

	const MAIN_QUOT_REGX = /\n((&gt;(.*)\n)+)/,
		NL_RT_ANGLE_GLOBAL_REGX = /\n&gt;/g;
	const STRING_QUOTE = "引用";
	function replaceQuote(input) {

		while (MAIN_QUOT_REGX.test(input)) { // 获取>列表行，从 \n> 开始 到 >\n 结束，中间每行都以 > 开头 \n 结束
			let protoQuotTxt = RegExp.$1;
			let quotTxt = protoQuotTxt.replace(NL_RT_ANGLE_GLOBAL_REGX, "\n"); // 去掉每行开头的 >(&gt;)
			quotTxt = quotTxt.slice(4); // 去掉第一行的 >(&gt;)
			let indexNL = quotTxt.indexOf("\n");

			let quotTtlLn = quotTxt.slice(0, indexNL);
			let hasQuotTtl = quotTtlLn.startsWith("(") && quotTtlLn.endsWith(")");

			let legend = hasQuotTtl ? quotTtlLn.slice(1, quotTtlLn.length - 1) : STRING_QUOTE;
			let outTxt = hasQuotTtl ? quotTxt.slice(indexNL + 1) : quotTxt;

			input = input.replace(MAIN_QUOT_REGX, `<fieldset><legend>${legend}</legend>${outTxt}</fieldset>`);
		}

		return input;
	}

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

	/**
	 * #(url|txt|title|target)
	 *
	 * @param {Object} input
	 */
	const LINK_TAG_REGX = /#\(((.|\s)*?)\)/;
	function replaceLink(input) {
		while (LINK_TAG_REGX.test(input)) {
			var inner = RegExp.$1;
			var splits = inner.split("|");
			var url = splits[0]
			var outs = '<a href="' + url + '"';
			outs += ' title="' + (splits.length === 4 ? (splits[2] || url) : url) + '"';

			var target = splits[splits.length === 4 ? 3 : 2];
			if (target) {
				outs += ' target="_' + target + '"';
			}
			outs += '>';
			outs += splits[1] || url;
			outs += '</a>';
			outs = outs.replace(/<\/?em>/g, "/");

			input = input.replace("#(" + inner + ")", outs);
		}
		return input;
	}

	/**
	 *  $(url|title|width|height)
	 *
	 * @param {Object} input
	 */
	const IMG_TAG_REGX = /\$\(((.|\s)*?)\)/;
	function replaceImg(input) {
		while (IMG_TAG_REGX.test(input)) {
			var inner = RegExp.$1;
			var splits = inner.split("|");
			var str = splits[0].replace(/<\/?(em)>/g, "/");
			str = str.replace(/<\/?(ins)>/g, "_");
			str = str.replace(/<\/?(del)>/g, "-");
			var outs = '<img src="' + str + '"';
			outs += ' title="' + (splits[1] || str) + '"';

			if (splits[2]) {
				outs += ' width="' + splits[2] + '"';
			}

			if (splits[3]) {
				outs += ' height="' + splits[3] + '"';
			}
			outs += ' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />';

			input = input.replace("$(" + inner + ")", outs);
		}
		return input;
	}

	const SIMPLE_LINE_CODE_REGX = /`((.)*?)`/;
	function replaceSimpleLineCode() {

		var lineCodes = [];

		return {
			before: function (input) {
				while (SIMPLE_LINE_CODE_REGX.test(input)) {
					let obj = RegExp.$1;
					input = input.replace("`" + obj + "`", "[lineCode" + lineCodes.length + "]");
					lineCodes.push("<code class=\"code\">" + obj + "</code>");
				}
				return input;
			},
			after: function (input) {
				Object.forEach(lineCodes, function (i, obj) {
					input = input.replace(new RegExp('\\[lineCode' + i + '\\]', 'g'), obj);
				});
				return input;
			}
		}
	}

	const COMMENT_REGX = /\/\*((.|\s)*?)\*\//g,
		ITALIC_REGX = /\/((.|\s){1,})\//g,
		BOLD_REGX = /!((.|\s)*?)!/g,
		UNCHECKED_CHECKBOX_REGX = /\[\-:((.|\s)*?)\]/g,
		CHECKED_CHECKBOX_REGX = /\[\+:((.|\s)*?)\]/g,
		DEL_LINE_REGX = /-((.|\s)*?)-/g,
		INS_LINE_REGX = /_((.|\s)*?)_/g,
		CENTER_ALIGN_REGX = /\n&gt;&gt;((.|\s)+)&lt;&lt;\n/g,
		LEFT_ALIGN_REGX = /\n\|\:((.|\s)+)&lt;&lt;\n/g,
		RIGHT_ALIGN_REGX = /\n&gt;&gt;((.|\s)+)\:\|\n/g,
		PHONICS_REGX = /\{\{((.|\s)*?)\}\}/,
		FONT_SIZE_REGX = /\?\(([1-9]([0-9]?)):((.|\s)*?)\)/,
		H6_REGX = /###### (.*?)(\n|$)/g,
		H5_REGX = /##### (.*?)(\n|$)/g,
		H4_REGX = /#### (.*?)(\n|$)/g,
		H3_REGX = /### (.*?)(\n|$)/g,
		H2_REGX = /## (.*?)(\n|$)/g,
		H1_REGX = /# (.*?)(\n|$)/g,
		NL_REGX = /\n/g,
		LEFT_ANGLE_REGX = /</g,
		RIGHT_ANGLE_REGX = />/g;

	const ITALIC_STR = "<em>$1</em>",
		BOLD_STR = "<strong>$1</strong>",
		CHECKED_CHECKBOX_STR = "<input type=checkbox checked=checked name=$1 />",
		UNCHECKED_CHECKBOX_STR = "<input type=checkbox name=$1 />",
		DEL_LINE_STR = "<del>$1</del>",
		INS_LINE_STR = "<ins>$1</ins>",
		CENTER_ALIGN_STR = '<div class="align_center">$1</div>',
		LEFT_ALIGN_STR = '<div align="align_left">$1</div>',
		RIGHT_ALIGN_STR = '<div align="align_right">$1</div>',
		FONT_SIZE_STR = '<span class="size_$1">$3</span>',
		H6_STR = "<h1 class=\"h6\">$1</h1>",
		H5_STR = "<h1 class=\"h5\">$1</h1>",
		H4_STR = "<h1 class=\"h4\">$1</h1>",
		H3_STR = "<h1 class=\"h3\">$1</h1>",
		H2_STR = "<h1 class=\"h2\">$1</h1>",
		H1_STR = "<h1 class=\"h1\">$1</h1>",
		LEFT_ANGLE_STR = "&lt;",
		RIGHT_ANGLE_STR = "&gt;";

	function parse(input) {

		var es = replaceEscapeSequence(); // 转义符号
		var slc = replaceSimpleLineCode();
		input = slc.before(input);
		input = es.before(input);

		input = input.replace(COMMENT_REGX, EMPTY_STRING); // 去掉注释
		input = input.replace(ITALIC_REGX, ITALIC_STR); // 斜体字
		input = replaceQuote(input); // 引用
		input = input.replace(BOLD_REGX, BOLD_STR); // 粗体字
		input = input.replace(UNCHECKED_CHECKBOX_REGX, UNCHECKED_CHECKBOX_STR); // 未选中复选框
		input = input.replace(CHECKED_CHECKBOX_REGX, CHECKED_CHECKBOX_STR); // 选中的复选框
		input = input.replace(DEL_LINE_REGX, DEL_LINE_STR); // 删除线
		input = input.replace(INS_LINE_REGX, INS_LINE_STR); // 下划线
		input = replaceList(input); // 列表
		input = replaceTable(input); // 表格

		input = input.replace(CENTER_ALIGN_REGX, CENTER_ALIGN_STR); // 居中对齐
		input = input.replace(LEFT_ALIGN_REGX, LEFT_ALIGN_STR); // 左对齐
		input = input.replace(RIGHT_ALIGN_REGX, RIGHT_ALIGN_STR); // 右对齐

		input = replacePhonics(input, PHONICS_REGX, "{{", "}}"); // 注音
		input = input.replace(FONT_SIZE_REGX, FONT_SIZE_STR); // 字号

		input = replaceColor(input); // 颜色
		input = replaceLink(input); // 链接
		input = replaceImg(input); // 图像

		input = input.replace(H6_REGX, H6_STR); // 六级标题
		input = input.replace(H5_REGX, H5_STR); // 五级标题
		input = input.replace(H4_REGX, H4_STR); // 四级标题
		input = input.replace(H3_REGX, H3_STR); // 三级标题
		input = input.replace(H2_REGX, H2_STR); // 二级标题
		input = input.replace(H1_REGX, H1_STR); // 一级标题

		var pre = replacePre(preArg); // 预定义格式
		input = pre.before(input);

		// 整个文本中，到处都有需要换行处理的地方，而且换行直接<br /> 更符合我自己的习惯，所以段落处理不再实现
		//input = replaceP(input); // 段落

		input = input.replace(NL_REGX, BR_TAG); // 单行换行
		input = pre.after(input);

		input = es.after(input);
		input = slc.after(input);

		return input;
	}

	return {

		toHTML: function (str) {

			let plugIns = getPlugIn();

			if (plugIns) {
				Object.forEach(plugIns, function (i, obj) {
					str = obj.before(str);
				});
			}

			str = str.replace(LEFT_ANGLE_REGX, LEFT_ANGLE_STR);
			str = str.replace(RIGHT_ANGLE_REGX, RIGHT_ANGLE_STR);

			str = parse(str);
			str = defaultReplaceFace(str);

			// 插件的后处理
			if (plugIns) {
				Object.forEach(plugIns, function (i, obj) {
					str = obj.after(str);
				});
			}

			// 后处理
			str = str.replace(/\<\/(p|pre)\>\n/, "</$1>");

			return replaceURI(str);
		},
		clear: function (str) {
			return str;
		}
	}
}

module.exports = hitOn();