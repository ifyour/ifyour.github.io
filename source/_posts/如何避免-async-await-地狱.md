---
title: 如何避免 async/await 地狱
comments: true
date: 2018-05-20 22:11:35
tags:
from: https://medium.freecodecamp.org/avoiding-the-async-await-hell-c77a0fb71c4c
---

最近阅读了 Aditya Agarwal 的一篇文章：How to escape async/await hell。这篇文章主要讨论了过度使用 async/await 导致的新的「地狱」问题，其已经在 Medium 上获得了 19k+ 的 Applause。

<!-- more -->

<div class="tip">
  async/await 是 ES7 的新语法。在 async/await 标准出来之前，JavaScript 的异步编程经历了 callback --> promise --> generator 的演变过程。
</div>

在 callback 的时代，最让人头疼的问题就是回调地狱 (callback hell)。所以，在 async/await 一经推出，社区就有人认为「这是 JavaScript 异步编程的终极解决方案」。但 async/await 也可能带来新的问题。

> 好不容易逃离了一个「地狱」，又马上陷入另一个「地狱」了。

### 何为 async/await 地狱

在编写异步代码时，人们总是喜欢一次写多个语句，并且在一个函数调用之前使用 await 关键字。这可能会导致性能问题，因为很多时候一个语句并不依赖于前一个语句——但使用 await 关键字后，你就需要等待前一个语句完成。

#### 示例

假设你要写一个订购 pizza 和 drink 的脚本，代码可能是如下这样的：

```js
(async () => {
  const pizzaData = await getPizzaData(); // async call
  const drinkData = await getDrinkData(); // async call
  const chosenPizza = choosePizza(); // sync call
  const chosenDrink = chooseDrink(); // sync call
  await addPizzaToCart(chosenPizza); // async call
  await addDrinkToCart(chosenDrink); // async call
  orderItems(); // async call
})();
```

这段代码开起来没什么问题，也能正常的运行。但是，这并不是一个好的实现，因为这把本身可以并行执行的任务变成了串行执行。

选择一个 drink 添加到购物车和选择一个 pizza 添加到购物车可以看作是两个任务，而这两个任务之间并没有相互依赖的关系，也没有特定的顺序执行关系。所以这两个任务是可以并行执行的，这样能提高性能。而上述代码将二者变成了串行执行，显然是降低了程序性能的。

### 更糟糕的例子

假设要写一个程序，根据 followers 数用来显示 GitHub 中国区用户的排名情况。

如果只是获取排名，我们可以调用 Github 官方的 [Search users](https://developer.github.com/v3/search/#search-users) 接口，伪代码如下：

```js
async function getUserRank() {
  const data = await fetch(search_url);
  return data;
}

getUserRank();
```

调用 getUserRank 函数就能获取到想要的结果。但是，你可能还要想要获取每个用户的 follower 数、email、地区和仓库等数据，而 Search users 接口并没有返回这些数据，你可能需要再去调用 [Single user](https://developer.github.com/v3/users/#get-a-single-user) 接口。

然后上述代码可能被改写为：

```js
async function getUserRank() {
  const data = await fetch(search_url);
  const res = [];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const user = await fetch(user_url);
    res.push({...item, ...user});
  }

  return res;
}

getUserRank();
```

运行查看结果，自己想要的数据都拿到了。但是，你发现一个问题，程序运行时间有点长，该怎么优化下呢？

其实，铺垫了这么长，就是想说明一个问题：你陷入了 async/await 的地狱。

上述代码的问题在于，获取每个用户资料的请求并不存在依赖性，就类似上文中的选择 pizza 和 drink 一样，这是可以并行执行的请求。而根据上述代码，请求都变成了串行执行，这当然会损耗程序的性能。

按照上述代码，可以看一下其异步请求的动态图：

![image](https://user-images.githubusercontent.com/7871813/40270076-c08ec820-5bb9-11e8-8470-5e716e87dc76.gif)

可以看到，获取用户资料的每个请求都需要等到上一个请求完成之后才能执行，Waterfall 处于一个串行的状态。那要怎么改进这个问题呢？

既然获取每个用户资料的请求并不存在依赖性，那么我们可以先触发异步请求，然后延迟处理异步请求的结果，而不是一直等该请求完成。根据这个思路，那可能改进的代码如下：

```js
async function getUserDetails (username) {
  const user = await fetch(user_url);
  return user;
}

async function getUserRank () {
  const data = await fetch(search_url);
  const promises = data.map((item) => getUserDetails(item.username));
  await Promise.all(promises).then(handleYourData);
}

getUserRank();
```

可以看一下异步请求的动态图：

![image](https://user-images.githubusercontent.com/7871813/40270077-c2536602-5bb9-11e8-9438-a15ac05b41e0.gif)

可以看到，获取用户资料的异步请求处理不再是串行执行，而是并行执行了，这将大大提高程序的运行效率和性能。

### 总结

Aditya Agarwal 在其文章中也给出了怎么避免陷入 async/await 地狱的建议：

1. 首先找出依赖于其他语句的执行的语句
2. 然后将有依赖关系的一系列语句进行组合，合并成一个异步函数
3. 最后用正确的方式执行这些函数

### 参考

* [精读《async/await 是把双刃剑》](https://github.com/dt-fe/weekly/blob/master/55.%E7%B2%BE%E8%AF%BB%E3%80%8Aasync%20await%20%E6%98%AF%E6%8A%8A%E5%8F%8C%E5%88%83%E5%89%91%E3%80%8B.md)
* [async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)
* [体验异步的终极解决方案 - ES7 的 Async/Await](https://cnodejs.org/topic/5640b80d3a6aa72c5e0030b6)
* [How to escape async/await hell](https://github.com/dwqs/blog/issues/65)
