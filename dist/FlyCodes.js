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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

﻿/**
 * FlyEditor 的主逻辑文件。
 * 对已经编码完成的输入进行解析最终输出可供显示的 HTML
 *
 * 内置了 UBB 解析和 HitOn 解析两种解析方式
 */
const util = __webpack_require__(1);
const HITON_STR = "HitOn", UBB_STR = "UBB";

const parsers = {
	ubbcode: __webpack_require__(2),
	HitOn: __webpack_require__(4)
};

const proxy = new Proxy(parsers, {
	get: (target, key) => {
		if (String.startsWith(key, HITON_STR) && key !== HITON_STR) {
			return __webpack_require__(5)("./" + key.split("_")[1]); // 这里是为了保证 HitOn可以向前兼容
		} else {
			return target[key];
		}
	}
});

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

Coralian.setToGlobal("FlyCodes", {
	lang: {
		HITON: HITON_STR,
		UBB: UBB_STR
	},
	setHighLighter: input => {
		highLighter = input;
	},
	addPlugIn: (lang, adds) => {

		let p = basePlugIn[lang];

		Object.addAll(adds.aspect, p.aspect);
		Object.addAll(adds.queue, p.queue);
		Object.addAll(adds.object, p.object);

	},
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


/***/ }),
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

﻿
const EMPTY_STRING = String.BLANK;
const util = __webpack_require__(1);

const replaceImg = (function () {

	const IMG_ALIGN_REGX = /align=(left|center|right|justify)/,
		IMG_W_H_REGX = /(width|height)=(\d+)/,
		IMG_SIZE_REGX = /size=\((\d+),(\d+)\)/;

	const ONLOAD_ONCLICK_STR = ' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />';

	/*
	 * img 标签属性，可以都不出现，或者都出现
	 * 其中 size 和 width/height 不可以同时出现
	 * +---------+------------------------------+
	 * |align	|(left|center|right|justify)   |
	 * +---------+------------------------------+
	 * |size	 |(width,height)				|
	 * +---------+------------------------------+
	 * |width	|value						 |
	 * +---------+------------------------------+
	 * |height   |value						 |
	 * +---------+------------------------------+
	 */
	function _replaceImg(input, output) {

		let hasSize = false,
			hasWidth_height = false;

		if ((matched = input.match(IMG_ALIGN_REGX)) !== null) {
			output += ' class="flyimg img_' + matched[1] + '"';
		}

		if ((matched = input.match(IMG_W_H_REGX)) !== null) {
			hasSize = true;
			output += ' ' + matched[1] + '="' + matched[2] + '"';
		}

		if ((matched = input.match(IMG_SIZE_REGX)) !== null) {
			hasWidth_height = false;
			output += ' width="' + matched[1] + '" height="' + matched[2] + '"';
		}

		if (hasSize && hasWidth_height) {
			throw new Error("不能同时指定 size 和 with 或 height。");
		}

		output += ONLOAD_ONCLICK_STR; // styles.Image 模块的定义直接交给前台自定义实现，FlyEditor 相当于只给一个接口而不具体负责实现

		return output;
	}

	const IMG_LINK_WITH_SRC_ATRR_REGX = /\[img (align|size|width|height)=([^\[]+)\]([^\[]+)\[\/img\]/,
		IMG_LINK_WITH_ATRR_REGX = /\[img=([^\[]*) (align|size|width|height)=([^\[]+)\]([^\[]+)\[\/img\]/,
		IMG_LINK_WITH_SRC_REGX = /\[img=([^\[]*)\](.+?)\[\/img\]/g,
		IMG_LINK_WITH_NONE_REGX = /\[img\]([^\[]*)\[\/img\]/g;

	const IMG_LINK_WITH_NONE_STR = '<img class=\"flyimg\" title="$1" src="$1" onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />',
		IMG_LINK_WITH_SRC_STR = '<img class=\"flyimg\" src="$1" title="$2" onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />';

	return function (str) {
		/*
		 * 可能组合1：img之后为空
		 * [img align=value]src[/img]
		 * [img size=(width,height)]src[/img]
		 * [img width=value height=value]src[/img]
		 * [img width=value]src[/img]
		 * [img height=value]src[/img]
		 * [img align=value size=(width,height)]src[/img]
		 * [img align=value width=value height=value]src[/img]
		 * [img align=value width=value]src[/img]
		 * [img align=value height=value]src[/img]
		 */
		while ((matched = str.match(IMG_LINK_WITH_SRC_ATRR_REGX)) !== null) {

			let input = "[img " + matched[1] + "=" + matched[2] + "]" + matched[3] + "[/img]";
			let output = '<img src="' + matched[3] + '"';

			str = str.replace(input, _replaceImg(input, output));
		}

		/*
		 * 可能组合2：img之后带src
		 * [img=src align=value]title[/img]
		 * [img=src size=(width,height)]title[/img]
		 * [img=src width=value height=value]title[/img]
		 * [img=src width=value]title[/img]
		 * [img=src height=value]title[/img]
		 * [img=src align=value size=(width,height)]title[/img]
		 * [img=src align=value width=value height=value]title[/img]
		 * [img=src align=value width=value]title[/img]
		 * [img=src align=value height=value]title[/img]
		 */
		while ((matched = str.match(IMG_LINK_WITH_ATRR_REGX)) !== null) {

			let input = "[img=" + matched[1] + " " + matched[2] + "=" + matched[3] + "]" + matched[4] + "[/img]";
			let output = '<img src="' + matched[1] + '" title="' + matched[4] + '"';

			str = str.replace(input, _replaceImg(input, output));
		}

		// 不带属性的两种写法
		str = str.replace(IMG_LINK_WITH_NONE_REGX, IMG_LINK_WITH_NONE_STR); //[img]src[img]
		str = str.replace(IMG_LINK_WITH_SRC_REGX, IMG_LINK_WITH_SRC_STR); //[img=src]title[img]

		return str;
	};
})();

const replaceList = function () {

	function _replaceList(inner, tag) {

		tag = tag || 'ul';

		if (String.isEmpty(inner)) return inner;

		inner = inner.split("[*]");
		inner.shift(); // 因为 split 之后，第一个 [*] 之前的空白也会被算作一行，所以这里直接去掉

		let output = "<" + tag + "><li>" + inner.join("</li><li>") + "</li></" + tag + ">";

		return output;

	}

	const SIMLE_LIST_REGX = /\[list\]((.|\s)*?)\[\/list\]/,
		LIST_REGX = /\[list=(a|A|1|\*|#|o|i|I|α|一|あ|ア)( [^\[]+)*\]((.|\s)*?)\[\/list\]/;

	const LIST_TYPE_STR = "list_type_";

	return function (str) {

		while ((matched = str.match(SIMLE_LIST_REGX)) !== null) {
			str = str.replace("[list]" + matched[1] + "[/list]", _replaceList(matched[1]));
		}

		while ((matched = str.match(LIST_REGX)) !== null) {

			let tag,
				type = matched[1]
			params = matched[2] || String.BLANK,
				outParam = EMPTY_STRING,
				inner = matched[3],
				className = LIST_TYPE_STR;

			if (!String.isEmpty(params)) {
				params = params.split(" ");
				if (params.length > 2) {
					throw new Error("参数个数不正确");
				}

				for (let i = 0; i < 2; i++) {
					if (params[i] === 'reversed') {
						outParam += " reversed";
					} else if (String.startsWith(params[i], "start")) {
						outParam += ' start="' + params[i].last() + '"';
					} else {
						throw new Error("参数不正确");
					}
				}
			}

			switch (type) {
				case '#':
					className += "square";
					break;
				case '*':
					className += "disc";
					break;
				case 'o':
					className += "circle";
					break;
				case 'α':
					className += "greek";
					tag = "ol";
					break;
				case '一':
					className += "shuzi";
					tag = "ol";
					break;
				case 'あ':
					className += "hira";
					tag = "ol";
					break;
				case 'ア':
					className += "kata";
					tag = "ol";
					break;
				default:
					tag = "ol";
					className += type;
					break;
			}

			str = str.replace("[list=" + type + params + "]" + inner + "[/list]", _replaceList(inner, tag));

		}

		return str;
	};
}();

const SIMPLE_URL_REGX = /\[url]((.|\s)*?)\[\/url\]/g,
	URL_WITH_TARGET_REGX = /\[url target=([^\[]*)\]((.|\s)*?)\[\/url\]/g,
	URL_WITH_LINK_TARGET_REGX = /\[url=([^\[]*) target=([^\[]*)\]((.|\s)*?)\[\/url]/g,
	URL_WITH_LINK_REGX = /\[url=([^\[]*)\]((.|\s)*?)\[\/url\]/g;
const SIMPLE_URL_STR = '<a href="$1">$1</a>',
	URL_WITH_TARGET_STR = '<a href="$2" title="$2" target="_$1">$2</a>',
	URL_WITH_LINK_TARGET_STR = '<a href="$1" title="$1" target="_$2">$3</a>',
	URL_WITH_LINK_STR = '<a href="$1" title="$2">$2</a>';

function replaceUrl(str) {

	str = str.replace(SIMPLE_URL_REGX, SIMPLE_URL_STR); // [url]link[url]
	str = str.replace(URL_WITH_TARGET_REGX, URL_WITH_TARGET_STR); // [url target=value]link[/url]
	str = str.replace(URL_WITH_LINK_TARGET_REGX, URL_WITH_LINK_TARGET_STR);// [url=link target=value]title[/url]
	str = str.replace(URL_WITH_LINK_REGX, URL_WITH_LINK_STR); // [url=link]title[url]

	return str;
}

const replaceH5Video = (function () {

	const h5QUeryMap = {
		bilibili: function ({ url, page }) {
			page = page || 1;

			let src = 'https://www.bilibili.com/blackboard/player.html?aid=' + url.replace("av", '');
			// let args = 'scrolling="no" border="0" framespacing="0"';
			let args = {
				scrolling: 'no',
				border: 0,
				framespacing: 0
			};

			return util.compireH5Video(url, args);
		},
		youku: function ({ url }) {
			let src = `http://player.youku.com/embed/${url}`;

			return util.compireH5Video(src);
		},
		common: (url, args) => {
			return util.compireH5Video(url, args);
		}
	};
	const REGEX_H5VIDEO_ARGS = /\[video=([^\]]+)\]([^\]]+)\[\/video\]/, H5_FORMAT_ARGS = "[video=%1]%2[/video]", NAME_REGX = /(([^\]]+))*\(([^\]]+)\)/;
	const REGEX_H5VIDEO = /\[video\]([^\]]+)\[\/video\]/, H5_FORMAT = "[video]%2[/video]";

	function __replace(str, input, title, name, url, args) {

		let h5Query = name ? (h5QUeryMap[name] || h5QUeryMap.common) : h5QUeryMap.common;
		let output = h5Query(url, args);

		input = input.replace("%1", title);
		input = input.replace("%2", url);

		return str.replace(input, output);
	}

	return function (str) {

		if (arguments.length === 1) {

			while((matched = str.match(REGEX_H5VIDEO)) !== null) {
				str = __replace(str, H5_FORMAT, null, null, matched[1]);
			}

			while ((matched = str.match(REGEX_H5VIDEO_ARGS)) !== null) {
				let title = name = matched[1];
				let value = matched[2].split(",");
				let url = value[0];
				let page = value[1] || '';

				let args = {};
				if (page) {
					args.page = page;
				}

				let argMarch = title.match(NAME_REGX);
				if (argMarch !== null) {
					name = argMarch[1];
					util.parseEqualToObject(argMarch[3].split(","), args);
				}

				str = __replace(str, H5_FORMAT_ARGS, title, name, url, args);
			}
		} else {
			// 这里是留给原FLASH格式的接口
			str = __replace(str, arguments[1], arguments[2], arguments[3], arguments[4] || '');

		}
		return str;
	}
})();

const BILIBILI_FLASH_REGEX = /\[flash=bilibili]([^\[]+)\.swf\?aid=([^\[]+)\[\/flash]/;
const NORMAL_FLASH_REGEX = /\[flash]([^\[]+)\[\/flash]/;
const NORMAL_FLASH_STR = '<embed src="$1" allowFullScreen="true" name="movie" value="opaque" width="634" height="440" type="application/x-shockwave-flash" />';
const YOUKU_STR = 'youku';
const BILIBILI_STR = 'bilibili';

function replaceFlash(str) {

	// 将 B 站的FLASH全部替换为H5播放器
	while ((matched = str.match(BILIBILI_FLASH_REGEX)) !== null) {
		let url = matched[1];
		let values = matched[2];
		let valArr = values.split("&amp;page=");
		let input = "[flash=bilibili]" + url + ".swf?aid=" + values + "[/flash]";
		str = replaceH5Video(str, input, BILIBILI_STR, valArr[0], valArr[1]);
	}

	while ((matched = str.match(NORMAL_FLASH_REGEX)) !== null) {
		let url = matched[1];
		let input = `[flash]${url}[/flash]`;
		if (String.contains(url, YOUKU_STR)) { // 优酷
			let urls = url.split("/");
			str = replaceH5Video(str, input, YOUKU_STR, urls[urls.length - 2]);
		} else { // 其他，暂时保留 FLASH
			str = str.replace(NORMAL_FLASH_REGEX, NORMAL_FLASH_STR);
		}
	}

	return str;
}

const TD_TR_REGX = /\[(tr|td) ([^\[]+)=([^\[]+)\]/g,
	TABLG_REGX = /\[table ([^\[]+)=([^\[]+)\]/g,
	SIMPLE_TABLG_REGX = /\[table\]/g,
	TABLE_END_REGX = /\[\/table\]/g;
const TD_TR_STR = '<$1 $2="$3">',
	TABLG_STR = '<table $1="$2" class="table">',
	SIMPLE_TABLG_STR = '<table class="table">',
	TABLE_END_STR = '</table>';

function replaceTable(str) {

	str = str.replace(TD_TR_REGX, TD_TR_STR);
	str = str.replace(TABLG_REGX, SIMPLE_TABLG_STR);
	str = str.replace(SIMPLE_TABLG_REGX, SIMPLE_TABLG_STR);
	str = str.replace(TABLE_END_REGX, TABLE_END_STR);

	return str;
}

const BLOCK_REGX = /\[(\/)?(quote|p|table|td|tr|list|align)\]\n\[(\/)?(quote|p|table|td|tr|list|align)/,
	SIMPLE_SPAN_TAG_ENDS_REGX = /\[\/(size|color|font|bgcolor)\]/g,
	SPAN_TAG_ENDS_REGX = /\[(\/)?(sub|sup|del|p|tr|td|mark)]/g,
	H1_H6_REGX = /\[(\/)?h([1-6])]/g,
	FONT_SIZE_REGX = /\[size=(\d+?)]/g,
	BGCOLOR_REGX = /\[(bg|)color=\#([^\[\<]+?)]/g,
	ALIGN_REGX = /\[align=(left|center|right|justify)\]((.|\s)*?)\[\/align\]/g,
	INS_LINE_REGX = /\[u\](.+?)\[\/u]/g,
	SIMPLE_QUOTE_REGX = /\[quote\]/g,
	QUOTE_REGX = /\[quote=([^\]]+)\]/g,
	FIELDSET_END_REGX = /\[\/(quote|thunder|magnet)\]/g,
	THUNER_LINK_REGX = /\[thunder=([^\]]+)\]([^\[]+)/g,
	MSGNET_LINK_REGX = /\[magnet=([^\]]+)\]([^\[]+)/g
OLD_BOLD_REGX = /\[b(old)?\](.+?)\[\/b(old)?]/g,
	OLD_ITALIC_REGX = /\[i(talic)?\](.+?)\[\/i(talic)?]/g,
	TAIL_EXE_REGX_1 = /\<(\/)?(div|fieldset|tr|pre|table|p|h[1-6]|pre|li|ul|ol)\>\<br( \/)?\>/g,
	TAIL_EXE_REGX_2 = /\<br( \/)?\>\<(\/)?(div|fieldset|tr|table|p|h[1-6]|pre|li|ul|ol)/g;

const BLOCK_OUT_STR = "[$1$2][$3$4",
	SIMPLE_SPAN_TAG_ENDS_STR = '</span>',
	SPAN_TAG_ENDS_STR = '<$1$2>',
	H1_H6_STR = '<$1h$2 class="$1h$2">',
	FONT_SIZE_STR = '<span class="size_$1">',
	BGCOLOR_STR = '<span class="$1color_$2">',
	ALIGN_STR = '<div class="align_$1">$2</div>',
	INS_LINE_STR = '<ins>$1</ins>',
	SIMPLE_QUOTE_STR = '<fieldset class="fieldset"><legend>引用</legend><div>',
	QUOTE_STR = '<fieldset class="fieldset"><legend>$1</legend><div>',
	FIELDSET_END_STR = '</div></fieldset>',
	THUNER_LINK_STR = '<fieldset class="fieldset"><legend>迅雷资源</legend><div><a href="$1" title="$2">$2</a>',
	MSGNET_LINK_STR = '<fieldset class="fieldset"><legend>磁力链接</legend><div><a href="$1" title="$2">$2</a>',
	OLD_BOLD_STR = '<strong>$2</strong>',
	OLD_ITALIC_STR = '<em>$2</em>',
	TAIL_EXE_STR1_1 = "<$1$2>",
	TAIL_EXE_STR1_2 = "<$2$3",
	FONT_REGX_FORMAT_STR = "\\[font=%s\\]";

const commons = module.exports = __webpack_require__(3).create((str) => {

	// 在把 \n 替换为 <br /> 之前把包括 quote 等在内的块层级之间的换行符给去掉
	str = str.replace(BLOCK_REGX, BLOCK_OUT_STR);

	str = replaceFlash(str);
	str = replaceH5Video(str);

	str = str.replace(SIMPLE_SPAN_TAG_ENDS_REGX, SIMPLE_SPAN_TAG_ENDS_STR);
	str = str.replace(SPAN_TAG_ENDS_REGX, SPAN_TAG_ENDS_STR);
	str = str.replace(H1_H6_REGX, H1_H6_STR);
	str = str.replace(FONT_SIZE_REGX, FONT_SIZE_STR);
	str = str.replace(BGCOLOR_REGX, BGCOLOR_STR);

	str = replaceTable(str);

	str = str.replace(ALIGN_REGX, ALIGN_STR);
	str = str.replace(INS_LINE_REGX, INS_LINE_STR);

	str = replaceList(str);
	str = replaceImg(str);
	str = replaceUrl(str);

	str = str.replace(SIMPLE_QUOTE_REGX, SIMPLE_QUOTE_STR);
	str = str.replace(QUOTE_REGX, QUOTE_STR);
	str = str.replace(FIELDSET_END_REGX, FIELDSET_END_STR);
	str = str.replace(THUNER_LINK_REGX, THUNER_LINK_STR);
	str = str.replace(MSGNET_LINK_REGX, MSGNET_LINK_STR);

	// 系统先保留这种写法
	str = str.replace(OLD_BOLD_REGX, OLD_BOLD_STR);
	str = str.replace(OLD_ITALIC_REGX, OLD_ITALIC_STR);

	// 这些处理是为了防止清理的不干净做的尾处理
	str = str.replace(TAIL_EXE_REGX_1, TAIL_EXE_STR1_1); // 去掉标签后的多余换行比如<table><br />
	str = str.replace(TAIL_EXE_REGX_2, TAIL_EXE_STR1_2); // 去掉标签后的多余换行比如<br /><table>;

	return str;
}, {
		object: [
			{
				regexp: /\[pre\]((.|\s)*?)\[\/pre\]/,
				tag: {
					start: "[pre]",
					end: "[/pre]",
					html: "pre"
				}
			},
			{
				regexp: /\[phonics\]((.|\s)*?)\[\/phonics\]/,
				tag: {
					start: '[phonics]',
					end: '[/phonics]',
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
				regexp: /\[code\]((.)*?)\[\/code\]/,
				tag: {
					start: "[code]",
					end: "[/code]"
				}
			},
		}
	});

commons.clear = (str) => {
	str = str.replace(/\[\/(size|color|font|backcolor)\]/g, EMPTY_STRING);
	str = str.replace(/\[(\/)?(sub|flash|sup|underline|i|p|del|b|quote|tucao|magnet|ed2k|thunder)\]/g, EMPTY_STRING);
	str = str.replace(/\[\/align\]/g, EMPTY_STRING);
	str = str.replace(/\[(\/)?h([1-6])\]/g, EMPTY_STRING);
	str = str.replace(/\[align=(left|center|right|justify)\]/g, EMPTY_STRING);
	str = str.replace(/\[size=(\d+?)\]/g, EMPTY_STRING);
	str = str.replace(/\[(color|bgcolor)=\#([^\[\<]+?)\]/g, EMPTY_STRING);
	str = str.replace(/\[font=([^\[\<]+?)\]/g, EMPTY_STRING);
	str = str.replace(/\[list=(a|A|1)\](.+?)\[\/list\]/g, '$2');
	str = str.replace(/\[(\/)?list\]/g, EMPTY_STRING);
	str = str.replace(/\[img(\((left|center|right|justify)\)|)\]([^\[]*)\[\/img\]/g, '$1');
	str = str.replace(/\[url([^\[]*)\]([^\[]+)\[\/url\]/g, '$2');

	return str;
};

/***/ }),
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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./0.0.0": 6,
	"./0.0.0.js": 6,
	"./0.0.1": 8,
	"./0.0.1.js": 8,
	"./plugin": 7,
	"./plugin.js": 7
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 5;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

﻿/**
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
var isNumber = Number.isNumber,
	formatFileSize = Coralian.Formatter.formatFileSize;
let getPlugIn = __webpack_require__(7);

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
	// 最后的转义出处理
	try {
		str = decodeURIComponent(str);
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
		var ed2ks = str.slice(start + 6, end).split('<br />');
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
			str = str.replace(regExp, '<img src="/res/flies/face/' + (100 + i) + '.gif" title="' + name +
				'" />');
		}
	}

	return str;

}

// 从名称到代码
var FONT_NAMES = {
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

var FACE_NAME = ['黑线', '怒', '眼泪', '炸毛', '蛋定', '微笑', '汗', '囧', '卧槽', '坏笑', '鼻血', '大姨妈', '瞪眼', '你说啥', '一脸血', '害羞',
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
			REP_TD = /\<td\>\n\<\/td\>/g;
		VERTICAL_BAR = /\|/g;

		const TR_JOIN = "</tr><tr>",
			TD_JOIN = "</td><td>",
			TABLE_START = '<table class="table"><tr>',
			TABLE_END = '</tr></table>';

		return function (input) {

			while ((matches = input.match(TABLE_REGEX)) !== null) {
				let part = matches[0];
				let output = part.replace(VERTICAL_BAR, TD_JOIN);
				output = output.replace(REP_TD, TR_JOIN);
				output = TABLE_START + output.slice(5, output.length - 5) + TABLE_END;

				input = input.replace(part, output);
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

	var ES_REGEXP = /\\(.)/;
	var P_NEWLINE = /\n{2,}/,
		P_NEWLINE_G = /\n{2,}/g;

	function replaceP(input) {
		if (P_NEWLINE.test(input)) {
			input = input.replace(P_NEWLINE, "<p>");
			if (P_NEWLINE.test(input)) {
				input = input.replace(P_NEWLINE_G, "</p><p>");
			}
			input += "</p>";
		}
		input = input.replace(/\<p\>\<\/p\>/g, '');
		return input;
	}

	function replaceQuote(input) {
		while (/\n&gt;( (.|\s)*?|)\n((.|\s)*?)(\n{2}|$)/.test(input)) {
			var legend = RegExp.$1 || '引用';
			var txt = RegExp.$3;
			var inner = '\n&gt;' + RegExp.$1 + '\n' + txt + RegExp.$5;
			var outs = '<fieldset class="fieldset"><legend>' + String.trim(legend) + '</legend>' + txt + '</fieldset>';
			input = input.replace(inner, outs);
		}
		return input;
	}

	function replaceColor(input) {
		while (/\[#([0-9,A-F]{6})\|((.|\s)*?)\]/i.test(input)) {
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
	 * #(url | txt | title | target)
	 *
	 * @param {Object} input
	 */
	function replaceLink(input) {
		while (/#\(((.|\s)*?)\)/.test(input)) {
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
	 *  $(url, title, width, height)
	 *
	 * @param {Object} input
	 */
	function replaceImg(input) {
		while (/\$\(((.|\s)*?)\)/.test(input)) {
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

	function replaceSimpleLineCode() {

		var lineCodes = [];

		return {
			before: function (input) {
				while (/`((.)*?)`/.test(input)) {
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

	return {

		toHTML: function (str) {

			let plugIns = getPlugIn();

			if (plugIns) {
				Object.forEach(plugIns, function (i, obj) {
					str = obj.before(str);
				});
			}

			str = str.replace(/</g, '&lt;');
			str = str.replace(/>/g, '&gt;');

			str = this.parse(str);
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
		parse: function (input) {

			var es = replaceEscapeSequence(); // 转义符号
			var slc = replaceSimpleLineCode();
			input = slc.before(input);
			input = es.before(input);

			input = input.replace(/\/\*((.|\s)*?)\*\//g, ''); // 去掉注释
			input = input.replace(/\/((.|\s){1,})\//g, "<em>$1</em>"); // 斜体字
			input = replaceQuote(input); // 引用
			input = input.replace(/!((.|\s)*?)!/g, "<strong>$1</strong>"); // 粗体字
			input = input.replace(/\[\-:((.|\s)*?)\]/g, "<input type=checkbox name=$1 />"); // 未选中复选框
			input = input.replace(/\[\+:((.|\s)*?)\]/g, "<input type=checkbox checked=checked name=$1 />"); // 选中的复选框
			input = input.replace(/-((.|\s)*?)-/g, "<del>$1</del>"); // 删除线
			input = input.replace(/_((.|\s)*?)_/g, "<ins>$1</ins>"); // 下划线
			input = replaceList(input); // 列表
			input = replaceTable(input); // 表格

			input = input.replace(/\n&gt;&gt;((.|\s)+)&lt;&lt;\n/g, '<div class="align_center">$1</div>'); // 居中对齐
			input = input.replace(/\n\|\:((.|\s)+)&lt;&lt;\n/g, '<div align="align_left">$1</div>'); // 左对齐
			input = input.replace(/\n&gt;&gt;((.|\s)+)\:\|\n/g, '<div align="align_right">$1</div>'); // 右对齐

			input = replacePhonics(input, /\{\{((.|\s)*?)\}\}/, "{{", "}}"); // 注音
			input = input.replace(/\?\(([1-9]([0-9]?)):((.|\s)*?)\)/, '<span class="size_$1">$3</span>'); // 字号

			input = replaceColor(input); // 颜色
			input = replaceLink(input); // 链接
			input = replaceImg(input); // 图像

			input = input.replace(/###### (.*?)(\n|$)/g, "<h6 class=\"h6\">$1</h6>"); // 六级标题
			input = input.replace(/##### (.*?)(\n|$)/g, "<h5 class=\"h5\">$1</h5>"); // 五级标题
			input = input.replace(/#### (.*?)(\n|$)/g, "<h4 class=\"h4\">$1</h4>"); // 四级标题
			input = input.replace(/### (.*?)(\n|$)/g, "<h3 class=\"h3\">$1</h3>"); // 三级标题
			input = input.replace(/## (.*?)(\n|$)/g, "<h2 class=\"h2\">$1</h2>"); // 二级标题
			input = input.replace(/# (.*?)(\n|$)/g, "<h1 class=\"h1\">$1</h1>"); // 一级标题

			var pre = replacePre(preArg); // 预定义格式
			input = pre.before(input);

			input = replaceP(input); // 段落

			input = input.replace(/\n/g, "<br />"); // 单行换行
			input = pre.after(input);

			input = es.after(input);
			input = slc.after(input);

			return input;
		},
		clear: function (str) {
			return str;
		}
	}

}

module.exports = hitOn();

/***/ }),
/* 7 */
/***/ (function(module, exports) {


let highLighter = FlyHighLighter.execute;

var CodeRegExp = {
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

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {


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

	let links = [];

	return {
		before: input => {
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

				input = input.replace("#(" + inner + ")", `{links~${links.length}}`);
				links.push(outs);
			}
			return input;
		},
		after: input => {
			Array.forEach(links, (i, e) => {
				input = input.replace(`{links~${i}}`, e);
			})
			return input;
		}
	}
}

/**
 *  $(url|title|width|height)
 *
 * @param {Object} input
 */
const IMG_TAG_REGX = /\$\(((.|\s)*?)\)/;
function replaceImage(input) {

	let images = [];

	return {
		before: input => {
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

				input = input.replace("$(" + inner + ")", `{images~${images.length}}`);
				images.push(outs);
			}
			return input;
		},
		after: input => {
			Array.forEach(images, (i, e) => {
				input = input.replace(`{images~${i}}`, e);
			})
			return input;
		}
	};
}

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

const ESCAPER_REGX = /\\\//;
function replaceEscapers() {

	let escapes = [];

	return {
		before: input => {

			while ((matches = input.match(ESCAPER_REGX)) !== null) {

				let part = matches[0];
				input = input.replace(part, `{escape~${escapes.length}}`);
				escapes.push(part);
			}

			return input;
		},
		after: input => {

			Array.forEach(escapes, (i, e) => {
				input = input.replace(`{escape~${i}}`, e);
			});

			return input;
		}
	};
}

function replaceAlign() {

	let align = [];

	return {
		before: input => {

			while ((matches = input.match(CENTER_ALIGN_REGX)) !== null) {

				let part = matches[0];
				let str = part.replace(CENTER_ALIGN_REGX, CENTER_ALIGN_STR);
				input = input.replace(part, `{align~${align.length}}`);
				align.push(str);
			}

			while ((matches = input.match(LEFT_ALIGN_REGX)) !== null) {

				let part = matches[0];
				let str = part.replace(LEFT_ALIGN_REGX, LEFT_ALIGN_STR);
				input = input.replace(part, `{align~${align.length}}`);
				align.push(str);
			}

			while ((matches = input.match(RIGHT_ALIGN_REGX)) !== null) {

				let part = matches[0];
				let str = part.replace(RIGHT_ALIGN_REGX, RIGHT_ALIGN_STR);
				input = input.replace(part, `{align~${align.length}}`);
				align.push(str);
			}

			return input;
		},
		after: input => {

			Array.forEach(align, (i, e) => {
				input = input.replace(`{align~${i}}`, e);
			});

			return input;
		}
	};
}

const COMMENT_REGX = /\/\*((.|\s)*?)\*\//g,
	ITALIC_REGX = /\/((.|\s){1,})\//g,
	BOLD_REGX = /!((.|\s)*?)!/g,
	DEL_LINE_REGX = /-((.|\s)*?)-/g,
	INS_LINE_REGX = /_((.|\s)*?)_/g,
	CENTER_ALIGN_REGX = /\n>>((.|\s)+?)<<\n/,
	LEFT_ALIGN_REGX = /\n\|\:((.|\s)+?)<<\n/,
	RIGHT_ALIGN_REGX = /\n>>((.|\s)+?)\:\|\n/,
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

module.exports = commons = __webpack_require__(3).create((input) => {

	input = input.replace(COMMENT_REGX, String.BLANK); // 去掉注释

	let link = replaceLink(); // 连接
	let image = replaceImage(); // 图像
	let align = replaceAlign(); // 对齐
	let escape = replaceEscapers(); // 转义字符

	input = link.before(input);
	input = image.before(input);
	input = escape.before(input);
	input = align.before(input);

	input = input.replace(ITALIC_REGX, ITALIC_STR); // 斜体字
	input = input.replace(INS_LINE_REGX, INS_LINE_STR); // 下划线

	input = align.after(input);
	input = escape.after(input);
	input = image.after(input);
	input = link.after(input);

	input = replaceQuote(input); // 引用
	input = input.replace(BOLD_REGX, BOLD_STR); // 粗体字
	input = input.replace(DEL_LINE_REGX, DEL_LINE_STR); // 删除线
	input = replaceList(input); // 列表
	input = replaceTable(input); // 表格

	input = input.replace(FONT_SIZE_REGX, FONT_SIZE_STR); // 字号

	input = replaceColor(input); // 颜色

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
		object : [
			{
				regexp: /\[\[((.|\s)*?)\]\]/,
				tag: {
					start: "[[",
					end: "]]",
					html: "pre"
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