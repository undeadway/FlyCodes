/**
 * FlyEditor 的主逻辑文件。
 * 对已经编码完成的输入进行解析最终输出可供显示的 HTML
 *
 * 内置了 UBB 解析和 HitOn 解析两种解析方式
 */
const util = require("./lib/util");
const HITON_STR = "HitOn", UBB_STR = "UBB";

const parsers = {
	ubbcode: require("./lib/ubbcode"),
	HitOn: require("./lib/HitOn/")
};

// 这个代理的好处是，不用为每个不同的项目写一个对象，只要写 if/else 就可以了
const langProxy = new Proxy(parsers, {
	get: (target, key) => {
		if (String.startsWith(key, HITON_STR) && key !== HITON_STR) {
			return require("./lib/HitOn/dist/" + key.split("_")[1]); // 这里是为了保证 HitOn可以向前兼容
		} else {
			return target[key];
		}
	}
});

// 代码解析用
const CODES_OBJ = {
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

const basePlugIn = {
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
		//	queue: queues
	},
	HitOn: {
		aspect: [
			{ // 代码
				method: parseCodes,
				object: CODES_OBJ
			}
		],
		//	queue: queues
	}
};

let highLighter = null;

function getPlugIn(name) {
	if (String.startsWith(name, HITON_STR)) {
		name = HITON_STR;
	}
	return basePlugIn[name];
}

function parseCodes(arg) {

	let codes = util.AspectBase('codes');
	codes.before = input => {
		if (highLighter) {
			while (arg.regexp.test(input)) {

				let name = RegExp[arg.name];
				let code = RegExp[arg.code];
				let codeWithLang = arg.withLang(name, code);

				let outCode = highLighter(code, name);
				input = codes.replace(input, codeWithLang, outCode);
			}
		}
		return input;
	};

	return codes;
}

function addPlugIn(adds, lang) {
	let p = basePlugIn[lang];

	p.aspect = p.aspect || [];
	p.queue = p.queue || [];
	p.object = p.object || [];

	if (adds.aspect) {
		adds.aspect.map(item => {
			p.aspect.push(item);
		});
	}
	if (adds.queue) {
		adds.queue.map(item => {
			p.queue.push(item);
		});
	}
	if (adds.object) {
		adds.object.map(item => {
			p.object.push(item);
		});
	}
}

Coralian.setToGlobal("FlyCodes", {
	lang: {
		HITON: HITON_STR,
		UBB: UBB_STR
	},
	setHighLighter: (input) => {
		highLighter = input;
	},
	addPlugIn: (adds, lang) => {

		if (lang) {
			addPlugIn(adds, lang);
		} else {
			let langs = Object.keys(basePlugIn);
			for (let _lang of langs) {
				addPlugIn(adds, _lang);
			}
		}

	},
	toHTML: (src, name) => {

		if (!name) return src;

		if (name === 'UBB') {
			name = 'ubbcode';
		}

		try {
			src = src.replace(/\r\n/g, "\n"); // 把 \r 给全部去掉，免得出现各种奇怪的东西
			src = src.replace(/\r/g, "\n");
			let parse = langProxy[name];
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
