require("coralian");
require("../src/index");
require("flyhighlighter");
FlyCodes.setHighLighter(FlyHighLighter.execute);

var fs = require("fs");

var src = fs.readFileSync("./test/test.hiton", "utf-8");

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

FlyCodes.addPlugIn({
	queue: [
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
	]
});

let output = FlyCodes.toHTML(src, "HitOn");

let html = `<html><head>
<title>测试</title>
<link rel="stylesheet" type="text/css" href="./style.css" />
<link rel="stylesheet" type="text/css" href="./../demo/FlyShow.css" />
<link rel="stylesheet" type="text/css" href="./../demo/FlyHighLighter.css" />
</head>
<body>
${output}
</body></html>`;

fs.writeFileSync("./test/output.html", html);