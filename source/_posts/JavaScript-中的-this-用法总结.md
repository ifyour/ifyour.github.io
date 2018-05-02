---
title: JavaScript 中的 this 用法总结
date: 2016-02-19 19:23:36
tags:
---

`this` 是 Javascript 语言的一个关键字。它代表函数运行时，自动生成的一个内部对象，只能在函数内部使用。随着函数使用场合的不同，`this` 的值会发生变化。但是有一个总的原则，那就是 `this` 指的是，调用函数的那个对象。

<!-- more -->
### 四种情况
#### 纯粹的函数调用

```js
// eg:1
console.log(this);// => window 对象

// eg:2
function fun(){
    this.x = 1;
}
console.log(x); // => 1
// this 指向全局对象，即 DOM 中的 window 对象
```

#### 作为对象方法的调用

```js
var user = {
    count: 1,

    getCount: function() {
        return this.count;
    }
};

console.log(user.getCount());// 1
// this 指向调用 getCount 方法的对象 user
```

#### 作为构造函数的调用
```js
var x = 2;

function fun(){
    this.x = 1;
}

var obj = new fun();
console.log(obj.x); // => 1
console.log(x); // => 2
//this 就指向构造器创建的新对象 obj
```

#### apply/call 调用
`apply()` 是函数对象的一个方法，它的作用是改变函数的调用对象，它的第一个参数就表示改变后的调用这个函数的对象，无参数时传入 window 对象。因此，`this` 指的就是这第一个参数。
```js
var x = 0;

function fun(){
    console.log(this.x);
}

var obj = {};
obj.x = 1;
obj.m = fun;

obj.m(); //           => 1  this 指向调用方法的对象即：obj
obj.m.apply();  //    => 0  this 指向的是全局对象即：window
obj.m.apply(obj);//   => 1  this 指向的第一个参数即：obj
obj.m.call(obj);//    => 1  this 指向的第一个参数即：obj
```

### 总结
1. 纯粹的函数调用: `this` 就代表全局对象 Global（浏览器下就是 window）
2. 作为对象方法的调用: `this` 指向调用方法的对象
3. 作为构造函数调用：`this` 就指向构造器创建的新对象
4. `apply`, `call` 调用：`this` 指向就是这些函数的第一个参数

下一篇文章总结一下：`apply`、`call`、`bind` 的用法 :P
