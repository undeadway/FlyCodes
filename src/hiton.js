/**
 * HitOn 单独出来的入口文件
 * 但因为仅仅包含 HitOn 的语法，所以没有任何插件（或者说只有语言支持的最基础功能）
 */
Coralian.setToGlobal("HitOn", require("./lib/HitOn"));