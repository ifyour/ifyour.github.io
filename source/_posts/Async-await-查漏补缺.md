---
title: Async/await 查漏补缺
comments: true
date: 2018-07-22 14:44:15
tags:
from:
---

上周末我复习了 Promise 的用法，通过一些实例加深了 Promise 的理解。今天来看下异步编程的终极解决方案 async/await。JavaScript 中的异步操作从最初的 callback 演进到 Promise，再到 Generator，都是逐步的改进，而 async 函数的出现仿佛看到了异步方案的终点，用同步的方式写异步代码。

<!-- more -->

### async 函数

简单解释：async 函数就是 Generator 函数的语法糖。

```js
// Generator 函数写法

let promise = function(val) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => {
      console.log(val);
      resolve(val);
    }, 1000);
  });
};

let gen = function*() {
  let p1 = yield promise('1');
  let p2 = yield promise('2');
};

let genF = gen(); // Iterator 对象
genF.next(); // => 1
genF.next(); // => 2
```

更多 `yield` 表达式可以看这篇文章：[Generator 函数语法解析](https://juejin.im/post/5a6db41351882573351a8d72)。

使用 async 来改写上面的 `gen` 函数 👇：

```js
let gen = async function() {
  let p1 = await promise('1');
  let p2 = await promise('2');
};

// 输出结果 👇：
1
2
```

Async 函数是在 Generator 函数上进行的改进，语法上 Generator 函数的星号换成了 `async`，`yield` 换成了 `await`。

而 async 也与 Generator 函数 **不同**：

- `async` 自带内置执行器，Generator 函数需要依靠执行器，并且 `async` 可以和普通函数一样，只需要一行
- 相对 Generator 函数，`async` 和 `await` 语义更清楚
- 适用性强，`yield` 后只能是 Thunk 函数和 Promise 对象，而 `await` 后可以是 Promise 对象和原始类型的值 (数值、字符串、布尔型等)

### async 作用

寄予 async 函数的期望是希望可以帮助我们解决异步操作问题，所以需要搞清楚 async 函数的返回值是什么。

```js
async function asyncAwait() {
  return 'async await';
}

let a = asyncAwait();
console.log(a);

// 输出结果 👇：
Promise {<resolved>: "async await"}
```

可以看出 async 函数返回的是一个 Promise 对象，如果函数中 return 一个直接量，async 函数会封装成 Promise 对象返回，而如果没有返回值时，async 函数会返回 `undefined`:

```js
// 没有返回值时的输出结果 👇：
Promise {<resolved>: undefined}
```

在没有结合 await 时，async 函数会立即执行，返回一个 Promise 对象。

### await 等待

await 是个运算符，等待的结果是 Promise 对象或其他值，比如：

```js
function func1() {
  return 'async';
}

async function func2() {
  return Promise.resolve('await');
}

async function asyncAwait() {
  let f1 = await func1();
  let f2 = await func2();
  console.log(f1, f2);
}

asyncAwait();

// 输出结果 👇：
async await
```

await 表达式的运算取决于等待的结果，如果它等到的不是一个 Promise 对象，那运算结果就是它等到的东西, 而如果它等到的是一个 Promise 对象，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为表达式的运算结果。

<div class="tip">**async 函数调用** 会封装在 Promise 中，这也是 await 需要在 async 函数中使用的原因。</div>

### async/await 链式处理

对于多个异步操作中，Promise 的 then 可以解决多层回调问题。

```js
// Promise 解决多层嵌套问题

function ajax(t) {
  return new Promise(resolve => {
    setTimeout(() => resolve(t + 200), t);
  });
}

function step1(t) {
  console.log(`step1 in ${t}ms`);
  return ajax(t);
}

function step2(t) {
  console.log(`step2 in ${t}ms`);
  return ajax(t);
}

function step3(t) {
  console.log(`step3 in ${t}ms`);
  return ajax(t);
}

function submit() {
  console.time('submit');
  step1(200)
    .then(time2 => step2(time2))
    .then(time3 => step3(time3))
    .then(result => {
      console.log(`result is ${result}ms`);
      console.timeEnd('submit');
    });
}

submit();
```

```js
// async 函数实现，解决多层嵌套

function ajax(t) {
  return new Promise(resolve => {
    setTimeout(() => resolve(t + 200), t);
  });
}

function step1(t) {
  console.log(`step1 in ${t}ms`);
  return ajax(t);
}

function step2(t) {
  console.log(`step2 in ${t}ms`);
  return ajax(t);
}

function step3(t) {
  console.log(`step3 in ${t}ms`);
  return ajax(t);
}

async function submit() {
  console.time('submit');
  const t1 = 200;
  const t2 = await step1(t1);
  const t3 = await step2(t2);
  const result = await step3(t3);
  console.log(`result is ${result}`);
  console.timeEnd('submit');
}

submit();
```

输出结果 👇：

```text
step1 in 200ms
step2 in 400ms
step3 in 600ms
result is 800
submit: 1209.85107421875ms
```

而如果需求变更，每一步的参数都是之前步骤的结果后，async 函数可以写成：

```js
function ajax(t) {
  return new Promise(resolve => {
    setTimeout(() => resolve(t + 200), t);
  });
}

function step1(t1) {
  console.log(`step1 in ${t1}ms`);
  return ajax(t1);
}

function step2(t1, t2) {
  console.log(`step2 in ${t1}ms,${t2}ms`);
  return ajax(t1 + t2);
}

function step3(t1, t2, t3) {
  console.log(`step3 in ${t1}ms,${t2}ms,${t3}ms`);
  return ajax(t1 + t2 + t3);
}

async function submit() {
  console.time('submit');
  const t1 = 200;
  const t2 = await step1(t1);
  const t3 = await step2(t1, t2);
  const result = await step3(t1, t2, t3);
  console.log(`result is ${result}`);
  console.timeEnd('submit');
}

submit();
```

输出结果 👇：

```text
step1 in 200ms
step2 in 200ms,400ms
step3 in 200ms,400ms,800ms
result is 1600
submit: 2210.47998046875ms
```

### async/await 注意点

1.  `async` 用来 **申明里面包裹的内容可以进行同步的方式执行**，`await` 则是进行执行顺序控制，每次执行一个 `await`，阻塞代码执行等待 `await` 返回值，然后再执行之后的 `await`
2.  `await` 后面调用的函数需要返回一个 Promise
3.  `await` 只能用在 `async` 函数之中，用在普通函数中会报错
4.  `await` 命令后面的 Promise 对象，运行结果可能是 `rejected`，所以最好把 `await` 命令放在 `try...catch` 代码块中

#### async/await 结合 try/catch 写法

```js
async function asyncAwait() {
  try {
    await promise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法
async function asyncAwait() {
  await promise().catch(function(err) {
    console.log(err);
  });
}
```

### 总结

Async/await 是 ES7 的重要特性之一，也是目前社区里公认的优秀异步解决方案，当你深入了解原理后会发现仿佛看到了异步回调隧道的尽头亮光。

### 参考

- [Generator 函数的语法 @阮一峰《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#docs/generator)
- [async 函数 @阮一峰《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#docs/async)
