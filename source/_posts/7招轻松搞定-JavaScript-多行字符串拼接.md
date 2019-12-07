---
title: '7 招轻松搞定 JavaScript 多行字符串拼接'
date: 2016-01-06 21:24:40
tags:
comments: false
---

平常在做项目的时候，会经常遇到多行字符串拼接的需求，例如，我需要处理一个 `li` 标签动态拼接显示到 `ul` 中，等等，像这样的需求场景还是非常多的，这就需要根据在项目中实际遇到的需求来处理，选择合适的拼接方式会大大提高开发效率并减少出错的可能，在这里我总结了 7 招字符串拼接方法。

<!-- more -->
#### 需求场景
在项目中，动态处理分页，根据系统设定的显示条目确定有多少分页，这时，需要将分页的内容经过处理动态生成再放回到原来的 `ul` 中，这时就需要进行多行字符串的拼接。

```html
<li><a href="#">上页</a></li>
<li><a href="#"> 1 </a></li>
<li><a href="#">下页</a></li>
```
对于这样的 DOM 结构需要在 JavaScript 中拼接，你会怎样处理？
#### 常规方法
```js
var s=`<li><a href="">上页</a></li><li><a href="">1</a></li><li><a href="">下页</a></li>`;
```
#### 字符串相加
```js
var str = `<li><a href="#">上页</a></li>` +
          `<li><a href="#"> 1 </a></li>` +
          `<li><a href="#">下页</a></li>`;
```

#### 反斜杠
```js
var str = `<li><a href="#">上页</a></li>\
          <li><a href="#"> 1 </a></li>\
          <li><a href="#">下页</a></li>`;
```

#### 数组切割
```js
var str = [
    `<li><a href="#">上页</a></li>`,
    `<li><a href="#"> 1 </a></li>`,
    `<li><a href="#">下页</a></li>`
].join('\n');
```

#### ES6 语法
```js
var str = `<li><a href="#">上页</a></li>
          <li><a href="#"> 1 </a></li>
          <li><a href="#">下页</a></li>`
```

#### 正则表达式
```text
查找：\n
替换：\\\n
通过正则表达式把原有的换行 \n 替换成了 \\\n 带有反斜杠的换行，本质是和反斜杠方法一样
```
![](http://ww3.sinaimg.cn/large/6057861cgw1fbn70seheej218s0v8n0x.jpg)

#### 黑魔法
```js
function aHereDoc() {/*
    <li><a href="#">上页</a></li>
    <li><a href="#"> 1 </a></li>
    <li><a href="#">下页</a></li>
    */}

function hereDoc(func) {
    return func.toString().split(/\n/).slice(1, -1).join('\n');
}
console.log(hereDoc(aHereDoc));
```
利用 `func.toString()` 获取需要批量处理的字符串，利用 `split(/\n/).slice(1, -1)` 去掉首尾两行函数定义的代码，控制台输出：
![](http://ww3.sinaimg.cn/large/6057861cgw1fbn6ta8s3yj21460b5jt0.jpg)
