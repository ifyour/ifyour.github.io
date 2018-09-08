---
title: Why Immutable Data?
date: 2018-05-05 21:14:23
tags:
comments: true
---
什么是不可变数据, 如何理解不可变数据, 不可变数据在项目中的实践. 弄清楚了这些问题, 你才能更好的处理项目中一些调优问题. 比如 React 性能优化等. 一起来学习下吧! 👨🏼‍💻

<!-- more -->
## What

> ***Immutable Data*** 是指一旦被创造后就不可以被改变的数据, 通过使用 Immutable Data, 可以让我们更容易的去处理缓存、回退、数据变化检测等问题, 简化我们的开发.


![image](https://user-images.githubusercontent.com/15377484/39663322-c4bb61ae-50a3-11e8-8267-4c2a80c00af7.png)


## Why
在原生 JS 中, 存在两种数据类型:

- 静态数据类型
- 引用数据类型

引用类型数据结构非常灵活, 节约内存, 能给开发带来不少便利. 但与此同时也产生了一些副作用:

#### Case 1
```js
let obj = { count: 1 };
let copyObj = obj;
copyObj.count = 2;

console.log(copyObj.count); // => 2
console.log(obj.count); // => 2, 这并不是我们期望的
```
#### Case 2
```js
let obj2 = { count: 1 };

// 团队协作, 大家都在用这个 obj2
unKnowFunction(obj2);
console.log(obj2.count); // 能保证这个结果一定是1吗?
```

针对以上引用类型产生的副作用, 有人提出了 ***深度拷贝*** (Deep Clone)的方法, 实现代码如下:
```js
function isObject(obj) {
  return typeof obj === 'object';
}

function isArray(arr) {
  return Array.isArray(arr);
}

function deepClone(obj) {
  if (!isObject(obj))  return obj;
  var cloneObj = isArray(obj) ? [] : {};

  for(var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];
      var copy = value;

      if (isObject(value)) {
        // 这里使用了递归
        cloneObj[key] = deepClone(value);
      } else {
        cloneObj[key] = value;
      }
    }
  }
  return cloneObj;
}
```

现在我们可以使用 `deepClone` 这个方法来解决文章一开头的问题了:
```js
let obj = {
  age: 5,
  list: [1, 2, 3]
}

// 深拷贝一个新的对象, 两者互相独立, 不存在引用关系
let trueCopyObj = deepClone(obj);
console.log(obj.list === trueCopyObj.list); // => false, 这是我们期望的

// 但是又有一个问题, 我只是想拷贝一个新的对象, 改一下 `age`
let obj2 = deepClone(obj);
obj2.age = 6;
// 难不成剩下的一堆引用类型的属性都要递归做一次深拷贝?
// 所以这明显是多余的, 并且存在严重的性能问题
```

在原生 JavaScript 中实现数据不可变, 有2个办法:

- ES6: `const`
- ES5: `Object.freeze`

但是这两种都是浅处理, 遇到深层次的数据结构, 就需要递归处理, 又会存在性能上的问题.

### How

针对以上一系列需求, 我们完全可以使用不可变数据结构来处理, 对应的实现库有:
- [facebook/immutable-js](https://github.com/facebook/immutable-js)
- [rtfeldman/seamless-immutable](https://github.com/rtfeldman/seamless-immutable)

Immutable.js 主要特点:
- 稳定数据结构 (Persistent Data Structure), 每次返回新的对象, 不存在引用
- 结构共享 (Structural Sharing), 基于哈希映射树, 可以实现部分结构共享
- 支持延迟操作 (Support Lazy Operation)
- 强大的 API (Power API)

针对以上特点, 我们用一些代码实例来说明一下:
```js
/**
 * 稳定数据结构
 */

let obj = {count: 1};
let map = Immutable.fromJS(obj);
let map2 = map.set('count', 2);

console.log(map.get('count')); // => 1
console.log(map2.get('count')); // => 2
```

```js
/**
 * 结构共享
 */

let obj = {
  count: 1,
  list: [1, 2, 3, 4, 5]
}
let map1 = Immutable.fromJS(obj);
let map2 = map1.set('count', 2);

console.log(map1.list === map2.list); // true
```

<div style="width: 300px; ">![image](https://user-images.githubusercontent.com/15377484/39665040-d92a0764-50bf-11e8-84e3-ad83cf758acd.gif)</div>

这张 GIF 很形象的解释了 `结构共享` 👍

```js
/**
 * 强大的 API
 */

let obj = {
  a: {
    b: {
      list: [1, 2, 3]
    }
  }
};
let map = Immutable.fromJS(obj);
let map2 = Immutable.updateIn(['a', 'b', 'list'], (list) => {
  return list.push(4);
});

console.log(map2.getIn(['a', 'b', 'list'])); // => List [ 1, 2, 3, 4 ]
```

还有一个特点就不举例子了, 超纲! 😁

### 参考
- [Immutable 详解及 React 中实践](https://github.com/camsong/blog/issues/3)
- [浅合并 (shallow merge) 例子](https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge/28248548)
- [Lodash merge 方法](https://lodash.com/docs/4.17.10#merge)
