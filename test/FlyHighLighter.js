;
(function () {

	var LANGUAGES = {},
		arraySlice = Array.prototype.slice;

	/*
	 * 常量定义
	 */
	const BLANK = String.BLANK,
		JOIN = '</li><li>',
		ESCAPER_4_C_LIKE = '\\';
	// 共通标签
	const CLOSE_SPAN = '</span>',
		COMMENT_SPAN = '<span class="comment">',
		STRING_SPAN = '<span class="string">',
		NUMBER_SPAN = '<span class="number">',
		FILETYPE_SPAN = '<span class="filetype">',
		// 常用标签
		CHAR_SPAN = '<span class="character">',
		KEYWORD_SPAN = '<span class="keyword">',
		REGEXP_SPAN = '<span class="regexp">',
		DOC_SPAN = '<span class="doc">',
		// 内置的各种内容
		BUILTIN_FUNC_SPAN = '<span class="builtin_func">',
		BUILTIN_VAR_SPAN = '<span class="builtin_var">',
		// 各种符号
		BRACKET_SPAN = '<span class="bracket">',
		OPERATOR_SPAN = '<span class="operator">',
		XMLTAG_SPAN = '<span class="xmltag">',
		// 键值对（XML属性、CSS 等可用）
		DATA_KEY_SPAN = '<span class="data_key">',
		DATA_VAL_SPAN = '<span class="data_val">';
	const DQUOTE = '"', // 标准符号
		QUOTE = "'",
		SLASH = '/',
		ASTERISK = '*',
		NL_N = '\n',
		AT = '@',
		AND = '&',
		TAB = '\t',
		SHARP = '#';
	const COMMA = ",", // 运算符
		SEMICOLON = ';',
		COLON = ':',
		LEFT_BRACKET = '{',
		RIGHT_BRACKET = '}',
		POINT = '.',
		HYPHEN = "-",
		EQUALS = '=',
		TILDE = '~',
		EXCALMATORY = '!',
		ZERO_WIDTH = "\uFEFF";
	const LEFT_ANGLE = '<', // XML转义前符号
		RIGHT_ANGLE = '>',
		LEFT_ANGLE_XML_ENTITY = '&lt;', // XML 实体
		RIGHT_ANGLE_XML_ENTITY = '&gt;',
		AMP_XML_ENTITY = '&amp;',
		QUOT_XML_ENTITY = "&quot;",
		APOS_XML_ENTITY = "&apos;",
		SHARP_XML_ENTITY = '&#35;';
	const SPACE_REGX = /\s/, // 标准空白
		BRACEKT_REGX = /(\{|\}|\[|\]|\(|\)|<|>)/, // 默认括号，使用 C 语言的括号（类 C 语言都可使用）
		//默认操作符（单字符，不计“->”这种多字符操作符），使用 C 语言的操作符（类 C 语言都可使用 ）
		OPERATOR_REGX_4_C_LIKE = /(=|\+|\-|\*|\/|\%|\&|\||\^|\!|\~|\?|:|,|;|\.)/,
		// 数字的 ASCII 编号
		CHAR_CODE_0 = 0x0030,
		CHAR_CODE_9 = 0x0039,
		// 大写字母字母的 ASCII 编号
		CHAR_CODE_UPPER_A = 0x0041,
		CHAR_CODE_UPPER_Z = 0x005A,
		CHAR_CODE_UPPER_F = 0x0046,
		// 小写字母字母的 ASCII 编号
		CHAR_CODE_LOWER_A = 0x0061,
		CHAR_CODE_LOWER_Z = 0x007A,
		CHAR_CODE_LOWER_F = 0x0066,
		// 特殊符号的 ASCII 编号
		CHAR_CODE_UNDERBAR = 95,
		CHAR_CODE_DOLLAR = 36;

	function getLang(execute, plugIn, keywords) {

		if (arguments.length > 3) {
			keywords = arraySlice.call(arguments, 2);
		}

		return {
			getKeywords: function () {
				return keywords;
			},
			getPlugIn: function () {
				return plugIn;
			},
			execute: execute
		};
	}

	function doHtmlEscape(at, output) {
		if (String.isEmpty(at) || at === ZERO_WIDTH) return;

		switch (at) {
			case NL_N:
				output.push(JOIN);
				break;
			case LEFT_ANGLE:
				output.push(LEFT_ANGLE_XML_ENTITY);
				break;
			case RIGHT_ANGLE:
				output.push(RIGHT_ANGLE_XML_ENTITY);
				break;
			case SHARP:
				output.push(SHARP_XML_ENTITY);
				break;
			case AND:
				output.push(AMP_XML_ENTITY);
				break;
			case DQUOTE:
				output.push(QUOT_XML_ENTITY);
				break;
			default:
				output.push(at);
		}
	}

	function canInNumber(at) {
		return /([0-9a-f]|l|\.|x|\-)/i.test(at);
	}

	function isInNumber(at, before, after) { }

	function checkNumberPosition(str, at) {
		return str.indexOf(at) === str.lastIndexOf(at);
	}

	let isNumber = function () {

		let IS_HEX_NUMBER = /^0x[a-f0-9]+$/i;
		let IS_DECIMAL = /^[0-9]\.[0-9](d|f)*$/i;
		let IS_INTEGER = /^[0-9](l)*/i;

		return function (str) {

			return IS_HEX_NUMBER.test(str) && // 16 进制数
				IS_DECIMAL.test(str) && // 小数
				IS_INTEGER.test(str); // 整数
		}
	};

	function doNewLineJoin(output, startSpan) {
		output.push(CLOSE_SPAN);
		output.push(JOIN);
		if (startSpan) output.push(startSpan);
	}

	/**
	 * 判断该字符是否可以作为一个词的组成部分
	 * 词的范围包括：
	 * 变量名、函数名、关键字
	 */
	function canInWord(at) {
		// [A-Z]
		return (CHAR_CODE_UPPER_A <= at && at <= CHAR_CODE_UPPER_Z) ||
			// [a-z]
			(CHAR_CODE_LOWER_A <= at && at <= CHAR_CODE_LOWER_Z) ||
			// [0-9]
			(CHAR_CODE_0 <= at && at <= CHAR_CODE_9) ||
			// [_ $]
			CHAR_CODE_UNDERBAR === at || CHAR_CODE_DOLLAR === at;
	}

	/*
	 * 判断给出的字符串是否是一个合法的词
	 */
	function isWord(str) {

		for (i = 0, len = str.length; i < len; i++) {
			if (!canInWord(str.charCodeAt(i))) return false;
		}

		if (/^[0-9]/.test(str)) return false; // 数字开头

		return true;
	}

	/**
	 * 处理字符或字符串
	 * <p>
	 * 某些语言字符可以包含多个字符，所以这里和字符串一起进行处理。
	 * 输出形式具体是字符还是字符串全权交给每个语言自定义实现
	 * </p>
	 * 
	 * @param code 处理的目标字符串
	 * @param index 处理的起始位置
	 * @param len 字符串长度
	 * @param output 输出对象（数组）
	 * @param escaper 转义字符
	 * @param end  结束标识符
	 * @param charSpann 字符 span 标签，用于区分字符和字符串
	 */
	function defaultDoChars(code, index, len, output, escaper, end, charSpan) {
		output.push(charSpan);
		var before = escaper;
		for (; index < len; index++) {
			var at = code.charAt(index);
			if (at === NL_N) {
				doNewLineJoin(output, charSpan);
			} else {
				doHtmlEscape(at, output);
				// 转义字符的转义
				if (at === escaper && before === escaper) {
					before = null;
					continue;
				}
				if (at === end && before !== escaper) {
					break;
				}
			}
			before = at;
		}
		output.push(CLOSE_SPAN);
		return index;
	}

	function defaultDoCharCase(word, charCaseMethod) {
		var outWord = word;
		if (charCaseMethod) {
			switch (typeOf(charCaseMethod)) {
				case 'string':
					outWord = word[charCaseMethod]();
					break;
				case 'function':
					outWord = charCaseMethod.apply(word);
					break;
				default:
					Error.unsupportedType(charCaseMethod);
			}
		}
		return outWord;
	}

	/**
	 * 处理关键字
	 * 
	 * @param kw 每种语言的关键字集
	 * @param word 请求判断的语言
	 * @param next 下一个字符
	 * @param charCaseMethod 大小写标签，因为有些语言不区分大小写，而关键字大小写是固定的，所以这里加入这个函数对被请求的词进行大小写处理
	 *                       这个函数可以是自定义函数，也可以是 JS 既存的字符串处理函数
	 * 
	 */
	function defaultDoKeyword(output, kw, word, next, charCaseMethod) {
		return Array.has(kw, defaultDoCharCase(word, charCaseMethod)) && !canInWord(next);
	}

	function defaultDoBuiltIn(word, nextCode, next, output, isBuiltInFunc, isBuiltInVar) {

		if (canInWord(nextCode)) return false; // 紧接着的字符可以入词则返回

		var builtInFuncFlg = isBuiltInFunc(word),
			builtInVarFlg = isBuiltInVar(word);
		var result = (builtInFuncFlg || builtInVarFlg);

		if (result) {
			if (builtInFuncFlg) {
				output.push(BUILTIN_FUNC_SPAN + word + CLOSE_SPAN);
			}
			if (builtInVarFlg) {
				output.push(BUILTIN_VAR_SPAN + word + CLOSE_SPAN);
			}
		}

		return result;
	}

	function defaultIsBuiltIn() {
		return false;
	}

	function defaultDoNumber(code, index, len, output) {
		var hex = false;
		var start = index;
		var at = code.charAt(index);
		if (canInWord(code.charCodeAt(index - 1))) {
			output.push(at);
			return index;
		}
		var word = "";
		for (; index < len; index++) {
			at = code.charAt(index);
			if (at === 'x' || at === 'X') {
				hex = true;
			}
			if (canInNumber(at)) {
				if (at === HYPHEN && canInNumber(code.charAt(index - 1))) break;
				word += at;
			} else {
				break;
			}
		}

		if (isNumber(word)) {
			output.push(NUMBER_SPAN + word + CLOSE_SPAN);
		} else {
			output.push(word);
		}

		return index - 1;
	}

	function doLineComment4Like(code, index, len, at, output) {
		output.push(COMMENT_SPAN);
		for (; index < len; index++) {
			at = code.charAt(index);
			if (at === NL_N) {
				doNewLineJoin(output);
				break;
			} else {
				doHtmlEscape(at, output);
			}
		}

		return index;
	}

	var BLOCK_COMMENT_END = "*/";

	function doBlockComment4CLike(code, index, len, output, doc) {
		doc = doc && code.charAt(index + 2) === ASTERISK;
		output.push(doc ? DOC_SPAN : COMMENT_SPAN);
		for (; index < len; index++) {
			var at = code.charAt(index);
			if (at !== ASTERISK || code.charAt(index + 1) !== SLASH) {
				if (at === NL_N) {
					doNewLineJoin(output, doc ? DOC_SPAN : COMMENT_SPAN);
				} else {
					doHtmlEscape(at, output);
				}
			} else {
				break;
			}
		}
		output.push(BLOCK_COMMENT_END);
		output.push(CLOSE_SPAN);
		return ++index;
	}

	function judgeComment4CLike(at) {
		return at === SLASH;
	}

	function doComment4CLike(code, index, len, at, output, doc) {
		var next = (index < len - 1) ? code.charAt(index + 1) : BLNAK;
		if (judgeComment4CLike(next)) {
			index = doLineComment4Like(code, index, len, at, output);
		} else if (next === ASTERISK) {
			index = doBlockComment4CLike(code, index, len, output, doc);
		}
		return index;
	}

	function defaultJudgePluginExe() {
		return false;
	}

	function commonExecute(code) {
		var kw = this.getKeywords(),
			plugIn = this.getPlugIn(),
			escaper = ESCAPER_4_C_LIKE,
			judgeExe = defaultJudgePluginExe,
			plugInExe = null,
			hasPlugIn = !!plugIn,
			// 插件的判断函数
			doComment = doComment4CLike,
			judgeComment = judgeComment4CLike,
			isBuiltInFunc = defaultIsBuiltIn,
			isBuiltInVar = defaultIsBuiltIn,
			// 插件的执行函数
			doKeyword = defaultDoKeyword,
			doChar = defaultDoChars,
			doNumber = defaultDoNumber,
			doBuiltIn = defaultDoBuiltIn,
			// 插件替代量的默认值
			charCaseMethod = null,
			charSpan = CHAR_SPAN,
			doc = false;

		var word = BLANK,
			output = [];

		// 插件和可替换（继承）处理的预处理
		if (hasPlugIn) {
			if (plugIn.charSpan) {
				charSpan = plugIn.charSpan;
			}
			if (plugIn.escaper) {
				escaper = plugIn.escaper;
			}
			if (plugIn.doComment) {
				doComment = plugIn.doComment;
			}
			if (plugIn.charCaseMethod) {
				charCaseMethod = plugIn.charCaseMethod;
			}
			if (plugIn.judgeComment) {
				judgeComment = plugIn.judgeComment;
			}
			if (plugIn.judgeExe) {
				judgeExe = plugIn.judgeExe;
				if (plugIn.execute) {
					plugInExe = plugIn.execute;
				}
			}
			if (plugIn.doChar) {
				doChar = plugIn.doChar;
			}
			if (plugIn.doNumber) {
				doNumber = plugIn.doNumber;
			}
			if (plugIn.doKeyword) {
				doKeyword = plugIn.doKeyword;
			}
			if (plugIn.doBuiltIn) {
				doBuiltIn = plugIn.doBuiltIn;
			}
			if (plugIn.isBuiltInFunc) {
				isBuiltInFunc = plugIn.isBuiltInFunc;
			}
			if (plugIn.isBuiltInVar) {
				isBuiltInVar = plugIn.isBuiltInVar;
			}
			if (plugIn.OPERATOR_REGX) {
				operatorRegx = plugIn.OPERATOR_REGX;
			}
			doc = plugIn.doc;
		}

		for (let index = 0, len = code.length; index < len; index++) {

			let at = code.charAt(index),
				codeAt = code.charCodeAt(index);

			if (codeAt === 8203) continue;

			if (SPACE_REGX.test(at)) { // 标准空白
				output.push(word);
				doHtmlEscape(at, output);
				word = BLANK;
			} else if (hasPlugIn && judgeExe(at)) { // 每个语言的自定义插件
				index = plugInExe(code, index, len, output);
			} else if (judgeComment(at)) { // 注释
				output.push(word);
				index = doComment(code, index, len, at, output, doc);
				word = BLANK;
			} else if (at === DQUOTE) {
				output.push(word);
				// 双引号，一般来说双引号都都是字符串，所以这里直接写死
				// 以后要是遇到了 双引号不是字符串的，再做修改
				index = defaultDoChars(code, index, len, output, escaper, at, STRING_SPAN);
				word = BLANK;
			} else if (at === QUOTE) {
				output.push(word);
				// 单引号，默认判断为字符，具体实现由各语言自定义的 doChar 方法来实现
				// 即，如果将 doChar 自定义为 doChars ，那单引号也可以被当作字符串来处理
				index = doChar(code, index, len, output, escaper, at, charSpan);
				word = BLANK;
			} else {
				if (CHAR_CODE_0 <= codeAt && codeAt <= CHAR_CODE_9) { // 数字
					output.push(word);
					word = BLANK;
					index = doNumber(code, index, len, output);
				} else {
					if (BRACEKT_REGX.test(at)) { // 合法的括号（不含尖括号）
						output.push(word + BRACKET_SPAN + at + CLOSE_SPAN);
						word = BLANK;
					} else if (at === LEFT_ANGLE) { // 左尖括号
						output.push(word);
						doHtmlEscape(at, output);
						word = BLANK;
					} else {
						word += at;
						let next = code.charCodeAt(index + 1);
						if (OPERATOR_REGX_4_C_LIKE.test(word)) { // 类C语言的操作符
							output.push(word);
							word = BLANK;
						} else if (doKeyword(output, kw, word, next, charCaseMethod)) { // 关键字
							output.push(KEYWORD_SPAN + word + CLOSE_SPAN);
							word = BLANK;
						} else if (doBuiltIn(word, next, code.charAt(index + 1), output, isBuiltInFunc, isBuiltInVar)) { // 语言内置函数、变量等
							word = BLANK;
						}
					}
				}
			}
		}

		if (!String.isEmpty(word)) {
			output.push(word);
		}

		return output.join(BLANK);
	}

	// SQL
	LANGUAGES.SQL = getLang(commonExecute, {
		doComment: function (code, index, len, at, output) {
			var next = code.charAt(index + 1);
			if (at === SLASH && next === ASTERISK) {
				index = doBlockComment4CLike(code, index, len, output);
			} else if (at == HYPHEN && next === HYPHEN) {
				index = doLineComment4Like(code, index, len, at, output);
			} else {
				doHtmlEscape(at, output);
			}
			return index;
		},
		judgeComment: function (at) {
			return at === SLASH || at === HYPHEN;
		},
		charSpan: STRING_SPAN,
		doChar: function (code, index, len, output, escaper, end, span) {

			output.push(span + code.charAt(index++));

			for (; index < len; index++) {
				let at = code.charAt(index);

				if (at === NL_N) {
					doNewLineJoin(output, span);
				} else {
					doHtmlEscape(at, output);
					if (at === end) {
						next = code.charAt(index + 1);
						if (next === end) { // 转义符号
							doHtmlEscape(next, output);
							index++;
						} else { // 字符串结束
							break;
						}
					}
				}
			}
			output.push(CLOSE_SPAN);
			doHtmlEscape(next, output);

			return index;
		},
		escaper: QUOTE,
		charCaseMethod: 'toUpperCase'
	}, ["ABORT", "ACTION", "ADD", "AFTER", "ALL", "ALTER", "ANALYZE", "AND", "AS", "ASC", "ATTACH", "AUTOINCREMENT",
			"BEFORE", "BEGIN", "BETWEEN", "BY", "CASCADE", "CASE", "CAST", "CHECK", "COLLATE", "COLUMN", "COMMIT",
			"CONFLICT", "CONSTRAINT", "CREATE", "CROSS", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP",
			"DATABASE", "DECLARE", "DEFAULT", "DEFERRABLE", "DEFERRED", "DELETE", "DESC", "DETACH", "DISTINCT", "DROP", "EACH",
			"ELSE", "END", "ESCAPE", "EXCEPT", "EXCLUSIVE", "EXISTS", "EXPLAIN", "FAIL", "FOR", "FOREIGN", "FROM",
			"FULL", "GLOB", "GROUP", "HAVING", "IF", "IGNORE", "IMMEDIATE", "IN", "INDEX", "INDEXED", "INITIALLY",
			"INNER", "INSERT", "INSTEAD", "INTEGER", "INTERSECT", "INTO", "IS", "ISNULL", "JOIN", "KEY", "LEFT",
			"LIKE", "LIMIT", "MATCH", "NATURAL", "NO", "NOT", "NOTNULL", "NULL", "OF", "OFFSET", "ON", "OR", "ORDER",
			"OUTER", "PLAN", "PRAGMA", "PRIMARY", "QUERY", "RAISE", "REFERENCES", "REGEXP", "REINDEX", "RELEASE",
			"RENAME", "REPLACE", "RESTRICT", "RIGHT", "ROLLBACK", "ROW", "SAVEPOINT", "SELECT", "SET", "TABLE", "TEMP",
			"TEMPORARY", "TEXT", "THEN", "TO", "TRANSACTION", "TRIGGER", "UNION", "UNIQUE", "UPDATE", "USING",
			"VACUUM", "VALUES", "VARCHAR", "VIEW", "VIRTUAL", "WHEN", "WHERE"
		]);

	// C#
	(function () {

		function doAttribute(code, index, len, output) {

			FOR_ATTRIBUTE: for (let i = index - 1; i >= 0; i--) {
				let at = code.charAt(i);
				if (!SPACE_REGX.test(at)) {
					/*
					 * 1. 左花括号 ： } [Description]
					 * 2. 右花括号 ： { [Description]
					 * 3. 注释 ： 
					 ×    1) 块注释 /× ×/ [Description]
					 *    2) 行注释 //(/) Comment 
					 *				    [Description]
					 */
					if (at === LEFT_BRACE || at === RIGHT_BRACE ) {// 左右花括号
						index += 1;
						break FOR_ATTRIBUTE;
					} else if (i > 0 && at === SLASH) { // 注释
						let before = code.charAt(i - 1);
						if (before === ASTERISK) { // 块注释
							index += 1;
							break FOR_ATTRIBUTE;
						} else if (before === SLASH) {
							for (let j = i - 2; j >= 0; j--) {
								let at2 = code.charAt(j);
								/*
								 * 因为存在 “// aaa // bbb” 这种形式的注视
								 * 所以不能直接判断第一个遇到的 // 之前是否有非空白，而只能以换行符为准
								 */
								if (at2 === NL_N) { // 遇到换行符之后取整段字符，看是否以 // 开头
									let line = code.slice(j + 1, index - 1).trim();
									if (line.startsWith("//")) {
										index += 1;
										break FOR_ATTRIBUTE;
									} else {
										return --index; // 所有可能性之外
									}
								}
							}
						}
					}
				}
			}

			output.push(BRACKET_SPAN + LEFT_SQUARE_BRACKET + CLOSE_SPAN);
			let word = BLANK;
			for (; index < len; index++) {
				let at = code.charAt(index);
				if (at === RIGHT_SQUARE_BRACKET || at === LEFT_PARENTHE || SPACE_REGX.test(at) || at === POINT) break;
				word += at;
			}

			output.push(DATA_DESCRIPTION_SPAN + word + CLOSE_SPAN);

			return --index;
		}

		let dftBuiltInVar = ["System", "IO", "Windows", "Forms"];

		LANGUAGES["C#"] = getLang(commonExecute, {
			judgeExe: function (at) {
				return at === LEFT_SQUARE_BRACKET;
			},
			isBuiltInVar: function (word) {
				return Array.has(dftBuiltInVar, word);
			},
			execute: doAttribute
		}, ["abstract", "as", "base", "bool", "break", "byte", "case", "catch", "char", "checked", "class", "const", "continue",
				"decimal", "default", "delegate", "do", "double", "else", "enum", "event", "explicit", "extern",
				"false", "finally", "fixed", "float", "for", "foreach", "goto", "if", "implicit", "in", "int", "interface", "internal", "is",
				"lock", "long", "namespace", "new", "null", "object", "operator", "out", "override",
				"params", "private", "protected", "public", "readonly", "ref", "return",
				"sbyte", "sealed", "short", "sizeof", "stackalloc", "static", "string", "struct", "switch",
				"this", "throw", "true", "try", "typeof",
				"uint", "ulong", "unchecked", "unsafe", "ushort", "using", "virtual", "void", "volatile", "while",
				"add", "alias", "ascending", "async", "await", "descending", "dynamic", "from", "get", "global", "group",
				"into", "join", "let", "nameof", "orderby", "partial", "remove", "select", "set", "value", "var", "when", "where", "yield"]);
	})();

	// Java
	(function () {

		var ANNOTATION_SPAN = '<span class="annotation">',
			AT_INTERFACE = '@interface';

		function doAnnotation(code, index, len, output) {

			var word = BLANK;
			for (; index < len; index++) {
				var at = code.charAt(index);
				if (SPACE_REGX.test(at) || at === '(') break;
				word += at;
			}
			if (word === AT_INTERFACE) {
				output.push(KEYWORD_SPAN + word + CLOSE_SPAN);
			} else {
				output.push(ANNOTATION_SPAN + word + CLOSE_SPAN);
			}

			return --index;
		}

		var dftBuiltInFunc = ['Object', 'System', 'NullPointerException', 'Boolean', 'Integer', 'main', 'Exception',
			'Throwable', 'Error', 'Class', 'String', 'Long', 'Number', 'Character', 'Short', 'Byte', 'Float',
			'Double', 'Math', 'Date', 'Calendar', 'StringBuffer', 'StringBuilder', 'Arrays'
		];
		var dftBuiltInVar = ['T', 'E', 'K', 'V'];

		LANGUAGES.JAVA = getLang(commonExecute, {
			judgeExe: function (at) {
				switch (at) {
					case AT:
						return true;
					default:
						return false;
				}
			},
			isBuiltInFunc: function (word) {
				return Array.has(dftBuiltInFunc, word);
			},
			isBuiltInVar: function (word) {
				return Array.has(dftBuiltInVar, word);
			},
			doc: true,
			execute: function (code, index, len, output) {
				switch (code.charAt(index)) {
					case AT:
						return doAnnotation(code, index, len, output);
					default:
						return index;
				}
			}
		}, ['private', 'protected', 'public', 'abstract', 'class', 'extends', 'final', 'implements', 'interface',
				'native', 'new', 'static', 'strictfp', 'synchronized', 'transient', 'volatile', 'break', 'continue',
				'return', 'do', 'while', 'if', 'else', 'for', 'instanceof', 'switch', 'case', 'default', 'assert',
				'catch', 'finally', 'throw', 'throws', 'try', 'import', 'package', 'boolean', 'byte', 'char', 'double',
				'float', 'int', 'long', 'short', 'null', 'true', 'false', 'super', 'this', 'void', 'goto'
			]);
	})();

	function doJsRegExp(code, index, len, at, output) {
		var word = [at],
			before = at,
			hasRegex = false;
		var start = index;
		for (start += 1; start < len; start++) {
			at = code.charAt(start);
			if (at === NL_N) {
				break;
			} else if (at === SLASH && before !== ESCAPER_4_C_LIKE) {
				hasRegex = true;
			} else if (hasRegex && !(at === 'i' || at === 'g' || at === 'm')) {
				break;
			}
			doHtmlEscape(at, word);
			before = at;
		}
		if (hasRegex) {
			output.push(REGEXP_SPAN + word.join('') + CLOSE_SPAN);
			start--;
			index = start;
		}
		return index;
	}

	function jsDoComment(code, index, len, at, output) {
		var next = code.charAt(index + 1);
		var method = (next === SLASH || next === ASTERISK) ? doComment4CLike : doJsRegExp;
		return method(code, index, len, at, output);
	}
	// js / json
	(function () {

		var dftBuiltInFunc = ['eval', 'alert', 'Object', 'String', 'Date', 'Number', 'Math', 'RegExp', 'Function',
			'Error', 'Boolean', 'Array', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'decodeURI', 'decodeURIComponent',
			'encodeURI', 'encodeURIComponent', 'escape', 'unescape', 'setTimeout', 'setInterval'
		];
		var dftBuiltInVar = ['document', 'window', 'console', 'Infinity', 'NaN'];

		// json 就是 js ，所以直接引用JS 的实现
		LANGUAGES.JSON = LANGUAGES.JAVASCRIPT = getLang(commonExecute, {
			charSpan: STRING_SPAN,
			isBuiltInFunc: function (word) {
				return Array.has(dftBuiltInFunc, word);
			},
			isBuiltInVar: function (word) {
				return Array.has(dftBuiltInVar, word);
			},
			doComment: jsDoComment
		}, ['break', 'case', 'catch', 'continue', 'default', 'delete ', 'do', 'else', 'false', 'finally', 'for',
				'function', 'if', 'in', 'instanceof', 'new', 'null', 'return', 'switch', 'this', 'throw', 'true',
				'try', 'typeof', 'let', 'var', 'while', 'with', 'void', 'undefined', 'abstract', 'boolean', 'byte', 'char',
				'class', 'const', 'debugger', 'double', 'enum', 'export', 'extends', 'final', 'float', 'goto', 'let',
				'implements', 'import', 'int', 'interface', 'long', 'native', 'package', 'private', 'protected',
				'public', 'short', 'static', 'super', 'synchronized', 'throws', 'transient', 'volatile'
			]);
	})();

	/*
	 * 伪代码
	 * 1. 以 C 式语法 为基础，只进行关键字和注释识别
	 * 2. 包含 var、echo、function、class 等其他语言的关键字
	 * 3. 同时删除一些语言特色太明显的关键字，如：auto、sizeof、typeof、native
	 * 4. 再添加 一个 js 的正则表达式的表达
	 * 5. 再加一个内置函数的判断，包括 print、alert、eval 等
	 */
	var pseudocode = (function () {
		var dftBuiltInFunc = ['eval', 'alert', 'print'];

		return getLang(commonExecute, {
			doComment: jsDoComment,
			isBuiltInFunc: function (word) {
				return Array.has(dftBuiltInFunc, word);
			},
		}, ['abstract', 'assert',
				'boolean', 'break', 'byte',
				'case', 'catch', 'class', 'char', 'const', 'continue',
				'default', 'delete ', 'do', 'double',
				'else', 'eval', 'echo', 'enum', 'export', 'extends',
				'false', 'final', 'finally', 'float', 'for', 'foreach', 'function',
				'goto',
				'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface',
				'long',
				'new', 'null', 'namespace',
				'package', 'private', 'protected', 'public',
				'return',
				'short', 'static', 'string', 'struct', 'super', 'switch',
				'this', 'throw', 'throws', 'true', 'try',
				'var',
				'while',
				'virtual', 'void'
			]);
	})();
	// C/C++
	(function () {

		var MACRODEFINE_SPAN = '<span class="macrodefine">';
		var dftBuiltInFunc = ['printf', 'malloc', 'free'];

		function doMacroDefine(code, index, len, output) {

			var before = null;

			for (index; index < len; index++) {
				var at = code.charAt(index);
				if (at === NL_N || (SPACE_REGX.test(at) && before !== SHARP) || at === LEFT_ANGLE || at === DQUOTE) {
					output.push(CLOSE_SPAN);
					doHtmlEscape(at, output);
					return index;
				} else {
					doHtmlEscape(at, output);
					before = at;
				}
			}
		}

		var base = {
			judgeExe: function (at) {
				switch (at) {
					case SHARP:
						return true;
					default:
						return false;
				}
			},
			isBuiltInFunc: function (word) {
				return Array.has(dftBuiltInFunc, word);
			},
			OPERATOR_REGX: /(\+|\-|\*|\/|\%|\&|\||\^|\!|\~|\?|\:|,|;|<)/,
			execute: function (code, index, len, output) {
				var at = code.charAt(index);
				switch (at) {
					case SHARP:
						output.push(MACRODEFINE_SPAN);
						output.push(SHARP_XML_ENTITY);
						return doMacroDefine(code, ++index, len, output);
					default:
						return index;
				}
			}
		}

		LANGUAGES.C = getLang(commonExecute, base, ['auto', '_bool', 'break', 'case', 'char', 'const', 'continue',
			'do', 'default', 'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long',
			'register', 'return', 'typedef', 'signed', 'sizeof', 'short', 'static', 'struct', 'switch', 'union',
			'unsigned', 'void', 'volatile', 'while'
		]);

		// C++暂时只在关键字上区别C语言
		LANGUAGES["C++"] = getLang(commonExecute, base, ['asm', 'auto', 'bool', 'break', 'case', 'catch', 'char', 'class',
			'const', 'const_cast', 'continue', 'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum',
			'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend', 'goto', 'if', 'inline', 'int', 'long',
			'mutable', 'namespace', 'new', 'operator', 'private', 'protected', 'public', 'register', 'reinterpret_cast',
			'return', 'short', 'signed', 'sizeof', 'static', 'static_cast', 'struct', 'switch', 'template', 'this',
			'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void',
			'volatile', 'wchar_t', 'while'
		]);
	})();

	// CSS
	(function () {

		const CSS_ID_SPAN = '<span class="css_name css_id">',
			CSS_CLASS_SPAN = '<span class="css_name css_class">',
			CSS_AT_SPAN = '<span class="css_name css_at">',
			CSS_XMLTAG_SPAN = '<span class="css_name xmltag">',
			CSS_PSEUDO_CLASS_SPAN = '<span class="css_name css_pseudo_class">',
			CSS_FILETYPE = "@CHARSET";

		// 这个函数负责进入解析 CSS 名称部分
		// 各种不同的名称逻辑交给 doCssCssNames 去实现
		function doCssName(code, index, len, output) {
			for (; index < len; index++) {

				var at = code.charAt(index);

				if (at === TILDE || SPACE_REGX.test(at)) {
					doHtmlEscape(at, output);
					continue;
				}

				switch (at) {
					case POINT:
						output.push(CSS_CLASS_SPAN);
						break;
					case SHARP:
						output.push(CSS_ID_SPAN);
						break;
					case LEFT_BRACKET:
					case RIGHT_BRACKET:
						return index;
					default:
						output.push(CSS_XMLTAG_SPAN);
				}

				index = doCssCssNames(code, index, len, output, at);

			}
		}

		function doCssBody(code, index, len, output) {

			for (; index < len; index++) {
				var at = code.charAt(index);
				if (SPACE_REGX.test(at)) {
					doHtmlEscape(at, output);
				} else if (at === RIGHT_BRACKET) {
					output.push(at);
					return index;
				} else if (at === SLASH && ASTERISK === code.charAt(index + 1)) {
					index = doBlockComment4CLike(code, index, len, output, false);
				} else if (at !== LEFT_BRACKET) {
					var charCode = code.charCodeAt(index);
					index = doCssAttr(code, index, len, output);
					if (index < len) {
						index = cssBody(code, index, len, output);
					} else {
						index = cssSpace(code, index, len, output);
					}
				} else {
					doHtmlEscape(at, output);
				}
			}
		}

		function doCssAt(code, index, len, output) {
			output.push(CSS_AT_SPAN);
			for (; index < len; index++) {
				let at = code.charAt(index);
				if (at === LEFT_BRACKET) {
					output.push(CLOSE_SPAN);
					output.push(LEFT_BRACKET);

					return index;
				} else {
					doHtmlEscape(at, output);
				}
			}
		}

		// 这个函数是具体负责解析各种名称的
		function doCssCssNames(code, index, len, output) {
			for (; index < len; index++) {
				var at = code.charAt(index);
				if (at === RIGHT_ANGLE) {
					output.push(CLOSE_SPAN);
					doHtmlEscape(at, output);
					if (code.charAt(index + 1) === COLON) {
						output.push(CSS_PSEUDO_CLASS_SPAN);
						index = doCssPseudoClass(code, ++index, len, output);
					} else {
						return index;
					}
				} else if (at === COMMA || SPACE_REGX.test(at)) {
					output.push(CLOSE_SPAN);
					doHtmlEscape(at, output);
					return index;
				} else if (at === LEFT_BRACKET) {
					output.push(CLOSE_SPAN);
					return --index;
				} else {
					doHtmlEscape(at, output);
				}
			}
		}

		function doCssPseudoClass(code, index, len, output) {

			for (; index < len; index++) {
				var at = code.charAt(index);
				if (at === COMMA || SPACE_REGX.test(at)) {
					output.push(CLOSE_SPAN);
					doHtmlEscape(at, output);
					return index;
				} else if (at === LEFT_BRACKET) {
					output.push(CLOSE_SPAN);
					return --index;
				} else {
					doHtmlEscape(at, output);
				}
			}
		}

		function cssBody(code, index, len, output) {

			index = cssSpace(code, index, len, output);

			output.push(DATA_VAL_SPAN);
			for (; index < len; index++) {
				var at = code.charAt(index);
				if (at === SEMICOLON) {
					output.push(CLOSE_SPAN);
					output.push(at);
					return index;
				} else if (at === RIGHT_BRACKET) {
					// 后括号判断为退出 CSS 身体部，身体部的所有逻辑到此结束
					output.push(CLOSE_SPAN);
					return --index;
				}
				if (at === NL_N) {
					doNewLineJoin(output, DATA_VAL_SPAN);
				} else {
					doHtmlEscape(at, output);
				}
			}
		}

		function cssSpace(code, index, len, output) {

			for (; index < len; index++) {
				var at = code.charAt(index);
				if (at === SLASH && ASTERISK === code.charAt(index + 1)) {
					index = doBlockComment4CLike(code, index, len, output, false);
				} else if (at === COMMA || SPACE_REGX.test(at)) {
					doHtmlEscape(at, output);
				} else {
					return index;
				}
			}
		}

		function doCssAttr(code, index, len, output) {

			output.push(DATA_KEY_SPAN);
			for (; index < len; index++) {
				var at = code.charAt(index);
				if (at === COLON || at === RIGHT_BRACKET) {
					output.push(CLOSE_SPAN);
					output.push(at);
					return ++index;
				}
				if (at === NL_N) {
					doNewLineJoin(output, DATA_KEY_SPAN);
				} else {
					doHtmlEscape(at, output);
				}
			}
		}

		function doCSS(code) {

			var len = code.length,
				index = 0,
				output = [];
			var at = code.charAt(index);
			// CSS 文档以 @charset 开头
			if (String.startsWith(String.trim(code).toUpperCase(), CSS_FILETYPE)) {
				for (; index < len; index++) {
					at = code.charAt(index);
					if (at === AT) {
						output.push(FILETYPE_SPAN);
					}
					output.push(at);
					if (at === SEMICOLON) {
						output.push(CLOSE_SPAN);
						index++;
						break;
					}
				}
			}

			for (; index < len; index++) {
				at = code.charAt(index);
				if (at === AT) {
					index = doCssAt(code, index, len, output);
				} else if (at === SLASH) {
					index = doBlockComment4CLike(code, index, len, output);
				} else if (at === COMMA || SPACE_REGX.test(at)) {
					doHtmlEscape(at, output);
				} else {
					index = doCssName(code, index, len, output);
					index = doCssBody(code, index, len, output);
				}
			}

			return output.join(BLANK);

		}

		LANGUAGES.CSS = {
			execute: doCSS
		};
	})();

	// HTML + XML
	(function () {

		const _doCSS = LANGUAGES.CSS,
			_doJS = LANGUAGES.JAVASCRIPT;

		// HTML 专用
		const COMMENT_TAG_REGX = /<(script|style)([^>]*)>([\s\t\n]*)<\!\-\-([\s\S\n]*?)\-\->([\s\t\n]*)<\/(script|style)>/i,
			TAG_REGX = /<(script|style)([^>]*)>([\s\S\n]*?)<\/(script|style)>/i,
			XML_DOCTYPE_REGX = /<\!(DOCTYPE)([\s\S\n]*?)>/i;

		// XML 和 HTML 通用
		const XML_TAG_REGX = /<([^>]*?)>/i,
			XML_END_TAG_REGX = /<\/([^>]*?)>/i,
			XML_PROCESSING_REGX = /<\?([\s\S\n]*)\?>/,
			XML_COMMENT_REGX = /\<\!\-\-([\s\S\n]*?)\-\-\>/i,
			XML_ATTR_REGX = /(.+)\=(.+)/,
			XML_CDATA_REGX = /<\!\[CDATA\[([\s\S\n]*)\]\]>/;

		const XML_REPLACE_PART = "XML_Replace_Part:",
			HTML_REPLACE_PART = "HTML_Replace_Part:",
			XML_ATTR_REPLACE_PART = "XML_Attr_Replace_Part:",
			REPLACE_END = ":|";

		const XML_COMMENT_START_ENTITY = "&lt!--",
			XML_COMMENT_END_ENTITY = "--&gt;",
			XML_CDATA_START = "&lt![CDATA[",
			XML_CDATA_END = "]]&gt;",
			XML_PROCESSING_START = "&lt?",
			XML_PROCESSING_END = "?&gt;",
			XML_COMMENT_START = "<!--",
			XML_COMMENT_END = "-->";

		const XML_EMPTY_ATTR_REGX = new RegExp(DATA_KEY_SPAN + CLOSE_SPAN, "g"),
			XML_EMPTY_VAL_REGX = new RegExp(DATA_VAL_SPAN + CLOSE_SPAN, "g");

		const XML_CDATA_SPAN = '<span class="xml_cdata">',
			XML_DOCTYPE_SPAN = '<span class="xml_doctype">';

		function doXmlCData(code) {
			let output = [];
			output.push(XML_CDATA_SPAN);
			output.push(XML_CDATA_START);
			output.push(CLOSE_SPAN);

			for (let i = 0, len = code.length; i < len; i++) {
				doHtmlEscape(code.charAt(i), output);
			}

			output.push(XML_CDATA_SPAN);
			output.push(XML_CDATA_END);
			output.push(CLOSE_SPAN);

			return output.join('');
		}

		function doXmlComment(code) {
			let output = [];
			output.push(COMMENT_SPAN);
			output.push(XML_COMMENT_START_ENTITY);

			for (let i = 0, len = code.length; i < len; i++) {
				let at = code.charAt(i);
				if (at === NL_N) {
					doNewLineJoin(output, COMMENT_SPAN);
				} else {
					doHtmlEscape(at, output);
				}
			}

			output.push(XML_COMMENT_END_ENTITY);
			output.push(CLOSE_SPAN);

			return output.join('');
		}

		function doXmlAttibute(input) {

			let output = [];

			let isInName = true;
			let isInVal = false;

			for (let i = 0, len = input.length; i < len; i++) {
				let at = input.charAt(i);
				if (SPACE_REGX.test(at) && isInName) {
					if (i > 0) {
						output.push(CLOSE_SPAN);
					}
					doHtmlEscape(at, output);
					if (i < len) {
						output.push(DATA_KEY_SPAN);
					}
					isInVal = true;
					isInName = false;
				} else if ((at === EQUALS) && isInVal) {
					output.push(CLOSE_SPAN);
					doHtmlEscape(at, output);
					output.push(DATA_VAL_SPAN);
					isInName = true;
					isInVal = false;
				} else {
					if (at === DQUOTE) {
						isInName = !isInName;
						isInVal = !isInVal;
					}
					doHtmlEscape(at, output);
				}
			}

			output.push(CLOSE_SPAN);

			output = output.join('');

			output = output.replace(XML_EMPTY_ATTR_REGX, String.BLANK);
			output = output.replace(XML_EMPTY_VAL_REGX, String.BLANK);

			return output;
		}

		// 通用于标签属性（包括普通 标签和声明标签）
		function doXmlCommons(commonSpan, startVal, endVal, input) {

			let tmp = input.split(SPACE_REGX);
			/*
			 * <xxx .... /> => [xxx, .., .., .., /] => true
			 * <xxx ..../> => [xxx, .., .., ../] => true
			 * <xxx ....> => [xxx, .., .., ..] => false
			 * <xxx /> => [xxx, /] => true
			 * <xxx/> => [xxx/] => false
			 */
			let withSlash = String.endsWith(input, SLASH) && !String.endsWith(tmp[0], SLASH);

			let output = [];
			output.push(commonSpan);
			output.push(startVal);
			output.push(tmp[0]);
			output.push(CLOSE_SPAN);

			if (tmp.length > 1) {
				let end = input.length;
				if (withSlash) end -= 1;
				input = input.slice(tmp[0].length, end);
				output.push(doXmlAttibute(input));
			}

			output.push(commonSpan);
			if (withSlash) {
				output.push(SLASH);
			}
			output.push(endVal);
			output.push(CLOSE_SPAN);

			return output.join('');
		}

		function doScriptOrStyle(tag, content) {

			let output = [];
			let trimed = String.trim(content);
			let starts = 0,
				ends = content.length;

			if (String.endsWith(trimed, XML_COMMENT_END)) {
				ends = content.lastIndexOf(XML_COMMENT_END);
			}

			if (String.startsWith(trimed, XML_COMMENT_START)) {
				starts = content.indexOf(XML_COMMENT_START);

				let spaces = content.slice(0, starts);

				for (let i = 0, len = spaces.length; i < len; i++) {
					doHtmlEscape(spaces.charAt(i), output);
				}

				output.push(COMMENT_SPAN);
				output.push(XML_COMMENT_START_ENTITY);
				output.push(CLOSE_SPAN);

				starts += 4;
			}

			let tmp = content.slice(starts, ends);

			switch (tag) {
				case 'SCRIPT':
					output.push(_doJS.execute(tmp));
					break;
				case 'STYLE':
					output.push(_doCSS.execute(tmp));
					break;
				default:
					break;
			}

			if (String.endsWith(trimed, XML_COMMENT_END)) {
				let spaces = content.slice(ends + 3);
				output.push(COMMENT_SPAN);
				output.push(XML_COMMENT_END_ENTITY);
				output.push(CLOSE_SPAN);
				for (let i = 0, len = spaces.length; i < len; i++) {
					doHtmlEscape(spaces.charAt(i), output);
				}
			}

			return output.join('');
		}

		function doXml(input) {

			let xmlReplaceList = [];

			// 处理 <!DOCTYPE ...>
			if (XML_DOCTYPE_REGX.test(input)) {
				input = input.replace(XML_DOCTYPE_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
				let output = XML_DOCTYPE_SPAN + LEFT_ANGLE_XML_ENTITY + EXCALMATORY + RegExp.$1 + RegExp.$2 +
					RIGHT_ANGLE_XML_ENTITY + CLOSE_SPAN;
				xmlReplaceList.push(output);
			}

			// 处理 <!-- ... -->
			while (XML_COMMENT_REGX.test(input)) {
				let output = doXmlComment(RegExp.$1);

				input = input.replace(XML_COMMENT_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
				xmlReplaceList.push(output);
			}

			// 处理 <?xxx ... ?>
			while (XML_PROCESSING_REGX.test(input)) {
				let output = doXmlCommons(XMLTAG_SPAN, XML_PROCESSING_START, XML_PROCESSING_END, RegExp.$1);

				input = input.replace(XML_PROCESSING_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
				xmlReplaceList.push(output);
			}

			// 处理 CDATA
			while (XML_CDATA_REGX.test(input)) {
				let output = doXmlCData(RegExp.$1);

				input = input.replace(XML_CDATA_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
				xmlReplaceList.push(output);
			}

			// 处理</xxx>
			while (XML_END_TAG_REGX.test(input)) {
				let output = XMLTAG_SPAN + LEFT_ANGLE_XML_ENTITY + SLASH + RegExp.$1 + RIGHT_ANGLE_XML_ENTITY + CLOSE_SPAN;

				input = input.replace(XML_END_TAG_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
				xmlReplaceList.push(output);
			}

			// 处理 <xxx ... > / <xxx ... />
			while (XML_TAG_REGX.test(input)) {
				let output = doXmlCommons(XMLTAG_SPAN, LEFT_ANGLE_XML_ENTITY, RIGHT_ANGLE_XML_ENTITY, RegExp.$1);

				input = input.replace(XML_TAG_REGX, XML_REPLACE_PART + xmlReplaceList.length + REPLACE_END);
				xmlReplaceList.push(output);
			}

			let output = [];
			for (let i = 0, len = input.length; i < len; i++) {
				doHtmlEscape(input.charAt(i), output);
			}

			input = output.join('');

			// 回替
			Array.forEach(xmlReplaceList, function (i, e) {
				input = input.replace(XML_REPLACE_PART + i + REPLACE_END, e);
			});

			return input;
		}

		LANGUAGES.XML = {
			execute: doXml
		};

		function doHTML(input) {

			let htmlReplaceList = [];

			// 处理 <script ...><!-- ... --></script> / <style ...><!-- ... --></style>
			while (COMMENT_TAG_REGX.test(input)) {

				let tag = RegExp.$1.toUpperCase();
				let beforeTag = RegExp.$1 + RegExp.$2, // 前标签 ...
					beforeSpace = RegExp.$3; // > 和 <!-- 之间的标准空白
				let content = RegExp.$4; // 正文
				let afterSpace = RegExp.$5, // --> 和 < 之间的标准空白
					afterTag = RegExp.$6; // 后标签

				let before = [],
					after = [];
				for (let i = 0, len = beforeSpace.length; i < len; i++) {
					doHtmlEscape(beforeSpace.charAt(i), before);
				}
				for (let i = 0, len = afterSpace.length; i < len; i++) {
					doHtmlEscape(afterSpace.charAt(i), after);
				}

				let output = doXmlCommons(XMLTAG_SPAN, LEFT_ANGLE_XML_ENTITY, RIGHT_ANGLE_XML_ENTITY, beforeTag) +
					before.join('') +
					COMMENT_SPAN + XML_COMMENT_START_ENTITY + CLOSE_SPAN +
					doScriptOrStyle(tag, content) +
					COMMENT_SPAN + XML_COMMENT_END_ENTITY + CLOSE_SPAN +
					after.join('') +
					doXmlCommons(XMLTAG_SPAN, LEFT_ANGLE_XML_ENTITY + SLASH, RIGHT_ANGLE_XML_ENTITY, afterTag);

				input = input.replace(COMMENT_TAG_REGX, HTML_REPLACE_PART + htmlReplaceList.length + REPLACE_END);
				htmlReplaceList.push(output);
			}

			// 因为存在 <!--<script ...>...</script>-->这种模式，所以先处理注释
			while (XML_COMMENT_REGX.test(input)) {
				let output = doXmlComment(RegExp.$1);

				input = input.replace(XML_COMMENT_REGX, HTML_REPLACE_PART + htmlReplaceList.length + REPLACE_END);
				htmlReplaceList.push(output);
			}

			// 处理 <script ...> ... </script> / <style ...> ... </style>
			while (TAG_REGX.test(input)) {

				let tag = RegExp.$1.toUpperCase();
				let before = RegExp.$1 + RegExp.$2; // 前标签
				let content = RegExp.$3; // 正文
				let after = RegExp.$4; // 后标签

				let puts = [RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6];

				let output = doXmlCommons(XMLTAG_SPAN, LEFT_ANGLE_XML_ENTITY, RIGHT_ANGLE_XML_ENTITY, before) +
					doScriptOrStyle(tag, content) +
					doXmlCommons(XMLTAG_SPAN, LEFT_ANGLE_XML_ENTITY + SLASH, RIGHT_ANGLE_XML_ENTITY, after);

				input = input.replace(TAG_REGX, HTML_REPLACE_PART + htmlReplaceList.length + REPLACE_END);
				htmlReplaceList.push(output);
			}

			// 因为注释和XML一致，HTML部分则不处理 <!-- ... -->
			// 剩下的全当 XML 进行处理
			input = doXml(input);

			// 回替
			Array.forEach(htmlReplaceList, function (i, e) {
				input = input.replace(HTML_REPLACE_PART + i + REPLACE_END, e);
			});

			return input;

		}

		LANGUAGES.HTML = {
			execute: doHTML
		};
	})();

	// PHP
	(function () {
		var dftBuiltInFunc = ['eval'];

		var PHP_START = "<?php",
			PHP_END = "?>";
		var PHP_START_LEN = PHP_START.length,
			PHP_END_LEN = PHP_END.length;

		var html = LANGUAGES.HTML,
			php = getLang(commonExecute, {
				charSpan: STRING_SPAN,
				isBuiltInFunc: function (word) {
					return Array.has(dftBuiltInFunc, word);
				}
			}, ['and', 'or', 'xor', 'exception', 'as', 'break', 'case', 'class', 'const', 'continue ', 'declare',
					'default', 'do', 'echo', 'else', 'elseif', 'enddeclare', 'endfor', 'endforeach', 'endif', 'endswitch',
					'endwhile', 'extends', 'for', 'foreach', 'function', 'global', 'if', 'include', 'include_once', 'new',
					'print', 'require', 'require_once', 'return', 'static', 'switch', 'use', 'var', 'while', 'final',
					'php_user_filter', 'interface', 'implements', 'public', 'private', 'protected', 'abstract', 'clone ',
					'try', 'catch', 'throw', 'cfunction', 'this', '__LINE__', '__FUNCTION__', '__CLASS__', '__METHOD__'
				]);

		function doPHP(input) {

			var phpStart = input.indexOf(PHP_START);

			if (phpStart < 0) return php.execute(input);

			phpStart += PHP_START_LEN;

			var phpEnd = input.indexOf(PHP_END);

			var output = html.execute(input.slice(0, phpStart)) + php.execute(input.slice(phpStart, phpEnd)) +
				html.execute(PHP_END) + doPHP(input.slice(phpEnd + PHP_END_LEN));
			return output;
		}

		LANGUAGES.PHP = {
			execute: doPHP
		};
	})();

	// VB / VBA / VBScript
	(function () {

		var dftBuiltInFunc = ['CDate', 'Date', 'DateAdd', 'DateDiff', 'DatePart', 'DateSerial', 'DateValue', 'Day',
			'FormatDateTime', 'Hour', 'IsDate', 'Minute', 'Month', 'MonthName', 'Now', 'Second', 'Time', 'Timer',
			'TimeSerial', 'TimeValue', 'Weekday', 'WeekdayName', 'Year', 'Asc', 'CBool', 'CByte', 'CCur', 'CDate',
			'CDbl', 'Chr', 'CInt', 'CLng', 'CSng', 'CStr', 'Hex', 'Oct', 'FormatCurrency', 'FormatDateTime', , 'Sgn',
			'FormatNumber', 'FormatPercent', 'Abs', 'Atn', 'Cos', 'Exp', 'Hex', 'Int', 'Fix', 'Log', 'Oct', 'Rnd',
			'Sin', 'Sqr', 'Tan', 'Array', 'Filter', 'IsArray', 'Join', 'LBound', 'Split', 'UBound', 'InStr', 'InStrRev',
			'LCase', 'Left', 'Len', 'LTrim', 'RTrim', 'Trim', 'Mid', 'Replace', 'Right', 'Space', 'StrComp', 'String',
			'StrReverse', 'UCase', 'CreateObject', 'Eval', 'GetLocale', 'GetObject', 'GetRef', 'InputBox', 'IsEmpty',
			'IsNull', 'IsNumeric', 'IsObject', 'LoadPicture', 'MsgBox', 'RGB', 'Round', 'ScriptEngine', 'VarType',
			'ScriptEngineBuildVersion', 'ScriptEngineMajorVersion', 'ScriptEngineMinorVersion', 'SetLocale', 'TypeName'
		];

		LANGUAGES.VBSCRIPT = LANGUAGES.VBA = LANGUAGES.VB = getLang(commonExecute, {
			judgeComment: function (at) {
				return at === QUOTE;
			},
			isBuiltInFunc: function (word) {

				var outWord = defaultDoCharCase(word),
					result = false;
				dftBuiltInFunc.forEach(function (wd) {
					if (String.equalsIgnoreCase(outWord, wd)) {
						result = true;
						return;
					}
				});

				return result;
			},
			doComment: doLineComment4Like,
			escaper: DQUOTE,
			doKeyword: function (output, kw, word, next, charCaseMethod) {

				var outWord = defaultDoCharCase(word),
					result = false;
				kw.forEach(function (wd) {
					if (String.equalsIgnoreCase(outWord, wd)) {
						result = true;
						return;
					}
				});

				return result && !canInWord(next);
			}
		}, ["AddHandler", "AddressOf", "Alias", "And", "AndAlso", "Ansi", "As", "Assembly", "Auto", "Boolean",
				"ByRef", "Byte", "ByVal", "Call", "Case", "Catch", "CBool", "CByte", "CChar", "CDate", "CDec", "CDbl",
				"Char", "CInt", "Class", "CLng", "CObj", "Const", "CShort", "CSng", "CStr", "CType", "Date", "Decimal",
				"Declare", "Default", "Delegate", "Dim", "DirectCast", "Do", "Double", "Each", "Else", "ElseIf", "End",
				"Enum", "Erase", "Error", "Event", "Exit", "#ExternalSource", "False", "Finally", "For", "Friend",
				"Function", "Get", "GetType", "GoTo", "Handles", "If", "Implements", "Imports", "In", "Inherits",
				"Integer", "Interface", "Is", "Let", "Lib", "Like", "Long", "Loop", "Me", "Mod", "Module",
				"MustInherit", "MustOverride", "MyBase", "MyClass", "Namespace", "New", "Next", "Not", "Nothing",
				"NotInheritable", "NotOverridable", "Object", "On", "Option", "Optional", "Or", "OrElse", "Overloads",
				"Overridable", "Overrides", "ParamArray", "Preserve", "Private", "Property", "Protected", "Public",
				"RaiseEvent", "ReadOnly", "ReDim", "#Region", "REM", "RemoveHandler", "Resume", "Return", "Select",
				"Set", "Shadows", "Shared", "Short", "Single", "Static", "Step", "Stop", "String", "Structure", "Sub",
				"SyncLock", "Then", "Throw", "To", "True", "Try", "TypeOf", "Unicode", "Until", "Variant", "When",
				"While", "With", "WithEvents", "WriteOnly", "Xor", "#Const", "#ExternalSource", "#Region"
			]);

		// VB6和VB.NET 应该不一样，但现在看起来似乎一样，原因待查
		LANGUAGES["VB.NET"] = getLang(commonExecute, {
			judgeComment: function (at) {
				return at === QUOTE;
			},
			isBuiltInFunc: function (word) {

				var outWord = defaultDoCharCase(word),
					result = false;
				dftBuiltInFunc.forEach(function (wd) {
					if (String.equalsIgnoreCase(outWord, wd)) {
						result = true;
						return;
					}
				});

				return result;
			},
			doComment: doLineComment4Like,
			escaper: DQUOTE,
			doKeyword: function (output, kw, word, next, charCaseMethod) {

				var outWord = defaultDoCharCase(word),
					result = false;
				kw.forEach(function (wd) {
					if (String.equalsIgnoreCase(outWord, wd)) {
						result = true;
						return;
					}
				});

				return result && !canInWord(next);
			}
			/*
			 * 所列的关键字全部来自 MSND （https://msdn.microsoft.com/zh-cn/library/ksh7h19t(v=vs.90).aspx）
			 * 但MSDN 上写的是 Visual Basic 的关键字，而不是 .NET，所以暂时存疑
			 * 单纯VB6 的关键字是什么，也存疑
			 */
		}, ["AddHandler", "AddressOf", "Alias", "And", "AndAlso", "Ansi", "As", "Assembly", "Auto", "Boolean",
				"ByRef", "Byte", "ByVal", "Call", "Case", "Catch", "CBool", "CByte", "CChar", "CDate", "CDec", "CDbl",
				"Char", "CInt", "Class", "CLng", "CObj", "Const", "CShort", "CSng", "CStr", "CType", "Date", "Decimal",
				"Declare", "Default", "Delegate", "Dim", "DirectCast", "Do", "Double", "Each", "Else", "ElseIf", "End",
				"Enum", "Erase", "Error", "Event", "Exit", "#ExternalSource", "False", "Finally", "For", "Friend",
				"Function", "Get", "GetType", "GoTo", "Handles", "If", "Implements", "Imports", "In", "Inherits",
				"Integer", "Interface", "Is", "Let", "Lib", "Like", "Long", "Loop", "Me", "Mod", "Module",
				"MustInherit", "MustOverride", "MyBase", "MyClass", "Namespace", "New", "Next", "Not", "Nothing",
				"NotInheritable", "NotOverridable", "Object", "On", "Option", "Optional", "Or", "OrElse", "Overloads",
				"Overridable", "Overrides", "ParamArray", "Preserve", "Private", "Property", "Protected", "Public",
				"RaiseEvent", "ReadOnly", "ReDim", "#Region", "REM", "RemoveHandler", "Resume", "Return", "Select",
				"Set", "Shadows", "Shared", "Short", "Single", "Static", "Step", "Stop", "String", "Structure", "Sub",
				"SyncLock", "Then", "Throw", "To", "True", "Try", "TypeOf", "Unicode", "Until", "Variant", "When",
				"While", "With", "WithEvents", "WriteOnly", "Xor", "#Const", "#ExternalSource", "#Region"
			]);
	})();

	var NEW_LINE = /(\r\n|\r)/ig;
	var FILED_START = '<fieldset class="code"><legend>',
		FILED_LIST = '</legend><pre><ol class="code_list"><li>',
		FILED_END = '</li></ol></pre></fieldset>';

	var langMap = {
		JAVA: 'Java',
		JAVASCRIPT: 'JavaScript',
		VBSCRIPT: 'VBScript',
	};

	function getFullName(lang) {
		switch (lang) {
			case 'JS':
				lang = 'JAVASCRIPT';
				break;
			case 'VBS':
				lang = 'VBSCRIPT';
			default:
				break;
		}
		return lang;
	}

	function getLangName(lang) {
		if (lang) {
			return (langMap[lang] || lang) + ' 代码';
		} else {
			return '伪代码';
		}
	}

	function parseLang(lang, input) {
		var language = LANGUAGES[lang] || pseudocode;
		return language.execute(input.replace(NEW_LINE, NL_N));
	}

	function execute(input, lang) {

		input = String.trim(input);
		if (!input) return BLANK;

		if (!String.contains(input, NL_N) && !lang) {
			let output = ["<code>"];
			for (let i = 0, len = input.length; i < len; i++) {
				doHtmlEscape(input.charAt(i), output);
			}
			output.push("</code>");
			return output.join(BLANK);
		}

		lang = String.trim(getFullName(lang.toUpperCase()));

		return FILED_START + getLangName(lang) + FILED_LIST + parseLang(lang, input) + FILED_END;
	}

	// 对外接口
	Coralian.setToGlobal("FlyHighLighter", {
		//global.FlyHighlither = {
		addLang: function (lang) {
			LANGUAGES[lang] = getLang.apply(null, arraySlice.call(arguments, 1));
		},
		getLangs: function () {
			var result = Object.keys(LANGUAGES).map(function (lang) {
				return langMap[lang] || lang;
			});
			return result.sort();
		},
		execute: execute,
		defaultDoChars: defaultDoChars,
		defaultDoNumber: defaultDoNumber,
		judgeComment4CLike: judgeComment4CLike,
		doComment4CLike: doComment4CLike,
		doBlockComment4CLike: doBlockComment4CLike,
		doHtmlEscape: doHtmlEscape,
		canInNumber: canInNumber,
		isNumber: isNumber,
		canInWord: canInWord,
		isWord: isWord,
		defaultDoBuiltIn: defaultDoBuiltIn,
		defaultIsBuiltIn: defaultIsBuiltIn,
		CLOSE_SPAN: CLOSE_SPAN,
		COMMENT_SPAN: COMMENT_SPAN,
		KEYWORD_SPAN: KEYWORD_SPAN,
		BRACKET_SPAN: BRACKET_SPAN,
		STRING_SPAN: STRING_SPAN,
		NUMBER_SPAN: NUMBER_SPAN,
		CHAR_SPAN: CHAR_SPAN,
		REGEXP_SPAN: REGEXP_SPAN,
		OPERATOR_SPAN: OPERATOR_SPAN,
		XMLTAG_SPAN: XMLTAG_SPAN,
		DATA_KEY_SPAN: DATA_KEY_SPAN,
		DATA_VAL_SPAN: DATA_VAL_SPAN,
		DOC_SPAN: DOC_SPAN,
		BUILTIN_FUNC_SPAN: BUILTIN_FUNC_SPAN,
		BUILTIN_VAR_SPAN: BUILTIN_VAR_SPAN,
		QUOT_XML_ENTITY: QUOT_XML_ENTITY,
		LEFT_ANGLE_XML_ENTITY: LEFT_ANGLE_XML_ENTITY,
		RIGHT_ANGLE_XML_ENTITY: RIGHT_ANGLE_XML_ENTITY,
		AMP_XML_ENTITY: AMP_XML_ENTITY,
		SHARP_XML_ENTITY: SHARP_XML_ENTITY,
		AT: AT,
		AND: AND,
		TAB: TAB,
		SHARP: SHARP,
		SLASH: SLASH,
		DQUOTE: DQUOTE,
		QUOTE: QUOTE,
		ASTERISK: ASTERISK,
		COMMA: COMMA,
		SEMICOLON: SEMICOLON,
		COLON: COLON,
		LEFT_BRACKET: LEFT_BRACKET,
		RIGHT_BRACKET: RIGHT_BRACKET,
		LEFT_ANGLE: LEFT_ANGLE,
		RIGHT_ANGLE: RIGHT_ANGLE,
		POINT: POINT,
		EQUALS: EQUALS,
		HYPHEN: HYPHEN,
		ZERO_WIDTH: ZERO_WIDTH,
		SPACE_REGX: SPACE_REGX,
		BRACEKT_REGX: BRACEKT_REGX
	});
})();
