---
title: call、apply、bind 的区别及应用
date: 2016-03-26 18:14:16
tags:
comments: false
---

在面向对象的编程中，经常会处理 `this` 的指向问题，改变 this 的指向就不得不谈谈今天的主角—— `call`、`apply`、`bind`。个人感觉 `this` 的问题初学者不同容易一下理解透彻，今天再来好好捋一捋加深理解。
<!-- more -->
### 作用
`call`、`apply`、`bind` 的作用就是改变函数执行时的上下文，即改变 `this` 指向。

`this` 的指向其实也就[不外乎这四种情况](https://ifyour.github.io/2016/02/19/JavaScript-%E4%B8%AD%E7%9A%84-this-%E7%94%A8%E6%B3%95%E6%80%BB%E7%BB%93/)，其实理解起来还是很容易的，理解不了也没关系，先记住，后面在工作中大量编码应用，写多了就知道为啥要这样用了。先来一个简单的例子。
```js
// 定义人类构造函数，属性是姓名，方法是输出自己的姓名
function Person(name) {
    this.name = name;
}

Person.prototype = {
    constructor: Person,
    showName: function() {
        console.log(this.name);
    }
};

var p1 = new Person('ifyour');
p1.showName(); // => ifyour

// 定义一个动物对象，它有个一姓名属性
var animal = {
    name: 'cat'
};

```
人类实例 `p1` 想要打印自己的姓名，只要调用自身的 `showName` 方法即可，但是动物呢？我也想要动物实例 `animal` 打印自己的名字，如何做呢？当然改变 this 咯，把人类的 `showName` 方法借给动物用。

```js
// 可以直接去原型上借用
Person.prototype.showName.call(animal);//=>cat

// 也可以从人类上生成的实例 p1 去借用
p1.showName.call(animal);//  => cat
p1.showName.apply(animal);// => cat
p1.showName.bind(animal)();//=> cat
```

### 区别
#### call、apply 与 bind
- `call`、`apply` 改变 `this` 指向后会 ***立即执行***
- `bind` 并不会执行

在上面的例子我们也看到了，`bind` 方法改变 this 时，还需要加一个 `()` 才能执行输出 `cat`。

#### call 与 apply

- `call` 把参数按顺序传入，即：`fn.call(obj, arg1, arg2, arg3...);`
- `apply` 把参数打包成 `Array` 后传入，即： `fn.apply(obj, [arg1, arg2, arg3...]);`


它们俩之间的差别在于 ***参数***，`call` 和 `aplly` 的第一个参数都是要改变上下文的对象，而 `call` 从第二个参数开始以参数列表的形式展现，`apply` 则是把除了改变上下文对象的参数放在一个数组里面作为它的第二个参数。

### 应用
知道了怎么使用和它们之间的区别，接下来我们来了解一下使用 `call`、`apply`、`bind` 的常见应用场景。

#### 求数组中的最大、最小值
```js
var arr = [34,5,3,6,54,6,-67,5,7,6,-8,687];

Math.max.call(Math, 34,5,3,6,54,6,-67,5,7,6,-8,687);
Math.max.apply(Math, arr);

Math.min.call(Math, 34,5,3,6,54,6,-67,5,7,6,-8,687);
Math.min.apply(Math, arr);
```
#### 将伪数组转化为数组
JavaScript 中的伪数组(例如通过 `document.getElementsByTagName` 获取的元素)具有 `length` 属性，并且可以通过 0、1、2…下标来访问其中的元素，但是没有 `Array` 中的 `push`、`pop` 等方法。我们可以利用 `call`、`apply` 来将其转化为真正的数组这样便可以方便地使用数组方法了。

```js
// 这是一个伪数组
var arrayLike = {
    0: 'aaaa',
    1: 'bbbb',
    2: 'cccc',
    length: 3
}
// 通过这个方法转换
var arr = Array.prototype.slice.call(arrayLike);
```
<div class='tip'>上面 `arr` 便是一个包含 `arrayLike` 元素的真正的数组啦( 注意数据结构必须是以数字为下标而且一定要有 `length` 属性 )
</div>

#### 数组追加
```js
var arr1 = [1,2,3];
var arr2 = [4,5,6];
[].push.apply(arr1, arr2);

console.log(arr1);// => [1, 2, 3, 4, 5, 6]
console.log(arr2);// => [1, 2, 3]
```

#### 变量类型判断
```js
function isArray(obj){
    return Object.prototype.toString.call(obj) == '[object Array]'
}
var arr1 = [1,2,3];
var arr2 = '[1,2,3]';

isArray(arr1);//   => true
isArray(arr2);//   => false
```

#### 继承
```js
// 基础类
var Person = function (name, age) {
  this.name = name;
  this.age = age;
};

// 女孩类继承基础人类
var Girl = function (name) {
  Person.call(this, name);
};
// 男孩类继承基础人类
var Boy = function (name, age) {
  Person.apply(this, arguments);
};

var g1 = new Girl ('Jilly');
var b1 = new Boy('ifyour', 18);
```
