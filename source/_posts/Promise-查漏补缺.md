---
title: Promise 查漏补缺
comments: true
date: 2018-07-15 09:17:58
tags:
from:
---

Promise 的重要性不用多说, 曾经看到关于 JavaScript 的描述 --- JS 的三座大山就是: `原型`/`作用域`/`异步`, 所以如果说你是一个合格的 JavaScript 程序员, 这三块的内容肯定是要吃透的. 纵观 JavaScript 的异步史, 它经历了 `callback` -> `Promise` -> `Generator` -> `async-await` 这样一个历程, 前前后后编写异步代码的变化. 从变化中就可以体会到, 确实越来越简洁, 越来越易读. 掌握它们, 你能写出更优雅的代码.

<!-- more -->

### Promise 简介

![image](https://user-images.githubusercontent.com/15377484/42730799-8a283548-8830-11e8-9cc0-adb620f7f71a.png)

ECMAscript6 原生提供了 Promise 对象, 由浏览器直接支持, 目前大多数浏览器都已经实现了, 低版本浏览器可以使用 *es6-promise* 库来填平兼容性问题. Promise 最大的好处是把执行代码和处理代码分离开, 使异步操作逻辑更加清晰.

### Promise 特点

1. 对象的状态不受外界影响 Promise 对象代表一个异步操作, 有三种状态:
  * pending - 初始状态
  * fulfilled - 操作成功完成
  * rejected - 操作失败
2. 一旦状态改变, 就不会再发生变化. Promise 对象的状态改变. 只有两种情况: 从 `Pending` 变为 `Resolved` 和从 `Pending` 变为 `Rejected`. 只要这两种情况发生, 状态就会固定, 不会再变了, 会一直保持这个结果, 与事件不同的是, 就算改变已经发生了, 再对 Promise 对象添加回调函数, 也会立即得到这个结果, 而事件一旦错过再去监听, 就不会得到结果.

![image](https://user-images.githubusercontent.com/15377484/42730787-1d531df2-8830-11e8-8514-0a810d945440.png)

<div class="tip">只有异步操作的结果可以决定当前是哪一种状态, 其他操作都不会影响状态改变, 这也是 Promise 最本质的特性, 对于调用者的一种承诺</div>

### Promise 优缺点

优点:

  * 可以将异步操作以同步操作的流程表达出来, 避免了层层嵌套的回调函数 Promise
  * 对象提供统一的接口, 使得控制异步操作更加容易

缺点:

  * 无法取消 Promise, 一旦新建它就会立即执行, 无法中途取消
  * 如果不设置回调函数, Promise 内部抛出的错误, 不会反应到外部
  * 当处于 `Pending` 状态时, 无法得知目前进展到哪一个阶段（刚刚开始或者即将完成）

### Promise.prototype.then

Promise.prototype.then 方法返回的是一个新的 Promise 对象, 因此可以采用链式写法

```js
ajax('http://some.api.com/')
  .then((json) => {
    return json.post;
  })
  .then((post) => {
    // post 处理
  });
```

👆 代码中使用了两个 then 方法, 分别指定了对应的回调参数. 第一个回调函数完成后, 会将返回结果作为参数, 传入第二个 then 中的回调函数执行.

```js
ajax('http://some.api.com/')
  .then((jsonURL) => {
    return ajax(jsonURL);
  })
  .then((post) => {
    // post处理
  });
```

👆 如果第一个回调函数返回的是 Promise 对象, 后一个回调函数会等待该 Promise 对象的运行结果, 等 Promise 运行结果返回, 再进一步调用. 这种设计使得嵌套的异步操作, 可以被很容易得改写, 把回调函数的 "横向发展" 改为了 "向下发展".

### Promise.prototype.catch

Promise.prototype.catch 错误捕捉方法是 `Promise.prototype.then(null, rejection)` 的别名, 用来指定发生错误时的处理函数.

```js
ajax('http://some.api.com/')
  .then((post) => {
    throw Error();
  })
  .catch((error) => {
    // 捕捉回调函数运行时发生的错误进行处理
    console.log('error:' + error);
  });
```

Promise 对象的错误具有 "冒泡" 性质, 会一直向后传递, 直到被捕获为止.

```js
ajax('http://some.api.com/')
  .then((jsonURL) => {
    return ajax(jsonURL);
  })
  .then((comments) => {
    throw Error();
  })
  .catch((error) => {
    // 处理前两个回调函数的错误
    console.log('error:' + error);
  });
```

### Promise.resolve

Promise.resolve 方法可以将现有对象转为 Promise 对象. 如果 Promise.resolve 方法的参数, 不是 thenable 对象 (具有 then 方法的对象), 则返回一个新的 Promise 对象, 且它的状态为 `fulfilled`.

```js
const resolve = Promise.resolve('promise resolve');

resolve.then( (s) => {
  console.log(s);
});

// output 👇
promise resolve
```

如果 Promise 对象的实例状态为 `fulfilled`, 回调函数会立即执行, Promise.resolve 方法的参数就是回调函数的参数. 如果 Promise.resolve 方法的参数是一个 Promise 对象的实例, 则会返回该 Promise 实例.

### Promise.reject

Promise.reject(reason) 方法与 resolve 方法类似, 也会返回一个新的 Promise 实例, 但该实例的状态为 `rejected`. Promise.reject 方法的参数, 会被传递给实例的回调函数.

```js
const reject = Promise.reject('promise reject');

reject.then(null, (err) => {
  console.log(err)
});

// output 👇
promise reject
```

### Promise.all

Promise.all 方法用于将多个 Promise 实例, 包装成一个新的 Promise 实例, 该方法一般接受一个数组作为参数, 但不一定是数组, 只要具有 iterator 接口. 且返回的每个成员都是 Promise 实例.

```js
const getRandom = () => +(Math.random() * 1000).toFixed(0);
const ajax = (taskID) => new Promise(resolve => {
  let timeout = getRandom();
  console.log(`taskID=${taskID} start.`);
  setTimeout(function() {
    console.log(`taskID=${taskID} finished in time=${timeout}.`);
    resolve(taskID)
  }, timeout);
});

Promise.all([ajax(1), ajax(2), ajax(3)])
  .then(resultList => {
    console.log('results:', resultList);
  });
```

输出结果 👇:

```text
taskID=1 start.
taskID=2 start.
taskID=3 start.
taskID=2 finished in time=27.
taskID=3 finished in time=257.
taskID=1 finished in time=876.
results: [1, 2, 3]
```

Promise.all 状态分为两种:

* 只有 ajax(1)、ajax(2)、ajax(3) 的状态都变成 `fulfilled`, Promise.all 返回的状态才会变成 `fulfilled`, 此时 ajax(1)、ajax(2)、ajax(3) 的返回值组成一个数组, 传递给 Promise.all 的回调函数.
* 只要 ajax(1)、ajax(2)、ajax(3) 之中有一个是 `rejected`, Promise.all 返回的状态就变成 `rejected`, 此时第一个被 reject 的实例的返回值, 会传递给 Promise.all 的回调函数.

### Promise.race

Promise.race 方法也是将多个 Promise 实例, 包装成一个新的 Promise 实例, 与 Promise.all 不同的是一旦有状态改变, 就会返回第一个状态改变的 Promise 实例返回值.

```js
const getRandom = () => +(Math.random() * 1000).toFixed(0);
const ajax = (taskID) => new Promise(resolve => {
  let timeout = getRandom();
  console.log(`taskID=${taskID} start.`);
  setTimeout(function() {
    console.log(`taskID=${taskID} finished in time=${timeout}.`);
    resolve(taskID)
  }, timeout);
});

Promise.race([ajax(1), ajax(2), ajax(3)])
  .then(result => {
    console.log('results:', result);
  });
```

输出结果 👇:

```text
taskID=1 start.
taskID=2 start.
taskID=3 start.
taskID=2 finished in time=59.
results: 2
taskID=3 finished in time=707.
taskID=1 finished in time=854.
```

Promise.race 虽然 **返回第一个状态改变的 Promise 实例**, 但不能阻止其他 Promise 实例状态改变.

如果 `Promise.all` 和 `Promise.race` 的参数不是 Promise 实例, 它们就会调用 Promise.resolve 方法, 将参数转为 Promise 实例, 再进一步处理.

### 参考

* [js-async-tutorial @GitHub](https://github.com/wangfupeng1988/js-async-tutorial)
* [Promise constructor @MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
