!function(e){var t={};function r(a){if(t[a])return t[a].exports;var l=t[a]={i:a,l:!1,exports:{}};return e[a].call(l.exports,l,l.exports,r),l.l=!0,l.exports}r.m=e,r.c=t,r.d=function(e,t,a){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(r.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)r.d(a,l,function(t){return e[t]}.bind(null,l));return a},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=6)}([function(e,t){function r(e){let t=String.BLANK;for(let r in e){t+=` ${r}="${e[r]}"`}return t}t.compireH5Video=((e,t)=>(function(e,t,a,l){let c=r(t);return`<${a} class="${l}" src="${e}" ${c}></${a}>`})(e,t,"iframe","h5video")),t.compireH5Audio=((e,t)=>e),t.parseEqualToObject=((e,t)=>{for(let r of e){let e=r.split("=");t[e[0]]=e[1]}}),t.compireObjectToXmlAtruibute=r,t.AspectBase=(e=>{let t=[];return{replace:(r,a,l)=>(r=r.replace(a,`{${e}~${t.length}}`),t.push(l),r),after:r=>(Array.forEach(t,(t,a)=>{r=r.replace(`{${e}~${t}}`,a)}),r)}})},function(e,t,r){const a=r(0),l=/\n/g,c=Coralian.constants.HtmlTag.PRE;function n(e,t){for(;null!==(matched=e.match(t.regexp));){let r=t.tag.html,l=a.compireObjectToXmlAtruibute(t.tag.attrs),n=matched[1],s=t.tag.start+n+t.tag.end;r===c&&(n=(n=n.replace("<","&lt;")).replace(">","&gt;")),t.replace&&(n=(n=n.replace(t.replace.start.from,t.replace.start.to)).replace(t.replace.end.from,t.replace.end.to));let i=`<${r}${l}>${n}</${r}>`;e=e.replace(s,i)}return e}const s={simpleLineCode:e=>{let t=a.AspectBase("linecode");return t.before=(r=>{for(;e.regexp.test(r);){let a=RegExp.$1,l=e.tag.start+a+e.tag.end,c=`<code class="code">${a}</code>`;r=t.replace(r,l,c)}return r}),t},escapeSequence:e=>{let t=a.AspectBase("backslash");return t.before=(r=>{for(;e.test(r);){let a=RegExp.$1;r=t.replace(r,e,a)}return r}),t}};e.exports={create:(e,t)=>{return{toHTML:(r,a)=>{let{queue:c,aspect:i,object:o}=a,p=[];return i&&Array.forEach(i,(e,t)=>{let a=t.method(t.object);r=a.before(r),p.push(a)}),t.aspect&&Object.forEach(t.aspect,(e,t)=>{let a=s[e](t);a&&(r=a.before(r),p.push(a))}),r=e(r),t.object&&Array.forEach(t.object,(e,t)=>{r=n(r,t)}),o&&Array.forEach(o,(e,t)=>{r=n(r,t)}),Array.forEach(p,(e,t)=>{r=t.after(r)}),t.queue&&Array.forEach(t.queue,(e,t)=>{r=t(r)}),c&&Array.forEach(c,(e,t)=>{r=t(r)}),function(e){try{e=decodeURIComponent(e)}catch(e){}return e}(r=r.replace(l,"<br />"))}}}}},function(e,t,r){const a=r(0),l=/\n(\n(>(.*)\n)+)/,c=/\n>/g,n="引用";const s=function(){const e=/(\*+\. (.)+\n)+/,t=/([0-9]+\. (.)+\n)+/,r=/([a-z]+\. (.)+\n)+/,a=/[0-9]+\. /g,l=/[a-z]+\. /g,c=/\*+\. /g,n=/\n/g,s="<li>",i="</li>";function o(e,t,r,a,l){var c=t.replace(r,s);return c=c.replace(n,i),e.replace(t,a+c+l)}return function(n){for(;null!==(matches=n.match(e));)n=o(n,matches[0],c,"<ul>","</ul>");for(;null!==(matches=n.match(t));)n=o(n,matches[0],a,'<ol class="list_type_1">',"</ol>");for(;null!==(matches=n.match(r));)n=o(n,matches[0],l,'<ol class="list_type_a">',"</ol>");return n}}(),i=/\[#([0-9,A-F]{6})\|((.|\s)*?)\]/i;const o=/\[(#|@|\$|V|A)\]\(((.|\s)*?)\)/;const p={"#":e=>{let t=e.split("|"),r=t[0],a=t[1]||r,l=4===t.length&&t[2]||r,c=t[4===t.length?3:2],n=`<a href="${r}" title="${l}"`;return c&&(n+=` target="_${c}"`),n+=`>${a}</a>`},"@":e=>{let t=e.split("|"),r=t[0];return`<a href="mailto:${r}">${t[1]||r}</a>`},$:e=>{let t=e.split("|"),r=t[0],a=`<img src="${r}" title="${t[1]||r}"`;return t[2]&&(a+=' width="'+t[2]+'"'),t[3]&&(a+=' height="'+t[3]+'"'),a+=' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />'},V:e=>{let t=e.split("|"),r=t.shift(),l={};return a.parseEqualToObject(t,l),a.compireH5Video(r,l)},A:e=>a.compireH5Audio(e)},g=/(\|(.)+\|\n)+/,u=/\|/g,h="</tr><tr>",f="</td><td>",m="<td>",d="</td>",$='<table class="table"><tr>',b="</tr></table>";const E=/\[\^((\S)+)?\]/;const _=/\\\//;const v=/\/\*((.|\s)*?)\*\//g,y=/\/((.|\s){1,})\//g,x=/!((.|\s)*?)!/g,R=/-((.|\s)*?)-/g,A=/_((.|\s)*?)_/g,j=/\n>>((.|\s)+?)<<\n/,S=/\n\|\:((.|\s)+?)<<\n/,k=/\n>>((.|\s)+?)\:\|\n/,O=/\?\(([1-9]([0-9]?)):((.|\s)*?)\)/,w=/###### (.*?)(\n|$)/g,z=/##### (.*?)(\n|$)/g,L=/#### (.*?)(\n|$)/g,T=/### (.*?)(\n|$)/g,I=/## (.*?)(\n|$)/g,B=/# (.*?)(\n|$)/g,q='<div class="align_center">$1</div>',C='<div class="align_left">$1</div>',N='<div class="align_right">$1</div>';(e.exports=r(1).create(e=>{e=e.replace(v,String.BLANK);let t=function(){let e=a.AspectBase("links");return e.before=(t=>{for(;o.test(t);){let r=RegExp.$1,a=RegExp.$2,l=p[r](a);t=e.replace(t,`[${r}](${a})`,l)}return t}),e}(),r=function(){let e=a.AspectBase("align");return e.before=(t=>{for(;null!==(matches=t.match(j));){let r=matches[0],a=r.replace(j,q);t=e.replace(t,r,a)}for(;null!==(matches=t.match(S));){let r=matches[0],a=r.replace(S,C);t=e.replace(t,r,a)}for(;null!==(matches=t.match(k));){let r=matches[0],a=r.replace(k,N);t=e.replace(t,r,a)}return t}),e}(),P=function(){let e=a.AspectBase("escapes");return e.before=(t=>{for(;null!==(matches=t.match(_));)t=e.replace(t,matches[0],part);return t}),e}();return e=t.before(e),e=P.before(e),e=(e=(e=r.before(e)).replace(y,"<em>$1</em>")).replace(A,"<ins>$1</ins>"),e=r.after(e),e=P.after(e),e=(e=(e=function e(t){for(;l.test(t);){let r=RegExp.$1.replace(c,"\n"),a=(r=r.slice(1)).indexOf("\n"),s=r.slice(0,a),i=String.startsWith(s,"(")&&String.endsWith(s,")"),o=i?s.slice(1,s.length-1):n,p=i?r.slice(a+1):r;p=e(p),t=t.replace(l,`<fieldset><legend>${o}</legend>${p}</fieldset>`)}return t}(e=t.after(e))).replace(x,"<strong>$1</strong>")).replace(R,"<del>$1</del>"),e=(e=(e=(e=(e=(e=(e=function(e){let t=new Set,r=1;for(;null!==(matches=e.match(E));){let a=matches[0],l=matches[1];if(t.has(a)){let t=`<a id="l_${l}" href="#f_${l}">^</a> ${r}: `;e=e.replace(E,t),r++}else{t.add(a);let r=`<sup id="f_${l}"><a href="#l_${l}">${t.size}</a></sup> `;e=e.replace(E,r)}}return e}(e=function(e){for(;i.test(e);){var t,r=RegExp.$1,a=RegExp.$2,l=a.split("|");t=2===l.length?'<span class="'+l[0]+"_"+r+'">'+l[1]+"</span>":'<span class="color_'+r+'">'+l[0]+"</span>",e=e.replace("[#"+r+"|"+a+"]",t)}return e}(e=(e=function(e){for(;null!==(matches=e.match(g));){let t=matches[0],r=[];Array.forEach(t.split("\n"),function(e,t){1!==e&&(String.isEmpty(t)||(t=t.slice(1,t.length-1),r.push(m+t.replace(u,f)+d)))});let a=$+r.join(h)+b;e=e.replace(t,a)}return e}(e=s(e))).replace(O,'<span class="size_$1">$3</span>')))).replace(w,'<h1 class="h6">$1</h1>')).replace(z,'<h1 class="h5">$1</h1>')).replace(L,'<h1 class="h4">$1</h1>')).replace(T,'<h1 class="h3">$1</h1>')).replace(I,'<h1 class="h2">$1</h1>')).replace(B,'<h1 class="h1">$1</h1>')},{object:[{regexp:/\[\[((.|\s)*?)\]\]/,tag:{start:"[[",end:"]]",html:"pre",attrs:{class:"pre"}}},{regexp:/{{((.|\s)*?)}}/,tag:{start:"{{",end:"}}",html:"ruby"},replace:{start:{from:/\(/g,to:"<rp>(</rp><rt>"},end:{from:/\)/g,to:"</rt><rp>)</rp>"}}}],aspect:{simpleLineCode:{regexp:/`([^`]+?)`/,tag:{start:"`",end:"`"}},escapeSequence:/\\(\S)/}})).clear=(e=>e)},function(e,t){let r=FlyHighLighter.execute;var a={regexp:/```(.*[\r\n]+)((.|\s)*?)```/,code:"$2",name:"$1"};function l(){let e=[];return{before:function(t){for(;a.regexp.test(t);){var l,c=RegExp[a.code],n=RegExp[a.name];l=n?"```"+n+c+"```":"```"+c+"```",t=t.replace(l,"[toCode"+e.length+"]"),c=r(c,String.trim(n)),e.push(c)}return t},after:function(t){return Object.forEach(e,function(e,r){t=t.replace("[toCode"+e+"]",r)}),t}}}e.exports=(()=>[l()])},function(e,t,r){Coralian.dom.newXmlWrapper,Number.isNumber,Coralian.Formatter.formatFileSize;let a=r(3);var l,c,n,s,i,o,p=["黑线","怒","眼泪","炸毛","蛋定","微笑","汗","囧","卧槽","坏笑","鼻血","大姨妈","瞪眼","你说啥","一脸血","害羞","大好","喝茶看戏","美～","笑岔","中箭","呕","撇嘴","碎掉","吐舌头","纳尼","泪流满面","升仙","扭曲","闪闪亮","山","寨","基","惊","头顶青天","不错","吃屎","牛","严肃","作死","帅","腹黑","喜闻乐见","呵呵呵","！","？","吓尿了","嘁","闪电","S1","战斗力爆表","贼笑","嗯...","喵","奸笑"];e.exports=(l={PRE_REGEXP:/\[\[((.|\s)*?)\]\]/,PRE_START_TAG:"[[",PRE_END_TAG:"]]"},c=function(){const e=/(\|(.)+\|\n)+/,t=/\<td\>\n\<\/td\>/g;return VERTICAL_BAR=/\|/g,function(r){for(;null!==(matches=r.match(e));){let e=matches[0],a=e.replace(VERTICAL_BAR,"</td><td>");a='<table class="table"><tr>'+(a=a.replace(t,"</tr><tr>")).slice(5,a.length-5)+"</tr></table>",r=r.replace(e,a)}return r}}(),n=function(){const e=/(\*+\. (.)+\n)+/,t=/([0-9]+\. (.)+\n)+/,r=/([a-z]+\. (.)+\n)+/,a=/[0-9]+\. /g,l=/[a-z]+\. /g,c=/\*+\. /g,n=/\n/g,s="<li>",i="</li>";function o(e,t,r,a,l){var c=t.replace(r,s);return c=c.replace(n,i),e.replace(t,a+c+l)}return function(n){for(;null!==(matches=n.match(e));)n=o(n,matches[0],c,"<ul>","</ul>");for(;null!==(matches=n.match(t));)n=o(n,matches[0],a,'<ol class="list_type_1">',"</ol>");for(;null!==(matches=n.match(r));)n=o(n,matches[0],l,'<ol class="list_type_a">',"</ol>");return n}}(),s=/\\(.)/,i=/\n{2,}/,o=/\n{2,}/g,{toHTML:function(e){let t=a();return t&&Object.forEach(t,function(t,r){e=r.before(e)}),e=(e=e.replace(/</g,"&lt;")).replace(/>/g,"&gt;"),e=function(e){for(var t=0,r=p.length;t<r;t++){var a=p[t],l=new RegExp("\\["+a+"\\]","g");l.test(e)&&(e=e.replace(l,'<img src="/res/flies/face/'+(100+t)+'.gif" title="'+a+'" />'))}return e}(e=this.parse(e)),t&&Object.forEach(t,function(t,r){e=r.after(e)}),function(e){try{e=decodeURIComponent(e)}catch(e){}return e}(e=e.replace(/\<\/(p|pre)\>\n/,"</$1>"))},parse:function(e){var t,r,a=(t=[],{before:function(e){for(;s.test(e);)e=e.replace(s,"{backslash"+t.length+"}"),t.push(RegExp.$1);return e},after:function(e){return Object.forEach(t,function(t,r){e=e.replace(new RegExp("\\{backslash"+t+"\\}","g"),r)}),e}}),p=(r=[],{before:function(e){for(;/`((.)*?)`/.test(e);){let t=RegExp.$1;e=e.replace("`"+t+"`","[lineCode"+r.length+"]"),r.push('<code class="code">'+t+"</code>")}return e},after:function(e){return Object.forEach(r,function(t,r){e=e.replace(new RegExp("\\[lineCode"+t+"\\]","g"),r)}),e}});e=p.before(e),e=(e=(e=(e=(e=(e=function(e){for(;/\n&gt;( (.|\s)*?|)\n((.|\s)*?)(\n{2}|$)/.test(e);){var t=RegExp.$1||"引用",r=RegExp.$3,a="\n&gt;"+RegExp.$1+"\n"+r+RegExp.$5,l='<fieldset class="fieldset"><legend>'+String.trim(t)+"</legend>"+r+"</fieldset>";e=e.replace(a,l)}return e}(e=(e=(e=a.before(e)).replace(/\/\*((.|\s)*?)\*\//g,"")).replace(/\/((.|\s){1,})\//g,"<em>$1</em>"))).replace(/!((.|\s)*?)!/g,"<strong>$1</strong>")).replace(/\[\-:((.|\s)*?)\]/g,"<input type=checkbox name=$1 />")).replace(/\[\+:((.|\s)*?)\]/g,"<input type=checkbox checked=checked name=$1 />")).replace(/-((.|\s)*?)-/g,"<del>$1</del>")).replace(/_((.|\s)*?)_/g,"<ins>$1</ins>"),e=n(e),e=(e=(e=(e=(e=(e=(e=function(e){for(;/\$\(((.|\s)*?)\)/.test(e);){var t=RegExp.$1,r=t.split("|"),a=r[0].replace(/<\/?(em)>/g,"/"),l='<img src="'+(a=(a=a.replace(/<\/?(ins)>/g,"_")).replace(/<\/?(del)>/g,"-"))+'"';l+=' title="'+(r[1]||a)+'"',r[2]&&(l+=' width="'+r[2]+'"'),r[3]&&(l+=' height="'+r[3]+'"'),l+=' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />',e=e.replace("$("+t+")",l)}return e}(e=function(e){for(;/#\(((.|\s)*?)\)/.test(e);){var t=RegExp.$1,r=t.split("|"),a=r[0],l='<a href="'+a+'"';l+=' title="'+(4===r.length&&r[2]||a)+'"';var c=r[4===r.length?3:2];c&&(l+=' target="_'+c+'"'),l+=">",l+=r[1]||a,l=(l+="</a>").replace(/<\/?em>/g,"/"),e=e.replace("#("+t+")",l)}return e}(e=function(e){for(;/\[#([0-9,A-F]{6})\|((.|\s)*?)\]/i.test(e);){var t,r=RegExp.$1,a=RegExp.$2,l=a.split("|");t=2===l.length?'<span class="'+l[0]+"_"+r+'">'+l[1]+"</span>":'<span class="color_'+r+'">'+l[0]+"</span>",e=e.replace("[#"+r+"|"+a+"]",t)}return e}(e=(e=function(e,t,r,a){for(;t.test(e);){var l=RegExp.$1,c=r+l+a,n="<ruby>"+(l=(l=l.replace(/\(/g,"<rp>(</rp><rt>")).replace(/\)/g,"</rt><rp>)</rp>"))+"</ruby>";e=e.replace(c,n)}return e}(e=(e=(e=(e=c(e)).replace(/\n&gt;&gt;((.|\s)+)&lt;&lt;\n/g,'<div class="align_center">$1</div>')).replace(/\n\|\:((.|\s)+)&lt;&lt;\n/g,'<div align="align_left">$1</div>')).replace(/\n&gt;&gt;((.|\s)+)\:\|\n/g,'<div align="align_right">$1</div>'),/\{\{((.|\s)*?)\}\}/,"{{","}}")).replace(/\?\(([1-9]([0-9]?)):((.|\s)*?)\)/,'<span class="size_$1">$3</span>'))))).replace(/###### (.*?)(\n|$)/g,'<h6 class="h6">$1</h6>')).replace(/##### (.*?)(\n|$)/g,'<h5 class="h5">$1</h5>')).replace(/#### (.*?)(\n|$)/g,'<h4 class="h4">$1</h4>')).replace(/### (.*?)(\n|$)/g,'<h3 class="h3">$1</h3>')).replace(/## (.*?)(\n|$)/g,'<h2 class="h2">$1</h2>')).replace(/# (.*?)(\n|$)/g,'<h1 class="h1">$1</h1>');var g=function(e){var t=[];return{before:function(r){for(;e.PRE_REGEXP.test(r);){var a=RegExp.$1;r=r.replace(e.PRE_START_TAG+a+e.PRE_END_TAG,"{pre"+t.length+"}"),t.push('<pre class="pre">'+a+"</pre>")}return r},after:function(e){return Object.forEach(t,function(t,r){e=e.replace("{pre"+t+"}",r)}),e}}}(l);return e=(e=function(e){return i.test(e)&&(e=e.replace(i,"<p>"),i.test(e)&&(e=e.replace(o,"</p><p>")),e+="</p>"),e=e.replace(/\<p\>\<\/p\>/g,"")}(e=g.before(e))).replace(/\n/g,"<br />"),e=g.after(e),e=a.after(e),e=p.after(e)},clear:function(e){return e}})},function(e,t,r){const a=/\n(\n(>(.*)\n)+)/,l=/\n>/g,c="引用";var n=function(){const e=/(\*+\. (.)+\n)+/,t=/([0-9]+\. (.)+\n)+/,r=/([a-z]+\. (.)+\n)+/,a=/[0-9]+\. /g,l=/[a-z]+\. /g,c=/\*+\. /g,n=/\n/g,s="<li>",i="</li>";function o(e,t,r,a,l){var c=t.replace(r,s);return c=c.replace(n,i),e.replace(t,a+c+l)}return function(n){for(;null!==(matches=n.match(e));)n=o(n,matches[0],c,"<ul>","</ul>");for(;null!==(matches=n.match(t));)n=o(n,matches[0],a,'<ol class="list_type_1">',"</ol>");for(;null!==(matches=n.match(r));)n=o(n,matches[0],l,'<ol class="list_type_a">',"</ol>");return n}}();const s=/\[#([0-9,A-F]{6})\|((.|\s)*?)\]/i;const i=/#\(((.|\s)*?)\)/;const o=/\$\(((.|\s)*?)\)/;const p=/(\|(.)+\|\n)+/,g=/\|/g,u="</tr><tr>",h="</td><td>",f="<td>",m="</td>",d='<table class="table"><tr>',$="</tr></table>";const b=/\\\//;const E=/\/\*((.|\s)*?)\*\//g,_=/\/((.|\s){1,})\//g,v=/!((.|\s)*?)!/g,y=/-((.|\s)*?)-/g,x=/_((.|\s)*?)_/g,R=/\n>>((.|\s)+?)<<\n/,A=/\n\|\:((.|\s)+?)<<\n/,j=/\n>>((.|\s)+?)\:\|\n/,S=/\?\(([1-9]([0-9]?)):((.|\s)*?)\)/,k=/###### (.*?)(\n|$)/g,O=/##### (.*?)(\n|$)/g,w=/#### (.*?)(\n|$)/g,z=/### (.*?)(\n|$)/g,L=/## (.*?)(\n|$)/g,T=/# (.*?)(\n|$)/g,I='<div class="align_center">$1</div>',B='<div class="align_left">$1</div>',q='<div class="align_right">$1</div>';e.exports=commons=r(1).create(e=>{e=e.replace(E,String.BLANK);let t=function(e){let t=[];return{before:e=>{for(;i.test(e);){var r=RegExp.$1,a=r.split("|"),l=a[0],c='<a href="'+l+'"';c+=' title="'+(4===a.length&&a[2]||l)+'"';var n=a[4===a.length?3:2];n&&(c+=' target="_'+n+'"'),c+=">",c+=a[1]||l,c=(c+="</a>").replace(/<\/?em>/g,"/"),e=e.replace("#("+r+")",`{links~${t.length}}`),t.push(c)}return e},after:e=>(Array.forEach(t,(t,r)=>{e=e.replace(`{links~${t}}`,r)}),e)}}(),r=function(e){let t=[];return{before:e=>{for(;o.test(e);){var r=RegExp.$1,a=r.split("|"),l=a[0].replace(/<\/?(em)>/g,"/"),c='<img src="'+(l=(l=l.replace(/<\/?(ins)>/g,"_")).replace(/<\/?(del)>/g,"-"))+'"';c+=' title="'+(a[1]||l)+'"',a[2]&&(c+=' width="'+a[2]+'"'),a[3]&&(c+=' height="'+a[3]+'"'),c+=' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />',e=e.replace("$("+r+")",`{images~${t.length}}`),t.push(c)}return e},after:e=>(Array.forEach(t,(t,r)=>{e=e.replace(`{images~${t}}`,r)}),e)}}(),C=function(){let e=[];return{before:t=>{for(;null!==(matches=t.match(R));){let r=matches[0],a=r.replace(R,I);t=t.replace(r,`{align~${e.length}}`),e.push(a)}for(;null!==(matches=t.match(A));){let r=matches[0],a=r.replace(A,B);t=t.replace(r,`{align~${e.length}}`),e.push(a)}for(;null!==(matches=t.match(j));){let r=matches[0],a=r.replace(j,q);t=t.replace(r,`{align~${e.length}}`),e.push(a)}return t},after:t=>(Array.forEach(e,(e,r)=>{t=t.replace(`{align~${e}}`,r)}),t)}}(),N=function(){let e=[];return{before:t=>{for(;null!==(matches=t.match(b));){let r=matches[0];t=t.replace(r,`{escape~${e.length}}`),e.push(r)}return t},after:t=>(Array.forEach(e,(e,r)=>{t=t.replace(`{escape~${e}}`,r)}),t)}}();return e=t.before(e),e=r.before(e),e=N.before(e),e=(e=(e=C.before(e)).replace(_,"<em>$1</em>")).replace(x,"<ins>$1</ins>"),e=C.after(e),e=N.after(e),e=r.after(e),e=(e=(e=function e(t){for(;a.test(t);){let r=RegExp.$1.replace(l,"\n"),n=(r=r.slice(1)).indexOf("\n"),s=r.slice(0,n),i=String.startsWith(s,"(")&&String.endsWith(s,")"),o=i?s.slice(1,s.length-1):c,p=i?r.slice(n+1):r;p=e(p),t=t.replace(a,`<fieldset><legend>${o}</legend>${p}</fieldset>`)}return t}(e=t.after(e))).replace(v,"<strong>$1</strong>")).replace(y,"<del>$1</del>"),e=(e=(e=(e=(e=(e=(e=function(e){for(;s.test(e);){var t,r=RegExp.$1,a=RegExp.$2,l=a.split("|");t=2===l.length?'<span class="'+l[0]+"_"+r+'">'+l[1]+"</span>":'<span class="color_'+r+'">'+l[0]+"</span>",e=e.replace("[#"+r+"|"+a+"]",t)}return e}(e=(e=function(e){for(;null!==(matches=e.match(p));){let t=matches[0],r=[];Array.forEach(t.split("\n"),function(e,t){1!==e&&(String.isEmpty(t)||(t=t.slice(1,t.length-1),r.push(f+t.replace(g,h)+m)))});let a=d+r.join(u)+$;e=e.replace(t,a)}return e}(e=n(e))).replace(S,'<span class="size_$1">$3</span>'))).replace(k,'<h1 class="h6">$1</h1>')).replace(O,'<h1 class="h5">$1</h1>')).replace(w,'<h1 class="h4">$1</h1>')).replace(z,'<h1 class="h3">$1</h1>')).replace(L,'<h1 class="h2">$1</h1>')).replace(T,'<h1 class="h1">$1</h1>')},{object:[{regexp:/\[\[((.|\s)*?)\]\]/,tag:{start:"[[",end:"]]",html:"pre"}},{regexp:/{{((.|\s)*?)}}/,tag:{start:"{{",end:"}}",html:"ruby"},replace:{start:{from:/\(/g,to:"<rp>(</rp><rt>"},end:{from:/\)/g,to:"</rt><rp>)</rp>"}}}],aspect:{simpleLineCode:{regexp:/`([^`]+?)`/,tag:{start:"`",end:"`"}},escapeSequence:/\\(\S)/}}),commons.clear=(e=>e)},function(e,t,r){const a=r(0),l="HitOn",c={ubbcode:r(7),HitOn:r(2)},n=new Proxy(c,{get:(e,t)=>String.startsWith(t,l)&&t!==l?r(8)("./"+t.split("_")[1]):e[t]}),s={ubbcode:{aspect:[{method:o,object:{regexp:/\[code(=((.|\s)*?))?\]((.|\s)*?)\[\/code\]/,code:"$4",name:"$2",withLang:(e,t)=>e?`[code=${e}]${t}[/code]`:`[code]${t}[/code]`}}]},HitOn:{aspect:[{method:o,object:{regexp:/```(.*[\r\n]+)((.|\s)*?)```/,code:"$2",name:"$1",withLang:(e,t)=>e?"```"+e+t+"```":"```"+t+"```"}}]}};let i=null;function o(e){let t=a.AspectBase("codes");return t.before=(r=>{if(i)for(;e.regexp.test(r);){let a=RegExp[e.name],l=RegExp[e.code],c=e.withLang(a,l),n=i(l,a);r=t.replace(r,c,n)}return r}),t}function p(e,t){let r=s[t];r.aspect=r.aspect||[],r.queue=r.queue||[],r.object=r.object||[],e.aspect&&e.aspect.map(e=>{r.aspect.push(e)}),e.queue&&e.queue.map(e=>{r.queue.push(e)}),e.object&&e.object.map(e=>{r.object.push(e)})}Coralian.setToGlobal("FlyCodes",{lang:{HITON:l,UBB:"UBB"},setHighLighter:e=>{i=e},addPlugIn:(e,t)=>{if(t)p(e,t);else{let t=Object.keys(s);for(let r of t)p(e,r)}},toHTML:(e,t)=>{if(!t)return e;"UBB"===t&&(t="ubbcode");try{return e=(e=e.replace(/\r\n/g,"\n")).replace(/\r/g,"\n"),n[t].toHTML(e,function(e){return String.startsWith(e,l)&&(e=l),s[e]}(t))}catch(t){return Coralian.logger.err(t),`<pre>${e}</pre>`}},ed2k:{change:function(e){document.getElementById("ed2k_"+e)},downloadSelected:function(e){document.getElementById("ed2k_"+e)},selectAll:function(){}}})},function(e,t,r){const a=String.BLANK,l=r(0),c=function(){const e=/align=(left|center|right|justify)/,t=/(width|height)=(\d+)/,r=/size=\((\d+),(\d+)\)/,a=' onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />';function l(l,c){let n=!1,s=!1;if(null!==(matched=l.match(e))&&(c+=' class="flyimg img_'+matched[1]+'"'),null!==(matched=l.match(t))&&(n=!0,c+=" "+matched[1]+'="'+matched[2]+'"'),null!==(matched=l.match(r))&&(s=!1,c+=' width="'+matched[1]+'" height="'+matched[2]+'"'),n&&s)throw new Error("不能同时指定 size 和 with 或 height。");return c+=a}const c=/\[img (align|size|width|height)=([^\[]+)\]([^\[]+)\[\/img\]/,n=/\[img=([^\[]*) (align|size|width|height)=([^\[]+)\]([^\[]+)\[\/img\]/,s=/\[img=([^\[]*)\](.+?)\[\/img\]/g,i=/\[img\]([^\[]*)\[\/img\]/g;return function(e){for(;null!==(matched=e.match(c));){let t="[img "+matched[1]+"="+matched[2]+"]"+matched[3]+"[/img]",r='<img src="'+matched[3]+'"';e=e.replace(t,l(t,r))}for(;null!==(matched=e.match(n));){let t="[img="+matched[1]+" "+matched[2]+"="+matched[3]+"]"+matched[4]+"[/img]",r='<img src="'+matched[1]+'" title="'+matched[4]+'"';e=e.replace(t,l(t,r))}return e=(e=e.replace(i,'<img class="flyimg" title="$1" src="$1" onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />')).replace(s,'<img class="flyimg" src="$1" title="$2" onload="styles.Image.resize(this)" onclick="styles.Image.protoSize(this)" />')}}(),n=function(){function e(e,t){if(t=t||"ul",String.isEmpty(e))return e;return(e=e.split("[*]")).shift(),"<"+t+"><li>"+e.join("</li><li>")+"</li></"+t+">"}const t=/\[list\]((.|\s)*?)\[\/list\]/,r=/\[list=(a|A|1|\*|#|o|i|I|α|一|あ|ア)( [^\[]+)*\]((.|\s)*?)\[\/list\]/;return function(l){for(;null!==(matched=l.match(t));)l=l.replace("[list]"+matched[1]+"[/list]",e(matched[1]));for(;null!==(matched=l.match(r));){let t,r=matched[1];if(params=matched[2]||String.BLANK,outParam=a,inner=matched[3],className="list_type_",!String.isEmpty(params)){if(params=params.split(" "),params.length>2)throw new Error("参数个数不正确");for(let e=0;e<2;e++)if("reversed"===params[e])outParam+=" reversed";else{if(!String.startsWith(params[e],"start"))throw new Error("参数不正确");outParam+=' start="'+params[e].last()+'"'}}switch(r){case"#":className+="square";break;case"*":className+="disc";break;case"o":className+="circle";break;case"α":className+="greek",t="ol";break;case"一":className+="shuzi",t="ol";break;case"あ":className+="hira",t="ol";break;case"ア":className+="kata",t="ol";break;default:t="ol",className+=r}l=l.replace("[list="+r+params+"]"+inner+"[/list]",e(inner,t))}return l}}(),s=/\[url]((.|\s)*?)\[\/url\]/g,i=/\[url target=([^\[]*)\]((.|\s)*?)\[\/url\]/g,o=/\[url=([^\[]*) target=([^\[]*)\]((.|\s)*?)\[\/url]/g,p=/\[url=([^\[]*)\]((.|\s)*?)\[\/url\]/g,g='<a href="$1">$1</a>',u='<a href="$2" title="$2" target="_$1">$2</a>',h='<a href="$1" title="$1" target="_$2">$3</a>',f='<a href="$1" title="$2">$2</a>';const m=function(){const e={bilibili:function({url:e,page:t}){t=t||1;e.replace("av","");return l.compireH5Video(e,{scrolling:"no",border:0,framespacing:0})},youku:function({url:e}){let t=`http://player.youku.com/embed/${e}`;return l.compireH5Video(t)},common:(e,t)=>l.compireH5Video(e,t)},t=/\[video=([^\]]+)\]([^\]]+)\[\/video\]/,r=/(([^\]]+))*\(([^\]]+)\)/,a=/\[video\]([^\]]+)\[\/video\]/;function c(t,r,a,l,c,n){let s=(l&&e[l]||e.common)(c,n);return r=(r=r.replace("%1",a)).replace("%2",c),t.replace(r,s)}return function(e){if(1===arguments.length){for(;null!==(matched=e.match(a));)e=c(e,"[video]%2[/video]",null,null,matched[1]);for(;null!==(matched=e.match(t));){let t=name=matched[1],a=matched[2].split(","),n=a[0],s=a[1]||"",i={};s&&(i.page=s);let o=t.match(r);null!==o&&(name=o[1],l.parseEqualToObject(o[3].split(","),i)),e=c(e,"[video=%1]%2[/video]",t,name,n,i)}}else e=c(e,arguments[1],arguments[2],arguments[3],arguments[4]||"");return e}}(),d=/\[flash=bilibili]([^\[]+)\.swf\?aid=([^\[]+)\[\/flash]/,$=/\[flash]([^\[]+)\[\/flash]/,b='<embed src="$1" allowFullScreen="true" name="movie" value="opaque" width="634" height="440" type="application/x-shockwave-flash" />',E="youku",_="bilibili";const v=/\[(tr|td) ([^\[]+)=([^\[]+)\]/g,y=/\[table ([^\[]+)=([^\[]+)\]/g,x=/\[table\]/g,R=/\[\/table\]/g,A='<$1 $2="$3">',j='<table class="table">',S="</table>";const k=/\[(\/)?(quote|p|table|td|tr|list|align)\]\n\[(\/)?(quote|p|table|td|tr|list|align)/,O=/\[\/(size|color|font|bgcolor)\]/g,w=/\[(\/)?(sub|sup|del|p|tr|td|mark)]/g,z=/\[(\/)?h([1-6])]/g,L=/\[size=(\d+?)]/g,T=/\[(bg|)color=\#([^\[\<]+?)]/g,I=/\[align=(left|center|right|justify)\]((.|\s)*?)\[\/align\]/g,B=/\[u\](.+?)\[\/u]/g,q=/\[quote\]/g,C=/\[quote=([^\]]+)\]/g,N=/\[\/(quote|thunder|magnet)\]/g,P=/\[thunder=([^\]]+)\]([^\[]+)/g,H=/\[magnet=([^\]]+)\]([^\[]+)/g;OLD_BOLD_REGX=/\[b(old)?\](.+?)\[\/b(old)?]/g,OLD_ITALIC_REGX=/\[i(talic)?\](.+?)\[\/i(talic)?]/g,TAIL_EXE_REGX_1=/\<(\/)?(div|fieldset|tr|pre|table|p|h[1-6]|pre|li|ul|ol)\>\<br( \/)?\>/g,TAIL_EXE_REGX_2=/\<br( \/)?\>\<(\/)?(div|fieldset|tr|table|p|h[1-6]|pre|li|ul|ol)/g;(e.exports=r(1).create(e=>(e=function(e){for(;null!==(matched=e.match(d));){let t=matched[1],r=matched[2],a=r.split("&amp;page=");e=m(e,"[flash=bilibili]"+t+".swf?aid="+r+"[/flash]",_,a[0],a[1])}for(;null!==(matched=e.match($));){let t=matched[1],r=`[flash]${t}[/flash]`;if(String.contains(t,E)){let a=t.split("/");e=m(e,r,E,a[a.length-2])}else e=e.replace($,b)}return e}(e=e.replace(k,"[$1$2][$3$4")),e=(e=(e=function(e){return e=(e=(e=(e=e.replace(v,A)).replace(y,j)).replace(x,j)).replace(R,S)}(e=(e=(e=(e=(e=(e=m(e)).replace(O,"</span>")).replace(w,"<$1$2>")).replace(z,'<$1h$2 class="$1h$2">')).replace(L,'<span class="size_$1">')).replace(T,'<span class="$1color_$2">'))).replace(I,'<div class="align_$1">$2</div>')).replace(B,"<ins>$1</ins>"),e=n(e),e=(e=(e=(e=(e=(e=(e=(e=(e=(e=function(e){return e=(e=(e=(e=e.replace(s,g)).replace(i,u)).replace(o,h)).replace(p,f)}(e=c(e))).replace(q,'<fieldset class="fieldset"><legend>引用</legend><div>')).replace(C,'<fieldset class="fieldset"><legend>$1</legend><div>')).replace(N,"</div></fieldset>")).replace(P,'<fieldset class="fieldset"><legend>迅雷资源</legend><div><a href="$1" title="$2">$2</a>')).replace(H,'<fieldset class="fieldset"><legend>磁力链接</legend><div><a href="$1" title="$2">$2</a>')).replace(OLD_BOLD_REGX,"<strong>$2</strong>")).replace(OLD_ITALIC_REGX,"<em>$2</em>")).replace(TAIL_EXE_REGX_1,"<$1$2>")).replace(TAIL_EXE_REGX_2,"<$2$3")),{object:[{regexp:/\[pre\]((.|\s)*?)\[\/pre\]/,tag:{start:"[pre]",end:"[/pre]",html:"pre"}},{regexp:/\[phonics\]((.|\s)*?)\[\/phonics\]/,tag:{start:"[phonics]",end:"[/phonics]",html:"ruby"},replace:{start:{from:/\(/g,to:"<rp>(</rp><rt>"},end:{from:/\)/g,to:"</rt><rp>)</rp>"}}}],aspect:{simpleLineCode:{regexp:/\[code\]((.)*?)\[\/code\]/,tag:{start:"[code]",end:"[/code]"}}}})).clear=(e=>e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=e.replace(/\[\/(size|color|font|backcolor)\]/g,a)).replace(/\[(\/)?(sub|flash|sup|underline|i|p|del|b|quote|tucao|magnet|ed2k|thunder)\]/g,a)).replace(/\[\/align\]/g,a)).replace(/\[(\/)?h([1-6])\]/g,a)).replace(/\[align=(left|center|right|justify)\]/g,a)).replace(/\[size=(\d+?)\]/g,a)).replace(/\[(color|bgcolor)=\#([^\[\<]+?)\]/g,a)).replace(/\[font=([^\[\<]+?)\]/g,a)).replace(/\[list=(a|A|1)\](.+?)\[\/list\]/g,"$2")).replace(/\[(\/)?list\]/g,a)).replace(/\[img(\((left|center|right|justify)\)|)\]([^\[]*)\[\/img\]/g,"$1")).replace(/\[url([^\[]*)\]([^\[]+)\[\/url\]/g,"$2"))},function(e,t,r){var a={"./0.0.0":4,"./0.0.0.js":4,"./0.0.1":5,"./0.0.1.js":5,"./plugin":3,"./plugin.js":3};function l(e){var t=c(e);return r(t)}function c(e){if(!r.o(a,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return a[e]}l.keys=function(){return Object.keys(a)},l.resolve=c,e.exports=l,l.id=8}]);