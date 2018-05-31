---
title: ES6 Promise 简明指南
comments: true
date: 2018-05-29 22:28:41
tags:
from: https://codeburst.io/a-simple-guide-to-es6-promises-d71bacd2e13a
---

Promise 是 JavaScript ES6 中最令人兴奋的新增功能之一. ES5 中使用回调函数来处理异步操作. 过度使用回调则会产生回调地狱和多级嵌套缩带来的问题. Promise 通过将异步代码转化成同步执行的方式, 大大简化了异步编程方式.

<!-- more -->

这篇文章中, 我们来学习一下什么是 Promise 以及在开发中的实践.

### 什么是 Promise

简单来说 **Promise** 就是一个存放着未来才会有计算结果的占位符. 稍微想想, 你会发现, 这和我们平常在谈话过程中说的 **承诺** 很像. 举个例子: 你准备去印度旅行, 你订了一张去印度的机票. 这个机票上写着多少号, 座位号是多少. 这个场景下, 机票就是航空公司给你许下的承诺: 在你准备出发那天给你预留了一个头等舱! 😎

还有一个简单的例子, 你承诺你的朋友, 当你读完《计算机编程艺术》这本书后, 你就把这本书还回去. 在这里, 你所说的话就好比是一个占位符, 需要返回的值就是这本书.

你还可以想到其他一些类似承诺的例子, 比如在医生办公室等着、在餐馆点餐、在图书馆写书等等. 都涉及某种形式的承诺.

### 生成一个 Promise

当某项任务的完成时间不确定或太长时, 就可以使用 Promise. 例如, 网络请求可能需要 10ms 到 200 ms (或更长) 的时间, 具体取决于网速. 我们不想在获取数据时等待. 200 毫秒对你来说可能不太重要, 但对于一台电脑来说, 这是一段很长的时间.`Promise` 就是要让这种异步变得简单、轻松.

使用 Promise 构造函数, 来实例化一个 myPromise 实例, 像这样:

```js
const myPromise = new Promise((resolve, reject) => {
  if (Math.random() * 100 <= 90) {
    resolve('Hello, Promises!');
  }
  reject(new Error('In 10% of the cases, I fail. Miserably.'));
});
```

来看一下这个接收两个参数的函数. `new Promise()` 被称为执行器函数, 它描述了要完成的计算. 它的这两个参数通常被叫做 `resolve` 和 `reject`, 可以理解为 **执行** 和 **拒绝**, 它们用来标记执行器函数最终的计算结果. `resolve` 和 `reject` 本身是一个函数, 它用来返回一个值给我们的 Promise 实例.

当运算结果成功时, 或者未来着这个值准备就绪时, 我们就使用这个 `resolve` 函数来返回一个值, 我们就说: 我践行了当初许下的这个承诺.

同理, 当计算结果失败时, 或者计算过程中遇到了错误, 我们就使用 `reject` 函数, 我们就说: 我拒绝履行这个承诺. `reject` 函数可以接收任何值来作为参数, 但是比较推荐的是我们可以传递一个 `Error` 对象, 即: 抛出一个错误, 用来帮助我们调试代码, 这样就可以根据具体的抛出错误信息去解决问题啦.

在上面的这个例子中, `Math.random()` 用来生成一个随机数, 在 90% 的情况下, 这个 Promise 都应该被执行 (假设等概率分布), 剩余的情况下都是拒绝执行的.

### 如何使用 Promises

在上面的代码例子中, 我们生成了一个 Promise 实例 `myPromise`, 那么如何通过 `resolve` 和 `reject` 函数访问计算完成后的值呢? 所有的 `Promise` 实例都有一个`.then()` 方法, 我们来瞧瞧:

```js
const myPromise = new Promise((resolve, reject) => {
  if (Math.random() * 100 < 90) {
    console.log('resolving the promise ...');
    resolve('Hello, Promises!');
  }
  reject(new Error('In 10% of the cases, I fail. Miserably.'));
});

// Two functions
const onResolved = resolvedValue => console.log(resolvedValue);
const onRejected = error => console.log(error);

myPromise.then(onResolved, onRejected);

// Same as above, written concisely
myPromise.then(
  resolvedValue => {
    console.log(resolvedValue);
  },
  error => {
    console.log(error);
  }
);

// Output (in 90% of the cases)

// resolving the promise ...
// Hello, Promises!
// Hello, Promises!
```

`.then()` 方法接收 2 个回调函数, 第一个回调函数是当我们的 Promise 实例被执行 (resolve) 时调用, 第二个则是被拒绝 (reject) 时调用. 在上面的代码中, 我们使用 `onResolved` 和 `onRejected` 定义了这两个函数, 然后把它放到 `.then` 函数里, 当然, 你也可以按照常规写法, 直接在 `.then` 函数里写两个函数, 都是一样的.

在这个例子中, 有几点非常重要, 我们来说一下:

* 一个 `promise` 只能是成功或者失败状态中的一个. 它不能成功或者失败多次. 也不能从成功状态切换到失败状态, 失败反之亦然.
* 你可以在成功或者失败状态后, 去定义这样一个回调函数. 当他们 `resolve` 或者 `reject` 仍然能正确调用.

这就说明, `Promise` 最终只有一个状态, 即使你多次使用 `.then` 处理函数, 这个状态不能更改 (计算结果也不会重复执行).

为了验证这点, 你可以看到在第 3 行代码中, `console.log` 语句, 当你多次使用 `.then` 处理程序运行上述代码时, `console.log` 的语句只会被打印一次. 这就说明了 Promise 会缓存计算结果的, 当有一些相同的结果时, 缓存结果会被返回.

另一个重要的要注意的是, Promise 是 [及早求值 (evaluated eagerly)](https://zh.wikipedia.org/wiki/%E5%8F%8A%E6%97%A9%E6%B1%82%E5%80%BC) 的: 只要声明并将其赋值到变量上, 它已经开始在内存中执行了. 没有 `.start` 或`.begin` 方法. 就像它在前面的例子中开始的那样.

为了确保 Promise 能被延迟调用, 我们通常还需要在它的外层包裹一个函数, 稍后的例子中我们会解释这个.

### 捕获 Promise

到目前为止, 我们已经看到了 `resolve` 的场景, 那么当执行函数中出现一个错误时, 会发生什么呢? 在 `.then()` 函数中的第二个参数, 就是上面例子中的 `onRejected` 会被执行, 来看一个例子:

```js
const myPromise = new Promise((resolve, reject) => {
  if (Math.random() * 100 < 90) {
    reject(new Error('The promise was rejected by using reject function.'));
  }
  throw new Error('The promise was rejected by throwing an error');
});

myPromise.then(
  () => console.log('resolved'),
  error => console.log(error.message)
);

// Output (in 90% of cases)

// The promise was rejected by using reject function.
```

和第一个例子一样的, 但是现在 90% 的情况是被 `reject` 的, 另外 10% 的情况则是抛出一个错误语句.

在第一个例子中, 我们分别定义了 `onResolved` 和 `onRejected` 方法, `onRejected` 方法将在错误发生时被调用, 可以看到 `reject` 函数的参数可以直接是错误提示, 没必要必须 `new Error`, 两个写法都一样.

健壮的程序代码离不开错误处理, `.then` 方法的第二个参数给了我们这样一个捷径. 当需要处理一个错误时, 可以用 `.catch(onRejected)` 来代替 `.then(null, () => {...})`, `catch` 方法接收一个回调函数 `onRejected`, 因此, 上面的代码, 可以使用 `catch` 来简化写法:

```js
myPromise.catch(error => console.log(error.message));
```

记住: `.catch` 方法仅仅是 `.then(undefined, onRejected)` 的语法糖而已.

### 链式 Promise

`.then()` 和 `.catch()` 方法永远会返回一个 Promise 实例, 所以你可以链式使用多个 `.then` 一起来调用. 让我们来举个例子理解它.

首先, 我们写一个函数, 来延迟返回一个 Promise 实例. 这个返回的 Promise 将在稍后的时间内 `resolve`. 这里是实现方法:

```js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
```

在这个例子中, 我们正在使用一个函数来包裹我们的 Promise 实例, 所以它并不会立即执行. 这个 `delay` 函数接收一个时间来作为参数. 这个执行函数将接收 `ms` 作为他的参数, 它还包含一个 `setTimeout` , 它在 `ms` 毫秒后调用 `resolve` 函数, 从而正确执行. 看这个例子:

```js
delay(5000).then(() => console.log('Resolved after 5 seconds'));
```

`.then` 中的回调语句将在 `delay(5000)` 后执行. 当你执行上面的代码 5 秒后, 你就可以在控制台上看到输出结果了.

这里, 我们可以使用多个 `.then()` 方法来链式调用:

```js
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

delay(2000)
  .then(() => {
    console.log('Resolved after 2 seconds');
    return delay(1500);
  })
  .then(() => {
    console.log('Resolved after 1.5 seconds');
    return delay(3000);
  })
  .then(() => {
    console.log('Resolved after 3 seconds');
    throw new Error();
  })
  .catch(() => {
    console.log('Caught an error.');
  })
  .then(() => {
    console.log('Done.');
  });

// Resolved after 2 seconds
// Resolved after 1.5 seconds
// Resolved after 3 seconds
// Caught an error.
// Done.
```

从第 3 行开始, 它的执行步骤是这样的:

* `delay(2000)` 函数执行, 它返回一个稍后 2 秒即将执行的 Promise 实例.
* 第 1 个 `.then()` 执行, 它输出语句 `Resolved after 2 seconds`, 然后它执行 `delay(1500)` 又返回一个 Promise 实例, 如果一个 `.then()` 返回了一个 Promise 实例, 那么它的 `resolve` 将被转发给下一个 `.then` 方法调用, 技术上叫: 沉降 (settlement).
* 只要像这样继续串联下去, 它会继续执行.

注意在第三个 `.then()` 方法时, 我们在 `.then` 中抛出了一个错误. 这意味着当前的 Promise 被拒绝. 然后它会在下一个 `.catch` 语句中被捕获, `Caught an error` 将会被输出. 然而一个 `.catch` 语句它自己永远是被 `resolve` 的, 所以不需要在语句里再写 `reject` (除非你故意抛出一个错误), 这也是为什么在 `.catch` 语句后还可以继续写 `.then` 的原因.

比较推荐的做法是在 `.then` 方法后执行 `.catch` 而不是使用 `onResolved` 和 `onRejected`, 我们来举个例子说明一下:

```js
const promiseThatResolves = () =>
  new Promise((resolve, reject) => {
    resolve();
  });

// Leads to UnhandledPromiseRejection
promiseThatResolves().then(
  () => {
    throw new Error();
  },
  err => console.log(err)
);

// Proper error handling
promiseThatResolves()
  .then(() => {
    throw new Error();
  })
  .catch(err => console.log(err));
```

我们创造一个永远能被 `resolve` 的 Promise 实例, 当你执行 `.then` 时, 可以带两个回调函数: `onResolved` 和 `onRejected`, 第一种写法, 在 `then` 种放入两个回调函数, 但是: 如果在第一个回调函数中继续抛出错误, 那么这个错误是不能被捕获的. 😅

第二种写法, 在 `.then` 语句的后面使用 `.catch` 捕获, 不光能捕获到执行函数 `promiseThatResolves` 的错误, 而且在 `.then()` 中的错误也是能被捕获到. 知道这样写的好处了吧!😁

### 总结

你可以执行上面的所有代码片段来更深入的学习. 一种比较好的实践就是, 把所有基于回调的函数都用 Promise 来重新实现. 如果你写 Node.js 的话, 你会发现 `fs` 还有其他模块都是基于回调函数来实现的. 所以会存在一些工具库, 它们把所有基于回调的实现方式使用 Promise 来实现了. 比如 Node.js 的 [util.promisify](https://nodejs.org/api/util.html#util_util_promisify_original) 和 [pify](https://github.com/sindresorhus/pify). 如果你在学习的话, 那么尽可能的尝试自己去实现. 或者说去读这些 Promise 实现库的源代码. 然后你就可以把这些最佳实践用于你的产品中啦!

还有一些关于 Promise 的东西没有完全讲到, 比如 `Promise.all` 和 `Promise.race` 方法, 处理 Promise 中的错误, 以及一些常见的反模式和细节等. 你可以参考下面的链接来学习更多关于 Promise 的知识.

### 参考

* [ECMA Promise Specification](http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects)
* [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
* [Google’s Developer’s Guide on Promises written by Jake Archibald](https://developers.google.com/web/fundamentals/primers/promises#promise-api-reference)
* [Exploring JS’s Chapter on Promises](http://exploringjs.com/es6/ch_promises.html#sec_first-example-promises)
* [Introduction to Promises](http://jamesknelson.com/grokking-es6-promises-the-four-functions-you-need-to-avoid-callback-hell/)
