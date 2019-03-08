!function(e){var t={};function r(a){if(t[a])return t[a].exports;var l=t[a]={i:a,l:!1,exports:{}};return e[a].call(l.exports,l,l.exports,r),l.l=!0,l.exports}r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)r.d(a,l,function(t){return e[t]}.bind(null,l));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=5)}([function(e,t){const r=/\n/g;function a(e,t){for(;null!==(matched=e.match(t.regexp));){let r=t.tag.html,a=matched[1],l=t.tag.start+a+t.tag.end;t.replace&&(a=(a=a.replace(t.replace.start.from,t.replace.start.to)).replace(t.replace.end.from,t.replace.end.to));let n=`<${r}>${a}</${r}>`;e=e.replace(l,n)}return e}const l={simpleLineCode:e=>{var t=[];return{before:function(r){for(;e.regexp.test(r);){let a=RegExp.$1;r=r.replace(e.tag.start+a+e.tag.end,"{lineCode"+t.length+"}"),t.push('<code class="code">'+a+"</code>")}return r},after:function(e){return Array.forEach(t,function(t,r){e=e.replace(new RegExp("\\{lineCode"+t+"\\}","g"),r)}),e}}},escapeSequence:e=>{var t=[];return{before:function(r){for(;e.test(r);)r=r.replace(e,"{backslash"+t.length+"}"),t.push(RegExp.$1);return r},after:function(e){return Object.forEach(t,function(t,r){e=e.replace(new RegExp("\\{backslash"+t+"\\}","g"),r)}),e}}}};e.exports={create:(e,t)=>{return{toHTML:(n,c)=>{let{queue:s,aspect:i,object:o}=c,p=[];return i&&Array.forEach(i,(e,t)=>{let r=t.method(t.object);n=r.before(n),p.push(r)}),t.aspect&&Object.forEach(t.aspect,(e,t)=>{let r=l[e](t);r&&(n=r.before(n),p.push(r))}),n=e(n),t.object&&Array.forEach(t.object,(e,t)=>{n=a(n,t)}),o&&Array.forEach(o,(e,t)=>{n=a(n,t)}),Array.forEach(p,(e,t)=>{n=t.after(n)}),t.queue&&Array.forEach(t.queue,(e,t)=>{n=t(n)}),s&&Array.forEach(s,(e,t)=>{n=t(n)}),function(e){try{e=decodeURIComponent(e)}catch(e){}return e}(n=n.replace(r,"<br />"))}}}}},function(e,t){let r=FlyHighLighter.execute;var a={regexp:/```(.*[\r\n]+)((.|\s)*?)```/,code:"$2",name:"$1"};function l(){let e=[];return{before:function(t){for(;a.regexp.test(t);){var l,n=RegExp[a.code],c=RegExp[a.name];l=c?"```"+c+n+"```":"```"+n+"```",t=t.replace(l,"[toCode"+e.length+"]"),n=r(n,String.trim(c)),e.push(n)}return t},after:function(t){return Object.forEach(e,function(e,r){t=t.replace("[toCode"+e+"]",r)}),t}}}e.exports=(()=>[l()])},function(e,t,r){const a=/\n(\n(>(.*)\n)+)/,l=/\n>/g,n="引用";var c=function(){const e=/(\*+\. (.)+\n)+/,t=/([0-9]+\. (.)+\n)+/,r=/([a-z]+\. (.)+\n)+/,a=/[0-9]+\. /g,l=/[a-z]+\. /g,n=/\*+\. /g,c=/\n/g,s="<li>",i="</li>";function o(e,t,r,a,l){var n=t.replace(r,s);return n=n.replace(c,i),e.replace(t,a+n+l)}return function(c){for(;null!==(matches=c.match(e));)c=o(c,matches[0],n,"<ul>","</ul>");for(;null!==(matches=c.match(t));)c=o(c,matches[0],a,'<ol class="list_type_1">',"</ol>");for(;null!==(matches=c.match(r));)c=o(c,matches[0],l,'<ol class="list_type_a">',"</ol>");return c}}();const s=/\[#([0-9,A-F]{6})\|((.|\s)*?)\]/i;const i=/#\(((.|\s)*?)\)/;const o=/\$\(((.|\s)*?)\)/;const p=/(\|(.)+\|\n)+/,g=/\|/g,u="</tr><tr>",h="</td><td>",f="<td>",m='<table class="table"><tr>',d="</tr></table>";const $=/\\\//;const b=/\/\*((.|\s)*?)\*\//g,E=/\/((.|\s){1,})\//g,_=/!((.|\s)*?)!/g,v=/-((.|\s)*?)-/g,y=/_((.|\s)*?)_/g,R=/\n>>((.|\s)+?)<<\n/,x=/\n\|\:((.|\s)+?)<<\n/,w=/\n>>((.|\s)+?)\:\|\n/,A=/\?\(([1-9]([0-9]?)):((.|\s)*?)\)/,S=/###### (.*?)(\n|$)/g,k=/##### (.*?)(\n|$)/g,j=/#### (.*?)(\n|$)/g,O=/### (.*?)(\n|$)/g,T=/## (.*?)(\n|$)/g,z=/# (.*?)(\n|$)/g,L='<div class="align_center">$1</div>',C='<div class="align_left">$1</div>',I='<div class="align_right">$1</div>';e.exports=commons=r(0).create(e=>{e=e.replace(b,String.BLANK);let t=function(e){let t=[];return{before:e=>{for(;i.test(e);){var r=RegExp.$1,a=r.split("|"),l=a[0],n='<a href="'+l+'"';n+=' title="'+(4===a.length&&a[2]||l)+'"';var c=a[4===a.length?3:2];c&&(n+=' target="_'+c+'"'),n+=">",n+=a[1]||l,n=(n+="</a>").replace(/<\/?em>/g,"/"),e=e.replace("#("+r+")",`{links~${t.length}}`),t.push(n)}return e},after:e=>(Array.forEach(t,(t,r)=>{e=e.replace(`{links~${t}}`,r)}),e)}}(),r=function(e){let t=[];return{before:e=>{for(;o.test(e);){var r=RegExp.$1,a=r.split("|"),l=a[0].replace(/<\/?(em)>/g,"/"),n='<img src="'+(l=(l=l.replace(/<\/?(ins)>/g,"_")).replace(/<\/?(del)>/g,"-"))+'"';n+=' title="'+(a[1]||l)+'"',a[2]&&(n+=' width="'+a[2]+'"'),a[3]&&(n+=' height="'+a[3]+'"'),n+=' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />',e=e.replace("$("+r+")",`{images~${t.length}}`),t.push(n)}return e},after:e=>(Array.forEach(t,(t,r)=>{e=e.replace(`{images~${t}}`,r)}),e)}}(),N=function(){let e=[];return{before:t=>{for(;null!==(matches=t.match(R));){let r=matches[0],a=r.replace(R,L);t=t.replace(r,`{align~${e.length}}`),e.push(a)}for(;null!==(matches=t.match(x));){let r=matches[0],a=r.replace(x,C);t=t.replace(r,`{align~${e.length}}`),e.push(a)}for(;null!==(matches=t.match(w));){let r=matches[0],a=r.replace(w,I);t=t.replace(r,`{align~${e.length}}`),e.push(a)}return t},after:t=>(Array.forEach(e,(e,r)=>{t=t.replace(`{align~${e}}`,r)}),t)}}(),P=function(){let e=[];return{before:t=>{for(;null!==(matches=t.match($));){let r=matches[0];t=t.replace(r,`{escape~${e.length}}`),e.push(r)}return t},after:t=>(Array.forEach(e,(e,r)=>{t=t.replace(`{escape~${e}}`,r)}),t)}}();return e=t.before(e),e=r.before(e),e=P.before(e),e=(e=(e=N.before(e)).replace(E,"<em>$1</em>")).replace(y,"<ins>$1</ins>"),e=t.after(e),e=r.after(e),e=N.after(e),e=(e=(e=function(e){for(;a.test(e);){let t=RegExp.$1.replace(l,"\n"),r=(t=t.slice(1)).indexOf("\n"),c=t.slice(0,r),s=String.startsWith(c,"(")&&String.endsWith(c,")"),i=s?c.slice(1,c.length-1):n,o=s?t.slice(r+1):t;e=e.replace(a,`<fieldset><legend>${i}</legend>${o}</fieldset>`)}return e}(e=P.after(e))).replace(_,"<strong>$1</strong>")).replace(v,"<del>$1</del>"),e=(e=(e=(e=(e=(e=(e=function(e){for(;s.test(e);){var t,r=RegExp.$1,a=RegExp.$2,l=a.split("|");t=2===l.length?'<span class="'+l[0]+"_"+r+'">'+l[1]+"</span>":'<span class="color_'+r+'">'+l[0]+"</span>",e=e.replace("[#"+r+"|"+a+"]",t)}return e}(e=(e=function(e){for(;null!==(matches=e.match(p));){let t=matches[0],r=[];Array.forEach(t.split("\n"),function(e,t){1!==e&&(String.isEmpty(t)||(t=t.slice(1,t.length-1),r.push(f+t.replace(g,h))))});let a=m+r.join(u)+d;e=e.replace(t,a)}return e}(e=c(e))).replace(A,'<span class="size_$1">$3</span>'))).replace(S,'<h1 class="h6">$1</h1>')).replace(k,'<h1 class="h5">$1</h1>')).replace(j,'<h1 class="h4">$1</h1>')).replace(O,'<h1 class="h3">$1</h1>')).replace(T,'<h1 class="h2">$1</h1>')).replace(z,'<h1 class="h1">$1</h1>')},{aspect:{simpleLineCode:{regexp:/`((^`)+?)`/,tag:{start:"`",end:"`"}},escapeSequence:/\\(\S)/}}),commons.clear=(e=>e)},function(e,t,r){Coralian.dom.newXmlWrapper,Coralian.ReplaceHolder.htmlEscape,String.BLANK,Number.isNumber,Coralian.Formatter.formatFileSize;let a=r(1);var l,n,c,s,i,o,p=["黑线","怒","眼泪","炸毛","蛋定","微笑","汗","囧","卧槽","坏笑","鼻血","大姨妈","瞪眼","你说啥","一脸血","害羞","大好","喝茶看戏","美～","笑岔","中箭","呕","撇嘴","碎掉","吐舌头","纳尼","泪流满面","升仙","扭曲","闪闪亮","山","寨","基","惊","头顶青天","不错","吃屎","牛","严肃","作死","帅","腹黑","喜闻乐见","呵呵呵","！","？","吓尿了","嘁","闪电","S1","战斗力爆表","贼笑","嗯...","喵","奸笑"];e.exports=(l={PRE_REGEXP:/\[\[((.|\s)*?)\]\]/,PRE_START_TAG:"[[",PRE_END_TAG:"]]"},n=function(){const e=/(\|(.)+\|\n)+/,t=/\<td\>\n\<\/td\>/g;return VERTICAL_BAR=/\|/g,function(r){for(;null!==(matches=r.match(e));){let e=matches[0],a=e.replace(VERTICAL_BAR,"</td><td>");a='<table class="table"><tr>'+(a=a.replace(t,"</tr><tr>")).slice(5,a.length-5)+"</tr></table>",r=r.replace(e,a)}return r}}(),c=function(){const e=/(\*+\. (.)+\n)+/,t=/([0-9]+\. (.)+\n)+/,r=/([a-z]+\. (.)+\n)+/,a=/[0-9]+\. /g,l=/[a-z]+\. /g,n=/\*+\. /g,c=/\n/g,s="<li>",i="</li>";function o(e,t,r,a,l){var n=t.replace(r,s);return n=n.replace(c,i),e.replace(t,a+n+l)}return function(c){for(;null!==(matches=c.match(e));)c=o(c,matches[0],n,"<ul>","</ul>");for(;null!==(matches=c.match(t));)c=o(c,matches[0],a,'<ol class="list_type_1">',"</ol>");for(;null!==(matches=c.match(r));)c=o(c,matches[0],l,'<ol class="list_type_a">',"</ol>");return c}}(),s=/\\(.)/,i=/\n{2,}/,o=/\n{2,}/g,{toHTML:function(e){let t=a();return t&&Object.forEach(t,function(t,r){e=r.before(e)}),e=(e=e.replace(/</g,"&lt;")).replace(/>/g,"&gt;"),e=function(e){for(var t=0,r=p.length;t<r;t++){var a=p[t],l=new RegExp("\\["+a+"\\]","g");l.test(e)&&(e=e.replace(l,'<img src="/res/flies/face/'+(100+t)+'.gif" title="'+a+'" />'))}return e}(e=this.parse(e)),t&&Object.forEach(t,function(t,r){e=r.after(e)}),function(e){try{e=decodeURIComponent(e)}catch(e){}return e}(e=e.replace(/\<\/(p|pre)\>\n/,"</$1>"))},parse:function(e){var t,r,a=(t=[],{before:function(e){for(;s.test(e);)e=e.replace(s,"{backslash"+t.length+"}"),t.push(RegExp.$1);return e},after:function(e){return Object.forEach(t,function(t,r){e=e.replace(new RegExp("\\{backslash"+t+"\\}","g"),r)}),e}}),p=(r=[],{before:function(e){for(;/`((.)*?)`/.test(e);){let t=RegExp.$1;e=e.replace("`"+t+"`","[lineCode"+r.length+"]"),r.push('<code class="code">'+t+"</code>")}return e},after:function(e){return Object.forEach(r,function(t,r){e=e.replace(new RegExp("\\[lineCode"+t+"\\]","g"),r)}),e}});e=p.before(e),e=(e=(e=(e=(e=(e=function(e){for(;/\n&gt;( (.|\s)*?|)\n((.|\s)*?)(\n{2}|$)/.test(e);){var t=RegExp.$1||"引用",r=RegExp.$3,a="\n&gt;"+RegExp.$1+"\n"+r+RegExp.$5,l='<fieldset class="fieldset"><legend>'+String.trim(t)+"</legend>"+r+"</fieldset>";e=e.replace(a,l)}return e}(e=(e=(e=a.before(e)).replace(/\/\*((.|\s)*?)\*\//g,"")).replace(/\/((.|\s){1,})\//g,"<em>$1</em>"))).replace(/!((.|\s)*?)!/g,"<strong>$1</strong>")).replace(/\[\-:((.|\s)*?)\]/g,"<input type=checkbox name=$1 />")).replace(/\[\+:((.|\s)*?)\]/g,"<input type=checkbox checked=checked name=$1 />")).replace(/-((.|\s)*?)-/g,"<del>$1</del>")).replace(/_((.|\s)*?)_/g,"<ins>$1</ins>"),e=c(e),e=(e=(e=(e=(e=(e=(e=function(e){for(;/\$\(((.|\s)*?)\)/.test(e);){var t=RegExp.$1,r=t.split("|"),a=r[0].replace(/<\/?(em)>/g,"/"),l='<img src="'+(a=(a=a.replace(/<\/?(ins)>/g,"_")).replace(/<\/?(del)>/g,"-"))+'"';l+=' title="'+(r[1]||a)+'"',r[2]&&(l+=' width="'+r[2]+'"'),r[3]&&(l+=' height="'+r[3]+'"'),l+=' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />',e=e.replace("$("+t+")",l)}return e}(e=function(e){for(;/#\(((.|\s)*?)\)/.test(e);){var t=RegExp.$1,r=t.split("|"),a=r[0],l='<a href="'+a+'"';l+=' title="'+(4===r.length&&r[2]||a)+'"';var n=r[4===r.length?3:2];n&&(l+=' target="_'+n+'"'),l+=">",l+=r[1]||a,l=(l+="</a>").replace(/<\/?em>/g,"/"),e=e.replace("#("+t+")",l)}return e}(e=function(e){for(;/\[#([0-9,A-F]{6})\|((.|\s)*?)\]/i.test(e);){var t,r=RegExp.$1,a=RegExp.$2,l=a.split("|");t=2===l.length?'<span class="'+l[0]+"_"+r+'">'+l[1]+"</span>":'<span class="color_'+r+'">'+l[0]+"</span>",e=e.replace("[#"+r+"|"+a+"]",t)}return e}(e=(e=function(e,t,r,a){for(;t.test(e);){var l=RegExp.$1,n=r+l+a,c="<ruby>"+(l=(l=l.replace(/\(/g,"<rp>(</rp><rt>")).replace(/\)/g,"</rt><rp>)</rp>"))+"</ruby>";e=e.replace(n,c)}return e}(e=(e=(e=(e=n(e)).replace(/\n&gt;&gt;((.|\s)+)&lt;&lt;\n/g,'<div class="align_center">$1</div>')).replace(/\n\|\:((.|\s)+)&lt;&lt;\n/g,'<div align="align_left">$1</div>')).replace(/\n&gt;&gt;((.|\s)+)\:\|\n/g,'<div align="align_right">$1</div>'),/\{\{((.|\s)*?)\}\}/,"{{","}}")).replace(/\?\(([1-9]([0-9]?)):((.|\s)*?)\)/,'<span class="size_$1">$3</span>'))))).replace(/###### (.*?)(\n|$)/g,'<h6 class="h6">$1</h6>')).replace(/##### (.*?)(\n|$)/g,'<h5 class="h5">$1</h5>')).replace(/#### (.*?)(\n|$)/g,'<h4 class="h4">$1</h4>')).replace(/### (.*?)(\n|$)/g,'<h3 class="h3">$1</h3>')).replace(/## (.*?)(\n|$)/g,'<h2 class="h2">$1</h2>')).replace(/# (.*?)(\n|$)/g,'<h1 class="h1">$1</h1>');var g=function(e){var t=[];return{before:function(r){for(;e.PRE_REGEXP.test(r);){var a=RegExp.$1;r=r.replace(e.PRE_START_TAG+a+e.PRE_END_TAG,"{pre"+t.length+"}"),t.push('<pre class="pre">'+a+"</pre>")}return r},after:function(e){return Object.forEach(t,function(t,r){e=e.replace("{pre"+t+"}",r)}),e}}}(l);return e=(e=function(e){return i.test(e)&&(e=e.replace(i,"<p>"),i.test(e)&&(e=e.replace(o,"</p><p>")),e+="</p>"),e=e.replace(/\<p\>\<\/p\>/g,"")}(e=g.before(e))).replace(/\n/g,"<br />"),e=g.after(e),e=a.after(e),e=p.after(e)},clear:function(e){return e}})},function(e,t,r){Coralian.dom.newXmlWrapper;var a=String.BLANK;Number.isNumber,Coralian.Formatter.formatFileSize;let l=r(1);const n="<br />";const c=["黑线","怒","眼泪","炸毛","蛋定","微笑","汗","囧","卧槽","坏笑","鼻血","大姨妈","瞪眼","你说啥","一脸血","害羞","大好","喝茶看戏","美～","笑岔","中箭","呕","撇嘴","碎掉","吐舌头","纳尼","泪流满面","升仙","扭曲","闪闪亮","山","寨","基","惊","头顶青天","不错","吃屎","牛","严肃","作死","帅","腹黑","喜闻乐见","呵呵呵","！","？","吓尿了","嘁","闪电","S1","战斗力爆表","贼笑","嗯...","喵","奸笑"];e.exports=function(){var e={PRE_REGEXP:/\[\[((.|\s)*?)\]\]/,PRE_START_TAG:"[[",PRE_END_TAG:"]]"};let t=/\\(.)/;var r=function(){const e=/(\|(.)+\|\n)+/,t=/\|/g;return function(r){for(;null!==(matches=r.match(e));){let e=[],a=matches[0];Array.forEach(a.split("\n"),(r,a)=>{1!==r&&(String.isEmpty(String.trim(a))||(e.push("<tr><td>"),e.push(a.slice(1,a.length-1).replace(t,"</td><td>")),e.push("</td></tr>")))});let l='<table class="table">'+e.join("")+"</table>";r=r.replace(a,l)}return r}}(),s=function(){const e=/(\*+\. (.)+\n)+/,t=/([0-9]+\. (.)+\n)+/,r=/([a-z]+\. (.)+\n)+/,a=/[0-9]+\. /g,l=/[a-z]+\. /g,n=/\*+\. /g,c=/\n/g,s="<li>",i="</li>";function o(e,t,r,a,l){var n=t.replace(r,s);return n=n.replace(c,i),e.replace(t,a+n+l)}return function(c){for(;null!==(matches=c.match(e));)c=o(c,matches[0],n,"<ul>","</ul>");for(;null!==(matches=c.match(t));)c=o(c,matches[0],a,'<ol class="list_type_1">',"</ol>");for(;null!==(matches=c.match(r));)c=o(c,matches[0],l,'<ol class="list_type_a">',"</ol>");return c}}();const i=/\n((&gt;(.*)\n)+)/,o=/\n&gt;/g,p="引用",g=/\[#([0-9,A-F]{6})\|((.|\s)*?)\]/i,u=/#\(((.|\s)*?)\)/,h=/\$\(((.|\s)*?)\)/,f=/`((.)*?)`/,m=/\/\*((.|\s)*?)\*\//g,d=/\/((.|\s){1,})\//g,$=/!((.|\s)*?)!/g,b=/\[\-:((.|\s)*?)\]/g,E=/\[\+:((.|\s)*?)\]/g,_=/-((.|\s)*?)-/g,v=/_((.|\s)*?)_/g,y=/\n&gt;&gt;((.|\s)+)&lt;&lt;\n/g,R=/\n\|\:((.|\s)+)&lt;&lt;\n/g,x=/\n&gt;&gt;((.|\s)+)\:\|\n/g,w=/\{\{((.|\s)*?)\}\}/,A=/\?\(([1-9]([0-9]?)):((.|\s)*?)\)/,S=/###### (.*?)(\n|$)/g,k=/##### (.*?)(\n|$)/g,j=/#### (.*?)(\n|$)/g,O=/### (.*?)(\n|$)/g,T=/## (.*?)(\n|$)/g,z=/# (.*?)(\n|$)/g,L=/\n/g,C=/</g,I=/>/g,N="<em>$1</em>",P="<strong>$1</strong>",G="<input type=checkbox checked=checked name=$1 />",X="<input type=checkbox name=$1 />",q="<del>$1</del>",B="<ins>$1</ins>",F='<div class="align_center">$1</div>',M='<div align="align_left">$1</div>',D='<div align="align_right">$1</div>',H='<span class="size_$1">$3</span>',W='<h1 class="h6">$1</h1>',U='<h1 class="h5">$1</h1>',K='<h1 class="h4">$1</h1>',V='<h1 class="h3">$1</h1>',J='<h1 class="h2">$1</h1>',Q='<h1 class="h1">$1</h1>';function Y(l){var c,C,I=(c=[],{before:function(e){for(;t.test(e);)e=e.replace(t,"{backslash"+c.length+"}"),c.push(RegExp.$1);return e},after:function(e){return Object.forEach(c,function(t,r){e=e.replace(new RegExp("\\{backslash"+t+"\\}","g"),r)}),e}}),Y=(C=[],{before:function(e){for(;f.test(e);){let t=RegExp.$1;e=e.replace("`"+t+"`","[lineCode"+C.length+"]"),C.push('<code class="code">'+t+"</code>")}return e},after:function(e){return Object.forEach(C,function(t,r){e=e.replace(new RegExp("\\[lineCode"+t+"\\]","g"),r)}),e}});l=Y.before(l),l=(l=(l=(l=(l=(l=function(e){for(;i.test(e);){let t=RegExp.$1.replace(o,"\n"),r=(t=t.slice(4)).indexOf("\n"),a=t.slice(0,r),l=a.startsWith("(")&&a.endsWith(")"),n=l?a.slice(1,a.length-1):p,c=l?t.slice(r+1):t;e=e.replace(i,`<fieldset><legend>${n}</legend>${c}</fieldset>`)}return e}(l=(l=(l=I.before(l)).replace(m,a)).replace(d,N))).replace($,P)).replace(b,X)).replace(E,G)).replace(_,q)).replace(v,B),l=s(l),l=(l=(l=(l=(l=(l=(l=function(e){for(;h.test(e);){var t=RegExp.$1,r=t.split("|"),a=r[0].replace(/<\/?(em)>/g,"/"),l='<img src="'+(a=(a=a.replace(/<\/?(ins)>/g,"_")).replace(/<\/?(del)>/g,"-"))+'"';l+=' title="'+(r[1]||a)+'"',r[2]&&(l+=' width="'+r[2]+'"'),r[3]&&(l+=' height="'+r[3]+'"'),l+=' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />',e=e.replace("$("+t+")",l)}return e}(l=function(e){for(;u.test(e);){var t=RegExp.$1,r=t.split("|"),a=r[0],l='<a href="'+a+'"';l+=' title="'+(4===r.length&&r[2]||a)+'"';var n=r[4===r.length?3:2];n&&(l+=' target="_'+n+'"'),l+=">",l+=r[1]||a,l=(l+="</a>").replace(/<\/?em>/g,"/"),e=e.replace("#("+t+")",l)}return e}(l=function(e){for(;g.test(e);){var t,r=RegExp.$1,a=RegExp.$2,l=a.split("|");t=2===l.length?'<span class="'+l[0]+"_"+r+'">'+l[1]+"</span>":'<span class="color_'+r+'">'+l[0]+"</span>",e=e.replace("[#"+r+"|"+a+"]",t)}return e}(l=(l=function(e,t,r,a){for(;t.test(e);){var l=RegExp.$1,n=r+l+a,c="<ruby>"+(l=(l=l.replace(/\(/g,"<rp>(</rp><rt>")).replace(/\)/g,"</rt><rp>)</rp>"))+"</ruby>";e=e.replace(n,c)}return e}(l=(l=(l=(l=r(l)).replace(y,F)).replace(R,M)).replace(x,D),w,"{{","}}")).replace(A,H))))).replace(S,W)).replace(k,U)).replace(j,K)).replace(O,V)).replace(T,J)).replace(z,Q);var Z=function(e){var t=[];return{before:function(r){for(;e.PRE_REGEXP.test(r);){var a=RegExp.$1;r=r.replace(e.PRE_START_TAG+a+e.PRE_END_TAG,"{pre"+t.length+"}"),t.push('<pre class="pre">'+a+"</pre>")}return r},after:function(e){return Object.forEach(t,function(t,r){e=e.replace("{pre"+t+"}",r)}),e}}}(e);return l=(l=Z.before(l)).replace(L,n),l=Z.after(l),l=I.after(l),l=Y.after(l)}return{toHTML:function(e){let t=l();return t&&Object.forEach(t,function(t,r){e=r.before(e)}),e=function(e){for(var t=0,r=c.length;t<r;t++){var a=c[t],l=new RegExp("\\["+a+"\\]","g");l.test(e)&&(e=e.replace(l,'<img src="/res/flies/face/'+(100+t)+'.gif" title="'+a+'" />'))}return e}(e=Y(e=(e=e.replace(C,"&lt;")).replace(I,"&gt;"))),t&&Object.forEach(t,function(t,r){e=r.after(e)}),function(e){try{e=decodeURIComponent(e)}catch(e){}return e}(e=e.replace(/\<\/(p|pre)\>\n/,"</$1>"))},clear:function(e){return e}}}()},function(e,t,r){let a="HitOn",l={ubbcode:r(6),HitOn:r(2)},n=new Proxy(l,{get:(e,t)=>String.startsWith(t,a)&&t!==a?r(7)("./"+t.split("_")[1]):e[t]}),c=null;function s(e){let t=[];return{before:r=>{if(c)for(;e.regexp.test(r);){let a=RegExp[e.name],l=RegExp[e.code],n=e.withLang(a,l);r=r.replace(n,"{toCode"+t.length+"}"),l=c(l,a),t.push(l)}return r},after:e=>(c&&Array.forEach(t,(t,r)=>{e=e.replace("{toCode"+t+"}",r)}),e)}}const i=["黑线","怒","眼泪","炸毛","蛋定","微笑","汗","囧","卧槽","坏笑","鼻血","大姨妈","瞪眼","你说啥","一脸血","害羞","大好","喝茶看戏","美～","笑岔","中箭","呕","撇嘴","碎掉","吐舌头","纳尼","泪流满面","升仙","扭曲","闪闪亮","山","寨","基","惊","头顶青天","不错","吃屎","牛","严肃","作死","帅","腹黑","喜闻乐见","呵呵呵","！","？","吓尿了","嘁","闪电","S1","战斗力爆表","贼笑","嗯...","喵","奸笑"],o={"宋体":"song","仿宋":"fsong","楷体":"kai","魏碑":"weibei","隶书":"lishu","黑体":"hei",Arial:"arial","Courier New":"couriernew","MS PGothic":"mspgothic","MS PMincho":"mspmincho",Tahoma:"tahoma","Times New Roman":"timesnewroman"};let p=[e=>{for(var t=0,r=i.length;t<r;t++){var a=i[t],l=new RegExp("\\["+a+"\\]","g");l.test(e)&&(e=e.replace(l,'<img src="/res/flies/face/'+(100+t)+'.gif" title="'+a+'" />'))}return e},e=>{for(var t in o){var r=new RegExp("\\[font="+t+"\\]","g");r.test(e)&&(e=e.replace(r,'<span class="font_'+o[t]+'">'))}return e}],g={ubbcode:{aspect:[{method:s,object:{regexp:/\[code(=((.|\s)*?))?\]((.|\s)*?)\[\/code\]/,code:"$4",name:"$2",withLang:(e,t)=>e?`[code=${e}]${t}[/code]`:`[code]${t}[/code]`}}],queue:p},HitOn:{aspect:[{method:s,object:{regexp:/```(.*[\r\n]+)((.|\s)*?)```/,code:"$2",name:"$1",withLang:(e,t)=>e?"```"+e+t+"```":"```"+t+"```"}}],queue:p}};Coralian.setToGlobal("FlyCodes",{setHighLighter:e=>{c=e},toHTML:(e,t)=>{if(!t)return e;"UBB"===t&&(t="ubbcode");try{return e=(e=e.replace(/\r\n/g,"\n")).replace(/\r/g,"\n"),n[t].toHTML(e,function(e){return String.startsWith(e,a)&&(e=a),g[e]}(t))}catch(t){return Coralian.logger.err(t),`<pre>${e}</pre>`}},ed2k:{change:function(e){document.getElementById("ed2k_"+e)},downloadSelected:function(e){document.getElementById("ed2k_"+e)},selectAll:function(){}}})},function(e,t,r){let a=String.BLANK,l=(Number.isNumber,Coralian.Formatter.formatFileSize,function(){const e=/align=(left|center|right|justify)/,t=/(width|height)=(\d+)/,r=/size=\((\d+),(\d+)\)/,a=' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />';function l(l,n){let c=!1,s=!1;if(null!==(matched=l.match(e))&&(n+=' class="flyimg img_'+matched[1]+'"'),null!==(matched=l.match(t))&&(c=!0,n+=" "+matched[1]+'="'+matched[2]+'"'),null!==(matched=l.match(r))&&(s=!1,n+=' width="'+matched[1]+'" height="'+matched[2]+'"'),c&&s)throw new Error("不能同时指定 size 和 with 或 height。");return n+=a}const n=/\[img (align|size|width|height)=([^\[]+)\]([^\[]+)\[\/img\]/,c=/\[img=([^\[]*) (align|size|width|height)=([^\[]+)\]([^\[]+)\[\/img\]/,s=/\[img=([^\[]*)\](.+?)\[\/img\]/g,i=/\[img\]([^\[]*)\[\/img\]/g;return function(e){for(;null!==(matched=e.match(n));){let t="[img "+matched[1]+"="+matched[2]+"]"+matched[3]+"[/img]",r='<img src="'+matched[3]+'"';e=e.replace(t,l(t,r))}for(;null!==(matched=e.match(c));){let t="[img="+matched[1]+" "+matched[2]+"="+matched[3]+"]"+matched[4]+"[/img]",r='<img src="'+matched[1]+'" title="'+matched[4]+'"';e=e.replace(t,l(t,r))}return e=(e=e.replace(i,'<img class="flyimg" title="$1" src="$1" onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />')).replace(s,'<img class="flyimg" src="$1" title="$2" onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />')}}()),n=function(){function e(e,t){if(t=t||"ul",String.isEmpty(e))return e;return(e=e.split("[*]")).shift(),"<"+t+"><li>"+e.join("</li><li>")+"</li></"+t+">"}const t=/\[list\]((.|\s)*?)\[\/list\]/,r=/\[list=(a|A|1|\*|#|o|i|I|α|一|あ|ア)( [^\[]+)*\]((.|\s)*?)\[\/list\]/;return function(l){for(;null!==(matched=l.match(t));)l=l.replace("[list]"+matched[1]+"[/list]",e(matched[1]));for(;null!==(matched=l.match(r));){let t,r=matched[1];if(params=matched[2]||String.BLANK,outParam=a,inner=matched[3],className="list_type_",!String.isEmpty(params)){if(params=params.split(" "),params.length>2)throw new Error("参数个数不正确");for(let e=0;e<2;e++)if("reversed"===params[e])outParam+=" reversed";else{if(!String.startsWith(params[e],"start"))throw new Error("参数不正确");outParam+=' start="'+params[e].last()+'"'}}switch(r){case"#":className+="square";break;case"*":className+="disc";break;case"o":className+="circle";break;case"α":className+="greek",t="ol";break;case"一":className+="shuzi",t="ol";break;case"あ":className+="hira",t="ol";break;case"ア":className+="kata",t="ol";break;default:t="ol",className+=r}l=l.replace("[list="+r+params+"]"+inner+"[/list]",e(inner,t))}return l}}();const c=/\[url]((.|\s)*?)\[\/url\]/g,s=/\[url target=([^\[]*)\]((.|\s)*?)\[\/url\]/g,i=/\[url=([^\[]*) target=([^\[]*)\]((.|\s)*?)\[\/url]/g,o=/\[url=([^\[]*)\]((.|\s)*?)\[\/url\]/g,p='<a href="$1">$1</a>',g='<a href="$2" title="$2" target="_$1">$2</a>',u='<a href="$1" title="$1" target="_$2">$3</a>',h='<a href="$1" title="$2">$2</a>';let f=function(){let e={bilibili:function(e,t){return t=t||1,'<iframe class="h5video" src="https://www.bilibili.com/blackboard/player.html?aid='+e.replace("av","")+'" scrolling="no" border="0" framespacing="0" frameborder="no"></iframe>'},youku:function(e){return'<iframe  class="h5video" src="http://player.youku.com/embed/'+e+'" frameborder="no"></iframe>'}};const t=/\[h5v=([^\]]+)]([^\]]+)\[\/h5v\]/;function r(t,r,a,l,n){let c=e[a](l,n);return n&&(n=","+n),r=(r=(r=r.replace("%1",a)).replace("%2",l)).replace("%3",n),t.replace(r,c)}return function(e){if(1===arguments.length)for(;null!==(matched=e.match(t));){let t=matched[1],a=matched[2].split(",");e=r(e,"[h5v=%1]%2%3[/h5v]",t,a[0],a[1]||"")}else e=r(e,arguments[1],arguments[2],arguments[3],arguments[4]||"");return e}}();const m=/\[flash=bilibili]([^\[]+)\.swf\?aid=([^\[]+)\[\/flash]/,d=/\[flash]([^\[]+)\[\/flash]/,$='<embed src="$1" allowFullScreen="true" name="movie" value="opaque" width="634" height="440" type="application/x-shockwave-flash" />',b="youku",E="bilibili";const _=/\[(tr|td) ([^\[]+)=([^\[]+)\]/g,v=/\[table ([^\[]+)=([^\[]+)\]/g,y=/\[table\]/g,R=/\[\/table\]/g,x='<$1 $2="$3">',w='<table class="table">',A="</table>";const S=/\[(\/)?(quote|p|table|td|tr|list|align)\]\n\[(\/)?(quote|p|table|td|tr|list|align)/,k=/\[\/(size|color|font|bgcolor)\]/g,j=/\[(\/)?(sub|sup|del|p|tr|td|mark)]/g,O=/\[(\/)?h([1-6])]/g,T=/\[size=(\d+?)]/g,z=/\[(bg|)color=\#([^\[\<]+?)]/g,L=/\[align=(left|center|right|justify)\]((.|\s)*?)\[\/align\]/g,C=/\[u\](.+?)\[\/u]/g,I=/\[quote\]/g,N=/\[quote=([^\]]+)\]/g,P=/\[\/(quote|thunder|magnet)\]/g,G=/\[thunder=([^\]]+)\]([^\[]+)/g,X=/\[magnet=([^\]]+)\]([^\[]+)/g;OLD_BOLD_REGX=/\[b(old)?\](.+?)\[\/b(old)?]/g,OLD_ITALIC_REGX=/\[i(talic)?\](.+?)\[\/i(talic)?]/g,TAIL_EXE_REGX_1=/\<(\/)?(div|fieldset|tr|pre|table|p|h[1-6]|pre|li|ul|ol)\>\<br( \/)?\>/g,TAIL_EXE_REGX_2=/\<br( \/)?\>\<(\/)?(div|fieldset|tr|table|p|h[1-6]|pre|li|ul|ol)/g;e.exports=commons=r(0).create(e=>(e=function(e){for(;null!==(matched=e.match(m));){let t=matched[1],r=matched[2],a=r.split("&amp;page=");e=f(e,"[flash=bilibili]"+t+".swf?aid="+r+"[/flash]",E,a[0],a[1])}for(;null!==(matched=e.match(d));){let t=matched[1],r="[flash]"+t+"[/flash]";if(String.contains(t,b)){let a=t.split("/");e=f(e,r,b,a[a.length-2])}else e=e.replace(d,$)}return e}(e=e.replace(S,"[$1$2][$3$4")),e=(e=(e=function(e){return e=(e=(e=(e=e.replace(_,x)).replace(v,w)).replace(y,w)).replace(R,A)}(e=(e=(e=(e=(e=(e=f(e)).replace(k,"</span>")).replace(j,"<$1$2>")).replace(O,'<$1h$2 class="$1h$2">')).replace(T,'<span class="size_$1">')).replace(z,'<span class="$1color_$2">'))).replace(L,'<div class="align_$1">$2</div>')).replace(C,"<ins>$1</ins>"),e=n(e),e=(e=(e=(e=(e=(e=(e=(e=(e=(e=function(e){return e=(e=(e=(e=e.replace(c,p)).replace(s,g)).replace(i,u)).replace(o,h)}(e=l(e))).replace(I,'<fieldset class="fieldset"><legend>引用</legend><div>')).replace(N,'<fieldset class="fieldset"><legend>$1</legend><div>')).replace(P,"</div></fieldset>")).replace(G,'<fieldset class="fieldset"><legend>迅雷资源</legend><div><a href="$1" title="$2">$2</a>')).replace(X,'<fieldset class="fieldset"><legend>磁力链接</legend><div><a href="$1" title="$2">$2</a>')).replace(OLD_BOLD_REGX,"<strong>$2</strong>")).replace(OLD_ITALIC_REGX,"<em>$2</em>")).replace(TAIL_EXE_REGX_1,"<$1$2>")).replace(TAIL_EXE_REGX_2,"<$2$3")),{object:[{regexp:/\[pre\]((.|\s)*?)\[\/pre\]/,tag:{start:"[pre]",end:"[/pre]",html:"pre"}},{regexp:/\[phonics\]((.|\s)*?)\[\/phonics\]/,tag:{start:"[phonics]",end:"[/phonics]",html:"ruby"},replace:{start:{from:/\(/g,to:"<rp>(</rp> <rt>"},end:{from:/\)/g,to:"</rt><rp>)</rp>"}}}],aspect:{simpleLineCode:{regexp:/\[code\]((.)*?)\[\/code\]/,tag:{start:"[code]",end:"[/code]"}}}}),commons.clear=(e=>e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=e.replace(/\[\/(size|color|font|backcolor)\]/g,a)).replace(/\[(\/)?(sub|flash|sup|underline|i|p|del|b|quote|tucao|magnet|ed2k|thunder)\]/g,a)).replace(/\[\/align\]/g,a)).replace(/\[(\/)?h([1-6])\]/g,a)).replace(/\[align=(left|center|right|justify)\]/g,a)).replace(/\[size=(\d+?)\]/g,a)).replace(/\[(color|bgcolor)=\#([^\[\<]+?)\]/g,a)).replace(/\[font=([^\[\<]+?)\]/g,a)).replace(/\[list=(a|A|1)\](.+?)\[\/list\]/g,"$2")).replace(/\[(\/)?list\]/g,a)).replace(/\[img(\((left|center|right|justify)\)|)\]([^\[]*)\[\/img\]/g,"$1")).replace(/\[url([^\[]*)\]([^\[]+)\[\/url\]/g,"$2"))},function(e,t,r){var a={"./0.0.0":3,"./0.0.0.js":3,"./0.0.1":4,"./0.0.1.js":4,"./plugin":1,"./plugin.js":1};function l(e){var t=n(e);return r(t)}function n(e){if(!r.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}l.keys=function(){return Object.keys(a)},l.resolve=n,e.exports=l,l.id=7}]);