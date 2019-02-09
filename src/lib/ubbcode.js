
let EMPTY_STRING = String.BLANK;
let isNumber = Number.isNumber,
	formatFileSize = Coralian.Formatter.formatFileSize;

let replaceImg = (function () {

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

let replaceList = function () {

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

let replaceH5Video = (function () {

	let h5VMap = {
		bilibili: function (id, page) {
			page = page || 1;
			return '<iframe class="h5video" src="https://www.bilibili.com/blackboard/player.html?aid=' + id.replace("av", '') +
				//'&page=' + page + 
				'" scrolling="no" border="0" framespacing="0" frameborder="no"></iframe>';
		},
		youku: function (id) {
			return '<iframe  class="h5video" src="http://player.youku.com/embed/' + id + '" frameborder="no"></iframe>'
		}
	};
	const REGEX_H5VIDEO = /\[h5v=([^\]]+)]([^\]]+)\[\/h5v\]/;
	const H5_FORMAT = "[h5v=%1]%2%3[/h5v]";

	function __replace(str, input, name, id, page) {

		let output = h5VMap[name](id, page);

		if (page) {
			page = "," + page;
		}

		input = input.replace("%1", name);
		input = input.replace("%2", id);
		input = input.replace("%3", page);

		return str.replace(input, output);
	}

	return function (str) {

		if (arguments.length === 1) {

			while ((matched = str.match(REGEX_H5VIDEO)) !== null) {
				let name = matched[1];
				let value = matched[2].split(",");
				let id = value[0];
				let page = value[1] || '';

				str = __replace(str, H5_FORMAT, name, id, page);
			}
		} else {
			// 这里是留给原FLASH格式的接口
			str = __replace(str, arguments[1], arguments[2], arguments[3], arguments[4] || '');

		}
		return str;
	}
})();

const BILIBILI_FLASH_REGEX = /\[flash=bilibili]([^\[]+)\.swf\?aid=([^\[]+)\[\/flash]/,
	NORMAL_FLASH_REGEX = /\[flash]([^\[]+)\[\/flash]/;

const NORMAL_FLASH_STR = '<embed src="$1" allowFullScreen="true" name="movie" value="opaque" width="634" height="440" type="application/x-shockwave-flash" />',
	YOUKU_STR = 'youku',
	BILIBILI_STR = 'bilibili';

function replaceFlash(str) {

	// 将FLASH全部替换为H5播放器
	while ((matched = str.match(BILIBILI_FLASH_REGEX)) !== null) { // B 站
		let url = matched[1];
		let values = matched[2];
		let valArr = values.split("&amp;page=");
		let input = "[flash=bilibili]" + url + ".swf?aid=" + values + "[/flash]";
		str = replaceH5Video(str, input, BILIBILI_STR, valArr[0], valArr[1]);
	}

	while ((matched = str.match(NORMAL_FLASH_REGEX)) !== null) {
		let url = matched[1];
		let input = '[flash]' + url + '[/flash]'
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

const BUILT_IN_OBJS = [
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
				to: "<rp>(</rp> <rt>"
			},
			end: {
				from: /\)/g,
				to: "</rt><rp>)</rp>"
			}
		}
	}
]

module.exports = commons = require("./commons").create((str) => {

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
		object: BUILT_IN_OBJS,
		aspect: {
			simpleLineCode: {
				regexp : /\[code\]((.)*?)\[\/code\]/,
				tag : {
					start : "[code]",
					end : "[/code]"
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