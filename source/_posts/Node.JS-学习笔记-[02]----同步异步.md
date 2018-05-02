---
title: 'Node.JS 学习笔记 [02] -- 同步异步'
date: 2015-1-3 08:27:02
---

在使用 npm 的时候，我发现在速度实在太慢，安装小一点的包确实没啥问题，装大一点的，依赖多一点的包的时候，问题就来了。速度慢，响应迟钝。***nrm*** 是一个非常好的解决方案，安装 nrm 后，可以使用简单的命令快速来切换 npm 源，比如切换到 cnpm、taobao 源等，详细的使用方法可以点[这里](https://github.com/Pana/nrm#install)进去了解下。
<!-- more -->
### Node.js 使用

#### Node.js 控制台
前面说了，Node.js 提供了 REPL 模式来解析输入的每条命令，现在可以实战一下了，打开终端，然后输入 `node` 进入 Node.js 开始敲命令吧！
```js
console.log('hello,world!'); // 普通输入
console.error('错误消息');    // 错误输出
console.time('time');        // 会计算在这个表达式之间的代码块执行耗时
// {...}
console.time('time');
console.assert(3>10,'str..');// 断言：表达式不成立，会输出后面的字符串
```

#### Node.js 作用域
- 全局作用域：没有使用 `var` 隐式声明的一个变量，会享受全局作用域，或者在 `global` 上挂载的变量，也具有全局作用域的属性，全局变量可以被其它模块使用。
- 局部作用域：在 Node.js 中一个文件就是一个模块，在这个模块中定义的变量，只能在这个模块中使用。

```js
// 这些变量都属于全局变量
name = 'ifyour';
global.age = 18; // Node.js 中的 global 类似 JavaScript 中的 window
```
<div class='tip'>
尽量避免使用全局变量，会造成变量污染。
</div>

#### 回调函数
Node.js 中大量使用了回调函数，关于回调函数，我之前在简书写了一篇，我的理解心得，有兴趣的可以[去看看](http://www.jianshu.com/p/1383f4cb9a75)。关于回调函数，我也正是在 Node.js 中对它的理解更为深刻了，Node.js 大量的异步代码都借助回调函数实现，正因如此，性能更高呀。看一个非常简单的例子。

```js
// 定义回调函数
function cb(){
  console.log('Hello,callback!');
}

// 把回调函数的引用（指针）传入该函数，一秒后执行
setTimeout(cb,1000);  
```
借助这个例子，可以看到回调函数的实现机制：
- 定义一个普通函数（其实它就是回调函数）
- 将该函数的引用地址作为参数传给调用者，调用者本身也是一个函数，例子中的 `setTimeout`
- 当特定条件发生时，调用者使用这个引用地址去执行该函数

回调函数的用途很多，比如实现事件注册、异步代码等。在 jQuery 中的动画就是回调函数的经典用法，`animate(x,y,z,function(){...})`,当一个动画执行完成后，执行回调函数。当点击一个按钮时，需要执行的函数块，这些都是回调函数。

### Node.js 事件
Node.js 中的 event 模块就是提供事件编程的 API，所有具有触发事件的对象都继承或内部包含了 `EventEmitter` 对象。来一个简单的例子吧！
```js
//events 模块中的 EventEmitter 对象，定义了事件对象的基础信息和行为
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();// 实例化一个 event 对象
event.on('myevent',function(name){ // 绑定 myevent 事件
    console.log('Hi!' + name);
});
event.emit('myevent','ifyour');// 触发事件
```
#### 事件常用方法

|方法                               | 描述                                                     |
|:---------------------------------|:---------------------------------------------------------|
|addListener(event, listener)      | 为指定事件添加一个监听器到监听器数组的尾部。与on等价          |
|on(event, listener)               | 为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数 |
|once(event, listener)             | 为指定事件注册一个单次监听器                                |
|removeListener(event,listener)    |移除指定事件的某个监听器，监听器必须是该事件已经注册过的监听器  |
|removeAllListeners([event])       |移除所有事件的所有监听器如果指定事件，则移除该事件的所有监听器  |
|setMaxListeners(n)                |setMaxListeners 函数用于提高监听器的默认限制的数量，默认是 10 |
|listeners(event)                  |返回指定事件的监听器数组                                    |
|emit(event, [arg1], [arg2], [...])|按顺序执行监听器，如果事件有注册监听返回 true，否则返回 false |


### Node.js 异步与同步

***同步***：一个任务执行完成后，才能执行下一个任务，执行总时间等于所有任务消耗时间之和。
***异步***：几个任务同时执行，不限制先后，执行总时间等于执行耗时最长的那个任务的消耗时间。

在 Node.js 中每一个任务有一个或多个回调函数，前一个任务结束后，不是执行后一个任务，而是执行回调函数，后一个任务则是不等前一个任务结束就执行，所以程序的执行顺序与任务的排列顺序是不一致的、异步的。

#### 异步的实现
- 回调函数
- 事件（基于回调函数）
- Promise （ES6）

前面已经讲了回调函数的实现方式，下面举两个例子来说明 Node.js 中 ***事件*** 和 ***Promise*** 实现异步。
```js
// 事件（基于回调函数）实现异步
var fs = require('fs');

var stream = fs.createReadStream('./data');// 调用 fs 模块创建一个读取流对象
stream.on('data',getData);// 读取事件，每次读取时触发调用回调函数 getData
stream.on('end',getDataDone);// 读取完毕调用回调函数 getDataDone

function getDataDone() {
    console.log('read done!');
}
function getData(data) {
    console.log(data.toString());
}
```
上面的代码中，当读取多个 `data` 文件时，输出的内容的顺序可能不一致，因为事件采用回调函数实现了异步操作。可以看出，事件实现异步，本质上还是回调函数。

> 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。

下面来看看 `Promise` 的一个实例：
```js
var fs = require('fs');

var p = new Promise(function (resolve, reject) {// 使用 Promise 生成实例
    fs.readFile('./1', 'utf-8', function (err, data) {// readFile 是一个异步方法
        if (!err) {
            resolve(data);
        } else {
            reject(err);
        }
    })
});

p.then(function (data) {// 调用实例的 then 方法
    console.log(data);
}, function (err) {
    console.log(err);
});
```
ES6 规定，Promise 对象是一个构造函数，用来生成 Promise 实例。Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 `resolve` 和 `reject`。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

- resolve : 在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；
- reject  : 在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise实例生成以后，可以用 `then` 方法分别指定 Resolved 状态和 Reject 状态的回调函数。
```js
promise.then(function(value) {
  // success
}, function(error) {
  // failure
});
```
有了 Promise 对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，Promise 对象提供统一的接口，使得控制异步操作更加容易。

下面这个例子，在未使用 `Promise` 时，我们想要 `p1` 读取完数据后，紧接着 `p2` 、`p3` 读取，就需要在 `p1` 的回调读取成功函数里继续写 `p2` 的读取，类似的 `p3` 也要在 `p2` 的回调函数中写，这就造成了 ***层层嵌套*** 不利于代码阅读。而使用 `Promise` 后，`then` 方法把里面的回调函数统一提取出来， 可读性更好了，也方便理解。
```js
// Promise 提供的 then 方法避免层次嵌套，相当于实现 then 的链式操作
// p1 执行完 then 方法后，通过 return p2 ，让 p2 继续执行 then 方法
p1.then(function(data){
    console.log(data);
    return p2;
},function(err){
    console.log(err);
    return p2;
}).then(function(data){
    console.log(data);
    return p3;
},function(err){
    console.log(err);
    return p3;
}).then(function(data){
    console.log(data);
},function(){
    console.log(err);
});
```
更多 Promise 语法，可以参考阮一峰的《[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/promise#基本用法)》。
