title: 一段神奇的 CSS 调试代码
date: 2016-03-22 16:32:52
tags:

---
现在到处都是 JavaScript，倘若花点时间去深入分析，每次都能学到点新的东西。当我发现些有意思的东西，习惯先收藏起来。等时技（时间＋技术）成熟，再去 Review 他们的代码，看一看它们是如何做到的，览一览大牛们的 “奇技淫巧”。
<!-- more -->
### 代码片段

```js
[].forEach.call($$("*"),function(a){
    a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16);
})
```
在浏览器控制台运行此段代码，会给页面里所有的 DOM 元素添加一个 1px 的描边（outline），方便我们在调试 CSS 过程中分析、排查问题。
![](http://ww1.sinaimg.cn/large/6057861cgy1fbzi0vggl6j21kw0vyq8s.jpg)


### 代码分析
这段代码是 Github 上的 140 Bytes 活动中的代码，简单分析下这段 JS 代码，作者使用了不少技巧：

首先是需要选择页面上的所有元素，这里使用了只能在 Console 调试工具中使用的 `$$` 函数，你可以在 Console 中输入 `$$('a')` 自己试一下。它会返回当前页面的所有 anchor（链接）元素。`$$` 与 `document.querySelectorAll` 是等价的，有兴趣可[查看](http://ourjs.com/detail/54ab768a5695544119000007) $$ 和 $ 选择器的历史。

其次遍历所有元素，这里用的是 `[].forEach.call(...)`，使用 forEach 替代 for 之类循环能减少不少代码量，而 forEach 是 Array 对象的方法，所以用了个 `[]` 空数组来代替 `Array.prototype` 更显简洁，得到所有元素的节点列表（NodeList），但是它并没有实现 Array 的所有接口，因此使用 `$$("*").forEach` 会返回错误，这里使用 `call` 方法来更改 forEach 内部 `this` 指向，当然也可以使用 `apply`。

之后就是让元素有一个漂亮的边框，并拥有不同的颜色了。在 CSS 渲染的盒子模型（Box Model）中，`outline` ***并不会改变元素及其布局的位置***。这里较有意思的是定义不同的颜色的色值：
```js
~~(Math.random()*(1<<24))).toString(16)
```
这里想构造的其实是一个16进制的颜色值，即 `000000～ffffff`，也就是 `parseInt('0',16)` 到 `parseInt('ffffff',16)` 之间的一个值。

```js
parseInt('ffffff',16) == 16777215 == (2^24-1) == (1<<24 - 1)
```

而 `Math.random()`，得到的是一个 0~1 之间的浮点数，`(Math.random()*(1<<24)`，即得到 0~16777215 之间的浮点数，而色值是需要整数的，所以就需要将浮点数进行 int 转换。这里用到了 `~~`，可[参见](http://www.jeffjade.com/2015/05/31/2015-05-31-javascript-operational%EF%BC%8Dsymbol/)理解 JavaScript 非运算符(~/~~ )。当然可以将 `~~` 视为 `parseInt` 的简写。并且使用按位或 `|` 操作符也可以得到相同的结果：

```js
var a = 1.234567890;
var b = 0.000000001;
~~a == 0|a == parseInt(a, 10) == 1
~~b == 0|b == parseInt(b, 10) == 0
```
`toString(16)` 使用数字类型的 `toString` 方法进行十进制到16进制的转换。至此我们得到了一个 0 到 16777215之间的随机数，然后使用 `toString(16)` 转换成16进制，将此值赋予到页面上所有元素节点的 `outline` 附加属性上。它就是这样工作的。精致巧妙而且非常实用，顶一个！
