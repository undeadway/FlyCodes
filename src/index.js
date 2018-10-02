/**
 * FlyEditor 的主逻辑文件。
 * 对已经编码完成的输入进行解析最终输出可供显示的 HTML
 *
 * 内置了 UBB 解析和 HitOn 解析两种解析方式
 */
let HITON_STR = "HitOn";

let parsers = {
	ubbcode: require("./lib/ubbcode"),
	HitOn: require("./lib/HitOn/")
};

let proxy = new Proxy(parsers, {
	get: (target, key) => {
		if (String.startsWith(key, HITON_STR) && key !== HITON_STR) {
			return require("./lib/HitOn/dist/" + key.split("_")[1]);
		} else {
			return target[key];
		}
	}
});

let highLighter = FlyHighLighter.execute;

var CODES_OBJ = {
	regexp: /```(.*[\r\n]+)((.|\s)*?)```/,
	code: "$2",
	name: "$1",
	withLang: (name, code) => {
		if (name) {
			return "```" + name + code + "```";
		} else {
			return "```" + code + "```";
		}
	}
};

function parseCodes(arg) {

	let codes = [];

	return {
		before: (input) => {
			while (arg.regexp.test(input)) {

				let name = RegExp[arg.name];
				let code = RegExp[arg.code];
				let codeWithLang = arg.withLang(name, code);

				input = input.replace(codeWithLang, "{toCode" + codes.length + "}");
				code = highLighter(code, name);

				codes.push(code);
			}
			return input;
		},
		after: (input) => {
			Array.forEach(codes, (i, obj) => {
				input = input.replace("{toCode" + i + "}", obj);
			});
			return input;
		}
	}
}

const FACE_NAME = ['黑线', '怒', '眼泪', '炸毛', '蛋定', '微笑', '汗', '囧', '卧槽', '坏笑', '鼻血', '大姨妈', '瞪眼', '你说啥', '一脸血', '害羞',
	'大好', '喝茶看戏', '美～', '笑岔', '中箭', '呕', '撇嘴', '碎掉', '吐舌头', '纳尼', '泪流满面', '升仙', '扭曲', '闪闪亮', '山', '寨', '基',
	'惊', '头顶青天', '不错', '吃屎', '牛', '严肃', '作死', '帅' /*, '僵尸', '吸血鬼', '喵'*/, '腹黑', '喜闻乐见', '呵呵呵', '！', '？', '吓尿了',
	'嘁', '闪电', "S1", "战斗力爆表", "贼笑", "嗯...", "喵", "奸笑"
];
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

let queues = [
	(input) => { // 表情
		for (var i = 0, len = FACE_NAME.length; i < len; i++) {
			var name = FACE_NAME[i];
			var regExp = new RegExp("\\[" + name + "\\]", "g");
			if (regExp.test(input)) {
				input = input.replace(regExp, '<img src="/res/flies/face/' + (100 + i) + '.gif" title="' + name + '" />');
			}
		}

		return input;
	},
	(str) => { // 字体
		for (var k in FONT_NAMES) {
			var regExp = new RegExp("\\[font=" + k + "\\]", "g");
			if (regExp.test(str)) {
				str = str.replace(regExp, '<span class="font_' + FONT_NAMES[k] + '">');
			}
		}
		return str;
	}
];

let basePlugIn = {
	ubbcode: {
		aspect: [
			{ // 代码
				method: parseCodes,
				object: {
					regexp: /\[code(=((.|\s)*?))?\]((.|\s)*?)\[\/code\]/,
					code: "$4",
					name: "$2",
					withLang: (name, code) => {
						if (name) {
							return `[code=${name}]${code}[/code]`;
						} else {
							return `[code]${code}[/code]`;
						}
					}
				}
			}
		],
		queue: queues
	},
	HitOn: {
		aspect: [
			{ // 代码
				method: parseCodes,
				object: CODES_OBJ
			}
		],
		queue: queues
	}
};

function getPlugIn(name) {
	if (String.startsWith(name, HITON_STR)) {
		name = HITON_STR;
	}
	return basePlugIn[name];
}

Coralian.setToGlobal("FlyCodes", {
	toHTML: (src, name) => {

		if (!name) return src;

		if (name === 'UBB') {
			name = 'ubbcode';
		}

		try {
			src = src.replace(/\r\n/g, "\n"); // 把 \r 给全部去掉，免得出现各种奇怪的东西
			src = src.replace(/\r/g, "\n");
			let parse = proxy[name];
			return parse.toHTML(src, getPlugIn(name));
		} catch (e) {
			Coralian.logger.err(e);
			return `<pre>${src}</pre>`;
		}
	},
	/*
	 * 因为页面上需要点击下载，所以ED2K算是一个独立的组成，这里单独给出相关方法供调用
	 * 但如何解析 ED2K，依然交由各个语言自己实现
	 */
	ed2k: {
		change: function (index) {
			var ed2k = document.getElementById('ed2k_' + index);
		},
		downloadSelected: function (index) {
			var ed2k = document.getElementById('ed2k_' + index);
		},
		selectAll: function () {
		}
	}
});
