# Chinese

## 关于
这是一个前台富文本编辑器的代码解析器。

## 产物
最终生成`FlyCOdes.js`和`HitOn.js`两个文件。  
FlyCodes.js 用于前台使用，node 端直接`require("flycodes")`就可以直接使用。

### 安装
node 端只要执行`npm install flycodes`命令即可。
前端，将dist文件夹下的两个文件复制到js目录中即可。

### HitOn

HitOn是我自己开发的一个类Markdown文本标记语言。  
可以独立于FlyCodes使用。[介绍看这里（中文）](http://wpl.waygc.net#prj=hiton)


# English

# About
This is a parser of rich text editor created by myself.

## Output
The output are the files of `FlyCodes.js` and `HitOn.js`.  
`FlyCodes.js` used for client side, node side could used as `require("flycodes")` immediately.

### Install
At the node side, to run the command of `npm install flycodes`.
At the client, to copy the output files of dist folder to script folder.

### HitOn

HitOn is a markdown likely text mark language.  
It could used without FlyCodes. [See about here(Chinese)](http://wpl.waygc.net#prj=hiton)
