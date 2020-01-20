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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/hiton.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/hiton.js":
/*!**********************!*\
  !*** ./src/hiton.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/**\r\n * HitOn 单独出来的入口文件\r\n * 但因为仅仅包含 HitOn 的语法，所以没有任何插件（或者说只有语言支持的最基础功能）\r\n */\r\n\r\nCoralian.setToGlobal(\"HitOn\", __webpack_require__(/*! ./lib/HitOn */ \"./src/lib/HitOn/index.js\"));\n\n//# sourceURL=webpack:///./src/hiton.js?");

/***/ }),

/***/ "./src/lib/HitOn/index.js":
/*!********************************!*\
  !*** ./src/lib/HitOn/index.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\r\nconst { AspectBase, parseEqualToObject, compireH5Video, compireH5Audio } = __webpack_require__(/*! ./../util */ \"./src/lib/util.js\");\r\nconst MAIN_QUOT_REGX = /\\n(\\n(>(.*)\\n)+)/,\r\n\tNL_RT_ANGLE_GLOBAL_REGX = /\\n>/g;\r\nconst STRING_QUOTE = \"引用\";\r\n\r\nfunction replaceQuote(input) {\r\n\r\n\twhile (MAIN_QUOT_REGX.test(input)) { // 获取>列表行，从 \\n> 开始 到 >\\n 结束，中间每行都以 > 开头 \\n 结束\r\n\t\tlet protoQuotTxt = RegExp.$1;\r\n\t\tlet quotTxt = protoQuotTxt.replace(NL_RT_ANGLE_GLOBAL_REGX, \"\\n\"); // 去掉每行开头的 >(&gt;)\r\n\t\tquotTxt = quotTxt.slice(1); // 去掉第一行的换行符\r\n\t\tlet indexNL = quotTxt.indexOf(\"\\n\");\r\n\r\n\t\tlet quotTtlLn = quotTxt.slice(0, indexNL);\r\n\t\tlet hasQuotTtl = String.startsWith(quotTtlLn, \"(\") && String.endsWith(quotTtlLn, \")\");\r\n\r\n\t\tlet legend = hasQuotTtl ? quotTtlLn.slice(1, quotTtlLn.length - 1) : STRING_QUOTE;\r\n\t\tlet outTxt = hasQuotTtl ? quotTxt.slice(indexNL + 1) : quotTxt;\r\n\r\n\t\toutTxt = replaceQuote(outTxt); // 递归查找看是否有多重引用\r\n\r\n\t\tinput = input.replace(MAIN_QUOT_REGX, `<fieldset><legend>${legend}</legend>${outTxt}</fieldset>`);\r\n\t}\r\n\r\n\treturn input;\r\n}\r\n\r\nconst replaceList = (function () {\r\n\r\n\tconst UL_REGEX = /(\\*+\\. (.)+\\n)+/,\r\n\t\tOL_1_REGEX = /([0-9]+\\. (.)+\\n)+/,\r\n\t\tOL_A_REGEX = /([a-z]+\\. (.)+\\n)+/,\r\n\t\tTYPE_1_LI_START = /[0-9]+\\. /g,\r\n\t\tTYPE_A_LI_START = /[a-z]+\\. /g,\r\n\t\tUL_LI_START = /\\*+\\. /g,\r\n\t\tLI_END = /\\n/g;\r\n\r\n\tconst LI_START_TAG = \"<li>\",\r\n\t\tLI_END_TAG = \"</li>\",\r\n\t\tUL_START_TAG = \"<ul>\",\r\n\t\tUL_END_TAG = \"</ul>\",\r\n\t\tOL_START_TYPE_1_TAG = '<ol class=\"list_type_1\">',\r\n\t\tOL_START_TYPE_A_TAG = '<ol class=\"list_type_a\">',\r\n\t\tOL_END_TAG = \"</ol>\";\r\n\r\n\tfunction replace(input, part, liStart, startTag, endTag) {\r\n\r\n\t\tvar output = part.replace(liStart, LI_START_TAG);\r\n\t\toutput = output.replace(LI_END, LI_END_TAG);\r\n\r\n\t\treturn input.replace(part, startTag + output + endTag);\r\n\t}\r\n\r\n\treturn function (input) {\r\n\r\n\t\t// ul\r\n\t\twhile ((matches = input.match(UL_REGEX)) !== null) {\r\n\t\t\tinput = replace(input, matches[0], UL_LI_START, UL_START_TAG, UL_END_TAG);\r\n\t\t}\r\n\t\t// ol -1\r\n\t\twhile ((matches = input.match(OL_1_REGEX)) !== null) {\r\n\t\t\tinput = replace(input, matches[0], TYPE_1_LI_START, OL_START_TYPE_1_TAG, OL_END_TAG);\r\n\t\t}\r\n\t\t// ol -a\r\n\t\twhile ((matches = input.match(OL_A_REGEX)) !== null) {\r\n\t\t\tinput = replace(input, matches[0], TYPE_A_LI_START, OL_START_TYPE_A_TAG, OL_END_TAG);\r\n\t\t}\r\n\r\n\t\treturn input;\r\n\t};\r\n})();\r\n\r\nconst COLOR_TAG_REGX = /\\[#([0-9,A-F]{6})\\|((.|\\s)*?)\\]/i;\r\nfunction replaceColor(input) {\r\n\twhile (COLOR_TAG_REGX.test(input)) {\r\n\t\tvar color = RegExp.$1,\r\n\t\t\tinner = RegExp.$2,\r\n\t\t\touts;\r\n\t\tvar splits = inner.split(\"|\");\r\n\t\tif (splits.length === 2) {\r\n\t\t\touts = '<span class=\"' + splits[0] + \"_\" + color + '\">' + splits[1] + '</span>';\r\n\t\t} else {\r\n\t\t\touts = '<span class=\"color_' + color + '\">' + splits[0] + '</span>';\r\n\t\t}\r\n\t\tinput = input.replace(\"[#\" + color + \"|\" + inner + \"]\", outs);\r\n\t}\r\n\treturn input;\r\n}\r\n\r\nconst LINK_REGX = /\\[(#|@|\\$|V|A)\\]\\(((.|\\s)*?)\\)/;\r\nfunction replaceSrcLinks() {\r\n\r\n\tlet links = AspectBase('links');\r\n\tlinks.before = input => {\r\n\t\twhile (LINK_REGX.test(input)) {\r\n\t\t\tlet tag = RegExp.$1;\r\n\t\t\tlet value = RegExp.$2;\r\n\r\n\t\t\tlet output = ReplaceHolder[tag](value);\r\n\r\n\t\t\tinput = links.replace(input, `[${tag}](${value})`, output);\r\n\t\t}\r\n\t\treturn input;\r\n\t};\r\n\r\n\treturn links;\r\n}\r\n\r\nconst ReplaceHolder = {\r\n\t'#': (input) => { // 链接 [#](url|txt|title|target)\r\n\r\n\t\tlet splits = input.split(\"|\");\r\n\t\tlet url = splits[0];\r\n\t\tlet txt = commonReplace(splits[1]) || url;\r\n\t\tlet title = (splits.length === 4 ? (splits[2] || url) : url);\r\n\t\tlet target = splits[splits.length === 4 ? 3 : 2];\r\n\r\n\t\tif (!target || target === 'new') { // 目标在新页面中打开，或者写 new 的时候也在新页面打开\r\n\t\t\ttarget = 'blank';\r\n\t\t}\r\n\r\n\t\treturn `<a href=\"${url}\" title=\"${title}\" target=\"_${target}\">${txt}</a>`;\r\n\t},\r\n\t\"@\": (input) => { // 邮件 [@](url|title)\r\n\t\tlet splits = input.split(\"|\");\r\n\t\tlet url = splits[0];\r\n\t\tlet title = splits[1] || url;\r\n\r\n\t\treturn `<a href=\"mailto:${url}\">${title}</a>`;\r\n\t},\r\n\t\"$\": (input) => { // 图像 [$](url|title|width|height)\r\n\r\n\t\tlet splits = input.split(\"|\");\r\n\r\n\t\tlet str = splits[0];\r\n\t\tlet title = splits[1] || str;\r\n\r\n\t\tlet outs = `<img src=\"${str}\" title=\"${title}\"`;\r\n\r\n\t\tif (splits[2]) {\r\n\t\t\touts += ' width=\"' + splits[2] + '\"';\r\n\t\t}\r\n\t\tif (splits[3]) {\r\n\t\t\touts += ' height=\"' + splits[3] + '\"';\r\n\t\t}\r\n\t\touts += ' onload=\"styles.Image.resize(this)\" onclick=\"styles.Image.protoSize(this)\" />';\r\n\r\n\t\treturn outs;\r\n\t},\r\n\t\"V\": (input) => { // 视频 [V](url)\r\n\r\n\t\tlet inputArr = input.split(\"|\");\r\n\t\tlet url = inputArr.shift();\r\n\t\tlet args = {};\r\n\r\n\t\tparseEqualToObject(inputArr, args);\r\n\r\n\t\treturn compireH5Video(url, args);\r\n\t},\r\n\t\"A\": (input) => { // 音频 [A](url)\r\n\t\treturn compireH5Audio(input);\r\n\t}\r\n};\r\n\r\nconst TABLE_REGEX = /(\\|(.)+\\|\\n)+/,\r\n\tVERTICAL_BAR = /\\|/g;\r\nconst TR_JOIN = \"</tr><tr>\",\r\n\tTD_JOIN = \"</td><td>\",\r\n\tTD_START = \"<td>\",\r\n\tTD_END = \"</td>\",\r\n\tTABLE_START = '<table class=\"table\"><tr>',\r\n\tTABLE_END = '</tr></table>';\r\nfunction replaceTable(input) {\r\n\r\n\twhile ((matches = input.match(TABLE_REGEX)) !== null) {\r\n\t\tlet part = matches[0]\r\n\t\tlet output = [];\r\n\r\n\t\tArray.forEach(part.split(\"\\n\"), function (i, line) {\r\n\t\t\tif (i === 1) return;\r\n\t\t\tif (String.isEmpty(line)) return;\r\n\t\t\tline = line.slice(1, line.length - 1); // 去掉最开始和最后的 |\r\n\t\t\toutput.push(TD_START + line.replace(VERTICAL_BAR, TD_JOIN) + TD_END);\r\n\t\t});\r\n\r\n\t\tlet table = TABLE_START + output.join(TR_JOIN) + TABLE_END;\r\n\r\n\t\tinput = input.replace(part, table);\r\n\t}\r\n\r\n\treturn input;\r\n}\r\n\r\nconst REFERENCE_REGX = /\\[\\^((\\S)+)?\\]/;\r\nfunction replaceReference(input) {\r\n\r\n\tlet tags = new Set(), index = 1;\r\n\r\n\twhile ((matches = input.match(REFERENCE_REGX)) !== null) {\r\n\r\n\t\tlet part = matches[0];\r\n\t\tlet tag = matches[1];\r\n\r\n\t\tif (!tags.has(part)) { // 没有出现过\r\n\t\t\ttags.add(part);\r\n\t\t\tlet html = `<sup id=\"f_${tag}\"><a href=\"#l_${tag}\">${tags.size}</a></sup> `;\r\n\t\t\tinput = input.replace(REFERENCE_REGX, html);\r\n\t\t} else { // 已经记载\r\n\t\t\tlet html = `<a id=\"l_${tag}\" href=\"#f_${tag}\">^</a> ${index}: `;\r\n\t\t\tinput = input.replace(REFERENCE_REGX, html);\r\n\t\t\tindex++;\r\n\t\t}\r\n\t}\r\n\r\n\treturn input;\r\n}\r\n\r\nconst ESCAPER_REGX = /\\\\\\//;\r\nfunction replaceEscapers() {\r\n\r\n\tlet escapes = AspectBase('escapes');\r\n\tescapes.before = input => {\r\n\t\twhile ((matches = input.match(ESCAPER_REGX)) !== null) {\r\n\t\t\tinput = escapes.replace(input, matches[0], part);\r\n\t\t}\r\n\r\n\t\treturn input;\r\n\t}\r\n\treturn escapes;\r\n}\r\n\r\nfunction replaceAlign() {\r\n\r\n\tlet align = AspectBase('align');\r\n\r\n\talign.before = input => {\r\n\t\twhile ((matches = input.match(CENTER_ALIGN_REGX)) !== null) {\r\n\r\n\t\t\tlet part = commonReplace(matches[0]);\r\n\t\t\tlet str = part.replace(CENTER_ALIGN_REGX, CENTER_ALIGN_STR);\r\n\t\t\tinput = align.replace(input, part, str);\r\n\t\t}\r\n\r\n\t\twhile ((matches = input.match(LEFT_ALIGN_REGX)) !== null) {\r\n\r\n\t\t\tlet part = commonReplace(matches[0]);\r\n\t\t\tlet str = part.replace(LEFT_ALIGN_REGX, LEFT_ALIGN_STR);\r\n\t\t\tinput = align.replace(input, part, str);\r\n\t\t}\r\n\r\n\t\twhile ((matches = input.match(RIGHT_ALIGN_REGX)) !== null) {\r\n\r\n\t\t\tlet part = commonReplace(matches[0]);\r\n\t\t\tlet str = part.replace(RIGHT_ALIGN_REGX, RIGHT_ALIGN_STR);\r\n\t\t\tinput = align.replace(input, part, str);\r\n\t\t}\r\n\r\n\t\treturn input;\r\n\t};\r\n\r\n\treturn align;\r\n}\r\n\r\nconst COMMENT_REGX = /\\/\\*((.|\\s)*?)\\*\\//g,\r\n\tITALIC_REGX = /\\/((.|\\s){1,})\\//g,\r\n\tBOLD_REGX = /!((.|\\s)*?)!/g,\r\n\tDEL_LINE_REGX = /-((.|\\s)*?)-/g,\r\n\tINS_LINE_REGX = /_((.|\\s)*?)_/g,\r\n\tCENTER_ALIGN_REGX = /\\n>>((.|\\s)+?)<<\\n/,\r\n\tLEFT_ALIGN_REGX = /\\n\\|\\:((.|\\s)+?)<<\\n/,\r\n\tRIGHT_ALIGN_REGX = /\\n>>((.|\\s)+?)\\:\\|\\n/,\r\n\tFONT_SIZE_REGX = /\\?\\(([1-9]([0-9]?)):((.|\\s)*?)\\)/,\r\n\tH6_REGX = /###### (.*?)(\\n|$)/g,\r\n\tH5_REGX = /##### (.*?)(\\n|$)/g,\r\n\tH4_REGX = /#### (.*?)(\\n|$)/g,\r\n\tH3_REGX = /### (.*?)(\\n|$)/g,\r\n\tH2_REGX = /## (.*?)(\\n|$)/g,\r\n\tH1_REGX = /# (.*?)(\\n|$)/g;\r\n\r\nconst ITALIC_STR = \"<em>$1</em>\",\r\n\tBOLD_STR = \"<strong>$1</strong>\",\r\n\tDEL_LINE_STR = \"<del>$1</del>\",\r\n\tINS_LINE_STR = \"<ins>$1</ins>\",\r\n\tCENTER_ALIGN_STR = '<div class=\"align_center\">$1</div>',\r\n\tLEFT_ALIGN_STR = '<div class=\"align_left\">$1</div>',\r\n\tRIGHT_ALIGN_STR = '<div class=\"align_right\">$1</div>',\r\n\tFONT_SIZE_STR = '<span class=\"size_$1\">$3</span>',\r\n\tH6_STR = \"<h1 class=\\\"h6\\\">$1</h1>\",\r\n\tH5_STR = \"<h1 class=\\\"h5\\\">$1</h1>\",\r\n\tH4_STR = \"<h1 class=\\\"h4\\\">$1</h1>\",\r\n\tH3_STR = \"<h1 class=\\\"h3\\\">$1</h1>\",\r\n\tH2_STR = \"<h1 class=\\\"h2\\\">$1</h1>\",\r\n\tH1_STR = \"<h1 class=\\\"h1\\\">$1</h1>\";\r\n\r\n/**\r\n * 这里的替换在任何位置都可以用到，比如：\r\n * 链接中的文字\r\n * 对齐的文字\r\n */\r\nfunction commonReplace(input) {\r\n\r\n\tif (!input) return input;\r\n\r\n\tinput = input.replace(ITALIC_REGX, ITALIC_STR); // 斜体字\r\n\tinput = input.replace(INS_LINE_REGX, INS_LINE_STR); // 下划线\r\n\tinput = input.replace(BOLD_REGX, BOLD_STR); // 粗体字\r\n\tinput = input.replace(DEL_LINE_REGX, DEL_LINE_STR); // 删除线\r\n\tinput = input.replace(FONT_SIZE_REGX, FONT_SIZE_STR); // 字号\r\n\tinput = replaceColor(input); // 颜色\r\n\r\n\treturn input;\r\n}\r\n\r\nconst commons = module.exports = __webpack_require__(/*! ./../commons */ \"./src/lib/commons.js\").create((input) => {\r\n\r\n\tinput = input.replace(COMMENT_REGX, String.BLANK); // 去掉注释\r\n\r\n\tlet link = replaceSrcLinks(); // 外部连接\r\n\tlet align = replaceAlign(); // 对齐\r\n\tlet escape = replaceEscapers(); // 转义字符\r\n\r\n\tinput = link.before(input);\r\n\tinput = escape.before(input);\r\n\tinput = align.before(input);\r\n\r\n\tinput = commonReplace(input); // 调用公共替换\r\n\r\n\tinput = replaceQuote(input); // 引用\r\n\tinput = replaceList(input); // 列表\r\n\tinput = replaceTable(input); // 表格\r\n\r\n\tinput = replaceReference(input); // 参考链接\r\n\r\n\tinput = input.replace(H6_REGX, H6_STR); // 六级标题\r\n\tinput = input.replace(H5_REGX, H5_STR); // 五级标题\r\n\tinput = input.replace(H4_REGX, H4_STR); // 四级标题\r\n\tinput = input.replace(H3_REGX, H3_STR); // 三级标题\r\n\tinput = input.replace(H2_REGX, H2_STR); // 二级标题\r\n\tinput = input.replace(H1_REGX, H1_STR); // 一级标题\r\n\r\n\tinput = align.after(input);\r\n\tinput = escape.after(input);\r\n\tinput = link.after(input);\r\n\r\n\t// 整个文本中，到处都有需要换行处理的地方，而且换行直接<br /> 更符合我自己的习惯，所以段落处理不再实现\r\n\t//input = replaceP(input); // 段落\r\n\r\n\treturn input;\r\n}, {\r\n\tobject: [\r\n\t\t// 引用\r\n\t\t{\r\n\t\t\tregexp: /\\[\\[((.|\\s)*?)\\]\\]/,\r\n\t\t\ttag: {\r\n\t\t\t\tstart: \"[[\",\r\n\t\t\t\tend: \"]]\",\r\n\t\t\t\thtml: \"pre\",\r\n\t\t\t\tattrs: {\r\n\t\t\t\t\t'class': 'pre'\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t},\r\n\t\t// 注音\r\n\t\t{\r\n\t\t\tregexp: /{{((.|\\s)*?)}}/,\r\n\t\t\ttag: {\r\n\t\t\t\tstart: '{{',\r\n\t\t\t\tend: '}}',\r\n\t\t\t\thtml: 'ruby'\r\n\t\t\t},\r\n\t\t\treplace: [\r\n\t\t\t\t{\r\n\t\t\t\t\tfrom: /\\(/g,\r\n\t\t\t\t\tto: \"<rp>(</rp><rt>\"\r\n\t\t\t\t},\r\n\t\t\t\t{\r\n\t\t\t\t\tfrom: /\\)/g,\r\n\t\t\t\t\tto: \"</rt><rp>)</rp>\"\r\n\t\t\t\t}\r\n\t\t\t]\r\n\t\t}\r\n\t],\r\n\taspect: {\r\n\t\tsimpleLineCode: {\r\n\t\t\tregexp: /`([^`]+?)`/,\r\n\t\t\ttag: {\r\n\t\t\t\tstart: \"`\",\r\n\t\t\t\tend: \"`\"\r\n\t\t\t}\r\n\t\t},\r\n\t\tescapeSequence: /\\\\(\\S)/\r\n\t}\r\n});\r\n\r\n/*\r\n * 目前不实现清除样式\r\n */\r\ncommons.clear = (str) => {\r\n\treturn str;\r\n};\n\n//# sourceURL=webpack:///./src/lib/HitOn/index.js?");

/***/ }),

/***/ "./src/lib/commons.js":
/*!****************************!*\
  !*** ./src/lib/commons.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("\r\nconst { AspectBase, decodeHtmlTag } = __webpack_require__(/*! ./util */ \"./src/lib/util.js\");\r\n\r\nconst BR_TAG = \"<br />\";\r\nconst NL_REGX = /\\n/g;\r\nconst PRE_TAG = Coralian.constants.HtmlTag.PRE;\r\n\r\nfunction replaceObjects(str, arg) {\r\n\r\n\twhile ((matched = str.match(arg.regexp)) !== null) {\r\n\r\n\t\tlet htmlTag = arg.tag.html;\r\n\t\tlet attrs = util.compireObjectToXmlAtruibute(arg.tag.attrs);\r\n\t\tlet inner = matched[1];\r\n\t\tlet input = arg.tag.start + inner + arg.tag.end;\r\n\t\tif (htmlTag === PRE_TAG) {\r\n\t\t\tinner = inner.replace(\"<\", \"&lt;\"); // 所有预定义标签中的HTML标签都无效化处理\r\n\t\t\tinner = inner.replace(\">\", \"&gt;\");\r\n\t\t}\r\n\r\n\t\tif (arg.replace) { // 内部还有切换需求的时候进行处理\r\n\t\t\tArray.forEach(arg.replace, (i, item) => {\r\n\t\t\t\tinner = inner.replace(item.from, item.to);\r\n\t\t\t});\r\n\t\t}\r\n\r\n\t\tlet output = `<${htmlTag}${attrs}>${inner}</${htmlTag}>`;\r\n\r\n\t\tstr = str.replace(input, output);\r\n\t}\r\n\r\n\treturn str;\r\n}\r\n\r\nconst BUILT_IN_ASPECTS = {\r\n\tsimpleLineCode: (arg) => {\r\n\r\n\t\tlet lineCode = AspectBase('linecode');\r\n\t\tlineCode.before = input => {\r\n\t\t\twhile (arg.regexp.test(input)) {\r\n\t\t\t\tlet obj = RegExp.$1\r\n\t\t\t\tlet deHtmlObj = decodeHtmlTag(obj);// 去掉 HTML 结构\r\n\t\t\t\tlet part = arg.tag.start + obj + arg.tag.end;\r\n\t\t\t\tlet output = `<code class=\"code\">${deHtmlObj}</code>`;\r\n\t\t\t\tinput = lineCode.replace(input, part, output);\r\n\t\t\t}\r\n\t\t\treturn input;\r\n\t\t};\r\n\r\n\t\treturn lineCode;\r\n\t},\r\n\tescapeSequence: (arg) => {\r\n\r\n\t\tlet backSlash = AspectBase('backslash');\r\n\t\tbackSlash.before = input => {\r\n\t\t\twhile (arg.test(input)) {\r\n\t\t\t\tlet output = RegExp.$1;\r\n\t\t\t\tinput = backSlash.replace(input, arg, output);\r\n\t\t\t}\r\n\t\t\treturn input;\r\n\t\t};\r\n\r\n\t\treturn backSlash;\r\n\t}\r\n};\r\n\r\nmodule.exports = {\r\n\tcreate: (parse, arg) => {\r\n\r\n\t\tfunction replaceURI(str) {\r\n\r\n\t\t\ttry {\r\n\t\t\t\treturn decodeURIComponent(str);// 最后的转义出处理\r\n\t\t\t} catch (e) {\r\n\t\t\t\t// 如果出错，就当不存在\r\n\t\t\t\treturn str;\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\treturn {\r\n\t\t\ttoHTML: (str, plugIns) => {\r\n\r\n\t\t\t\tlet { queue, aspect, object } = plugIns || {};\r\n\t\t\t\tlet aspects = [];\r\n\r\n\t\t\t\tif (aspect) { // 定制插片前处理\r\n\t\t\t\t\tArray.forEach(aspect, (i, a) => {\r\n\t\t\t\t\t\tlet aspect = a.method(a.object);\r\n\t\t\t\t\t\tstr = aspect.before(str);\r\n\t\t\t\t\t\taspects.push(aspect);\r\n\t\t\t\t\t});\r\n\t\t\t\t}\r\n\t\t\t\tif (arg.aspect) { // 内置插片前处理\r\n\t\t\t\t\tObject.forEach(arg.aspect, (n, o) => {\r\n\t\t\t\t\t\tlet aspect = BUILT_IN_ASPECTS[n](o);\r\n\t\t\t\t\t\tif (aspect) {\r\n\t\t\t\t\t\t\tstr = aspect.before(str);\r\n\t\t\t\t\t\t\taspects.push(aspect);\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t});\r\n\t\t\t\t}\r\n\r\n\t\t\t\tstr = parse(str);\r\n\r\n\t\t\t\tif (arg.object) { // 内置对象处理\r\n\t\t\t\t\tArray.forEach(arg.object, (i, o) => {\r\n\t\t\t\t\t\tstr = replaceObjects(str, o);\r\n\t\t\t\t\t});\r\n\t\t\t\t}\r\n\t\t\t\tif (object) { // 定制对象处理\r\n\t\t\t\t\tArray.forEach(object, (i, o) => {\r\n\t\t\t\t\t\tstr = replaceObjects(str, o);\r\n\t\t\t\t\t});\r\n\t\t\t\t}\r\n\r\n\t\t\t\t// 插片后处理\r\n\t\t\t\tArray.forEach(aspects, (i, a) => {\r\n\t\t\t\t\tstr = a.after(str);\r\n\t\t\t\t});\r\n\r\n\t\t\t\tif (arg.queue) { // 内置队列处理\r\n\t\t\t\t\tArray.forEach(arg.queue, (i, obj) => {\r\n\t\t\t\t\t\tstr = obj(str);\r\n\t\t\t\t\t});\r\n\t\t\t\t}\r\n\t\t\t\tif (queue) { // 定制队列处理\r\n\t\t\t\t\tArray.forEach(queue, (i, obj) => {\r\n\t\t\t\t\t\tstr = obj(str);\r\n\t\t\t\t\t});\r\n\t\t\t\t}\r\n\r\n\t\t\t\tstr = str.replace(NL_REGX, BR_TAG); // 单行换行\r\n\r\n\t\t\t\treturn replaceURI(str);\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n};\r\n\n\n//# sourceURL=webpack:///./src/lib/commons.js?");

/***/ }),

/***/ "./src/lib/util.js":
/*!*************************!*\
  !*** ./src/lib/util.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\r\nexports.compireH5Video = (input, args) => {\r\n\r\n\treturn compireH5Object(input, args, 'iframe', 'h5video');\r\n};\r\n\r\nexports.compireH5Audio = (input, args) => {\r\n\treturn input;\r\n}\r\n\r\nfunction compireH5Object(input, args, tag, className) {\r\n\r\n\tlet result = compireObjectToXmlAtruibute(args);\r\n\r\n\treturn `<${tag} class=\"${className}\" src=\"${input}\" ${result}></${tag}>`;\r\n}\r\n\r\nexports.parseEqualToObject = (input, obj) => {\r\n\tfor (let item of input) {\r\n\t\tlet kv = item.split(\"=\");\r\n\t\tobj[kv[0]] = kv[1];\r\n\t}\r\n};\r\n\r\nfunction compireObjectToXmlAtruibute(input) {\r\n\r\n\tlet str = String.BLANK;\r\n\r\n\tfor (let k in input) {\r\n\t\tlet v = input[k];\r\n\t\tstr += ` ${k}=\"${v}\"`;\r\n\t}\r\n\r\n\treturn str;\r\n}\r\n\r\nexports.compireObjectToXmlAtruibute = compireObjectToXmlAtruibute;\r\n\r\n/*\r\n * 这是插片（aspbect）的基类，有三个方法组成，\r\n * 1. before 抽象方法。前处理，因为每种插片的逻辑都不一致，所以需要每个子类自行实现\r\n * 2. replace 插片内容的替换方法，不需要子类重写\r\n * 3. after 后处理，将所有插片内容还原为 html 可显示内容\r\n */\r\nexports.AspectBase = (key) => {\r\n\r\n\tlet array = [];\r\n\r\n\treturn {\r\n\t\t// before 方法需要每个子类自行实现\r\n\t\treplace: (input, part, str) => {\r\n\r\n\t\t\tinput = input.replace(part, `{${key}~${array.length}}`);\r\n\t\t\tarray.push(str);\r\n\r\n\t\t\treturn input;\r\n\t\t},\r\n\t\tafter: (input) => {\r\n\t\t\tArray.forEach(array, (i, e) => {\r\n\t\t\t\tinput = input.replace(`{${key}~${i}}`, e);\r\n\t\t\t});\r\n\r\n\t\t\treturn input;\r\n\t\t}\r\n\t}\r\n};\r\n\r\nexports.decodeHtmlTag = (str) => {\r\n\r\n\tstr = str.replace(/</g, \"&lt;\");\r\n\tstr = str.replace(/>/g, \"&gt;\");\r\n\r\n\treturn str;\r\n};\n\n//# sourceURL=webpack:///./src/lib/util.js?");

/***/ })

/******/ });