---
title: 'Node.JS 学习笔记 [01] -- 入门'
date: 2015-1-2 19:00:24
tags:
comments: false
---

整理记录 Node.js 学习笔记，作为前端人员，非常有必要了解后端的一些知识，方便与后端的同事协作，提高效率，搞好前端后，也可以尝试往后端发展，成为一名全栈工程师！:P
<!-- more -->
![](http://ww4.sinaimg.cn/mw690/6057861cgw1fb6vlzd7i7j20go08cjro.jpg)
### Node.js 介绍
Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。Node.js 的包管理器 npm，是全球最大的开源库生态系统。

#### Node.js 和 JavaScript 的区别
- Node.js 是一个可以运行 JavaScript 的平台，基于 ChromeV8 引擎，是对 JavaScript 的增强，使 JavaScript 具备了服务器语言的开发能力，比如操作文件、读取系统信息、网络传输等。
- JavaScript 是一门编程语言，只要有 JavaScript 引擎就能运行并且如果JavaScript运行在浏览器中，浏览器对JavaScript加入了浏览器和文档操作的接口（方法）。

<div class="tip">
简单理解：浏览器中 JavaScript 主要是操作 BOM 和 DOM，而 Node.js 则是具有服务端语言处理能力（处理网络请求，保存数据到数据库等）。
</div>

#### 官方网站
- 英文社区： https://www.npmjs.com/
- 中文社区：http://cnodejs.org/

#### Node.js 安装及运行
在 Node.js 的官方提供的[下载频道](https://nodejs.org/en/download/)选择对应的平台及安装程序安装即可。Node.js 提供了 `REPL（Read-Evaluate-Print-Loop）` 模式，即 ***交互式命令行解析器***，可以直接输入命令行，编写 Node.js 代码。安装成功后，我们可以在终端里输入 `node -v` 获取当前的 Node.js 版本号，能获取表示成功安装。

### Node.js 模块
模块对于 Node.js 来说是一个非常重要的概念，一个特定功能的文件就是一个模块。模块之间可能会存在一定的依赖关系，比如我写了一个 jQuery 轮播的插件，它就依赖 jQuery 库，在 Node.js 中可以非常方便的表示清楚这种依赖关系。说到模块，还需要说一个就是编写模块的规范。

#### 模块规范
- ***AMD*** (Asynchronous Module Definition)，这种规范是异步的加载模块，RequireR.js 应用了这一规范,适合客户端浏览器环境。
- ***CMD*** (Common Module Definition), 是 Sea.js 推崇的规范。
- ***CommonJS*** , 是诞生比较早的。Node.js 就采用了 CommonJS 的规范来定义模块。但是 CommonJs 采用的是同步加载文件方式，只适用于服务端（Node.js平台）。

#### 使用模块
模块定义完成后，就可以使用模块，通过命令行参数传递给 Node.js 以启动程序的模块被称为 ***主模块***。主模块负责调度组成整个程序的其它模块完成工作。其实就类似网站中的 `index.html`，Node.js 中的主模块通常是 `main.js` 或者 `index.js`。
```js
var http = require('http');// 通过 require 引入 http 模块
```

#### 模块组成
在上条命令中，我们通过 require 引入了一个 http 模块，实际上作为一个单独的模块文件，Node.js 为我们在外层嵌套了一个函数，正因为有了这个函数，在这个文件中声明的变量就是私有变量啦，那么每个模块之间就不会产生干扰了。那么来看看这个函数长什么样子。
```js
function (exports, require, module, __filename, __dirname) {
    var http = require('http');// 通过 require 引入 http 模块
}
```
最外层，Node.js 为我们的代码包裹了这样一个函数，这个函数传入了几个参数，我来解释一下：
- exports ：用于在当前模块中加载和使用别的模块，传入一个模块名，返回一个模块导出对象。
- require：当前模块的导出对象，用于导出模块公有方法和属性。
- module：访问到当前模块的一些相关信息，但最多的用途是替换当前模块的导出对象。
- __filename：当前模块的文件名
- __dirname：当前模块的目录名

#### 模块分类
Node.js 提供两种模块类型：
1. 核心模块：是由 Node.js 平台提供的模块，也可以称为“系统模块”。
2. 文件模块：以 `..` 或 `.` 和 `/` 开始的标识符，这里都被当做文件模块来处理。

#### node_modules 文件夹
该文件夹是 Node.js 中的特殊文件夹，用来存放 node 模块，如果一个模块既不是系统模块，也不是文件模块，那么它会被存放在 node_modules 文件夹中。使用 `console.log(module.paths);` 可以打印 Node.js 会遍历的 node_modules 目录。
```js
[ '/Users/wangmingming/Documents/Projects/JSstudy/12.26/node_modules',
  '/Users/wangmingming/Documents/Projects/JSstudy/node_modules',
  '/Users/wangmingming/Documents/Projects/node_modules',
  '/Users/wangmingming/Documents/node_modules',
  '/Users/wangmingming/node_modules',
  '/Users/node_modules',
  '/node_modules' ]
```
<div class="tip">
在调用一个模块时，Node.js 沿路径向上逐级递归，直到根目录下的 node_modules 目录。CommonJS 模规范也允许在标识符中不包含文件扩展名，这种情况下，Node 会按 js、json、node 的次序补足扩展名，依次尝试。
</div>

### 包 (Package)
把由多个子模块组成的大模块称做包，并把所有子模块放在同一个目录里。在一个包中，会用 `package.json` 文件中的 `main` 属性用来描述这个包的主文件。

#### NPM (Node Package Manager)
大名鼎鼎的 NPM 实际上就是用来管理包的一个工具，借助 NPM 我们可以快速的安装和管理依赖包。下面是我整理的 npm 常用命令。
```bash
npm init                   #  初始化包，要求填入包名等信息
npm install <name>         #  本地安装一个包
npm install <name> -g      #  全局安装一个包
npm install <name> --save  #  本地安装并写入 package.json 依赖中
npm remove <name>          #  移除
npm update <name>          #  更新

```
- 本地安装：将安装包放在 `./node_modules` 下（运行 npm 命令时所在的目录），如果没有 node_modules 目录，会在当前执行 npm 命令的目录下生成 node_modules 目录。可以通过 `require()` 来引入本地安装的包。
- 全局安装：将安装包放在 `/usr/local` 下或者你 node 的安装目录，可以直接在命令行里使用。
