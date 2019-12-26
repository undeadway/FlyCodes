![](./demo/HitOn.jpg)

# Chinese

## 关于
这是一个前台富文本编辑器的代码解析器。

## 产物
最终生成`FlyCodes.js`和`HitOn.js`两个文件。  
FlyCodes.js 能用于浏览器，也可用于node端。

### 安装

#### node端
node 端只要执行`npm install flycodes`命令即可。

#### 浏览器
将dist文件夹下的两个文件复制到js目录中，然后将文件引入进网页即可。
```
<script type="text/javascript" src="js/flycodes.js"></script>
```

### HitOn

HitOn是我自己开发的一个类Markdown文本标记语言。  
可以独立于FlyCodes使用。[介绍看这里（中文）](http://wpl.waygc.net#prj=hiton)  
虽然HitOn 可以独立于FlyCodes使用，但FlyCodes已经包含HitOn的实现，所以如果已经下载了`FlyCodes.js`，则不用再下载`HitOn.js`。  
node 端的 `HitOn`没有单独创建工程，直接引用`FlyCodes`或者将编译好的 `HitOn.js`导入到工程中即可。

#### 旧版本兼容
HitOn维持旧版本兼容（此处特指HitOn)。


# English

# About
This is a parser of rich text editor created by myself.

## Output
The output are the files of `FlyCodes.js` and `HitOn.js`.  
`FlyCodes.js` used on browsers, node side could used as `require("flycodes")` immediately.

### Install
#### node side
At the node side, run the command of `npm install flycodes`.

#### browser
At the browser, copy the output files of dist folder to script folder.  
```
<script type="text/javascript" src="js/flycodes.js"></script>
```

### HitOn

HitOn is a markdown likely text mark language.  
It could used without FlyCodes. [See about here(Chinese)](http://wpl.waygc.net#prj=hiton)HitOn)
Although, `HitOn` could used independently, but `FlyCodes.js` has contaned it. 
