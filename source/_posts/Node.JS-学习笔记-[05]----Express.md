---
title: 'Node.JS 学习笔记 [05] -- Express'
date: 2015-01-06 21:24:40
tags:
---

***Express*** 是一个基于 Node.js 平台的极简、灵活的 Web 应用开发框架，它提供一系列强大的特性，帮助你创建各种 Web 和移动设备应用。Express的核心特性可以概括以下三点。
<!-- more -->

- 可以设置中间件来响应 HTTP 请求。
- 定义了路由表用于执行不同的 HTTP 请求动作。
- 可以通过向模板传递参数来动态渲染 HTML 页面。

下面学习的知识点，都会围绕这几个特性展开。

### Express 安装
#### 在项目中引入 Express
```bash
cd projectName              # 进入新建的 Node.js 项目
npm init                    # 初始化项目配置文件
npm install express --save  # 安装 Express 模块到项目配置文件中
```
通过上门的命令，就可以完成 Express 的安装，下面在 `app.js` 中使用 Express 吧！
```js
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello,Express!');
});

app.listen(8080, function () {
    console.log('Express running at http://127.0.0.1:8080/');
});
```

#### 使用 Express-generator
为了方便开发者，更便捷的使用 Express 生成项目，官方提供的快速的生成工具 `Express-generator`，虽然生成非常快速方便，但是作为初学者，还是要弄清楚里面每条命令所代表的含义，最后再使用官方提供的工具快速生成。打开终端，因为我是 MacOS，所以安装的时候要加上 `sudo` 否则会报错提示权限不够。
```bash
sudo npm install express-generator -g  # 全局安装
express mywebapp                       # 创建 mywebapp 项目
cd mywebapp && npm install             # 安装依赖文件
npm start                              # 启动项目
```
启动项目后，就可以在浏览器中预览了，访问地址：http://127.0.0.1:3000/ 。

<div class="tip">
启动前需要关闭其它已经启用的 Web 服务，否则可能会导致端口占用启动不成功。
</div>

### Express 路由
> 路由是指如何定义应用的端点（URLs）以及如何响应客户端的请求。

#### 基础用法
简单理解，其实就是根据不同的请求，来响应与之对应的页面。比如，当用户访问 http://localhost/images/ 时，根据 URL 可以看出，请求的是 `/images` 这个目录，那么通过路由，找到这个页面并返回给请求的用户，这个过程就叫路由。来看一个简单的例子。
```js
var express = require('express');
var app = express();

// 当用户请求访问 / 时，响应一个 Hello,Express! 字符串，这就是一个简单路由
app.get('/', function (req, res) {
    res.send('Hello,Express!');
});
```
这里需要注意 `app.all()` ,它是一个特殊的路由方法，没有任何 HTTP 方法与其对应，它的作用是对于一个路径上的所有请求加载中间件。 all 相当于既可以处理 `GET`，也可以处理 `POST` 。

#### Router 方法
通过 `express.Router` 类可以创建独立模块的路由模块，它是一个可以挂载的路由对象，把路由模块分离出项目，让整个项目结构清晰、方便管理，这里光说还是挺抽象，举个例子。
```bash
# 目录结构
.
├── index.js
├── node_modules
│   ├── body-parser
│   └── express
├── package.json
├── router
│   ├── admin.js
│   └── home.js
└── views
    ├── admin
    └── home
```
```js
// index.js
var express = require('express');
var bodyparser = require('body-parser');
// 引入外部路由模块
var home = require('./router/home');
var admin = require('./router/admin');
var app = express();

// 使用中间件 bodyparser ，后面可以在 req.body 中分析出 POST 请求体的内容
app.use(bodyparser.urlencoded({extended:false}));

// 使用外部路由模块
app.use('/',home);
app.use('/admin',admin);

app.listen(8080,function () {
   console.log('visit http://127.0.0.1:8080/');
});
```

```js
// admin.js
var express = require('express');
var router = express.Router();// 用 Router 构造函数实例化 router 对象
var path = require('path');

router.get('/login.html', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../views/admin/' + 'login.html'));
});

router.get('/user.html', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../views/admin/' + 'user.html'));
});

router.post('/login.html', function (req, res) {// /admin/login.html
    res.sendFile(path.resolve(__dirname + '/../views/admin/' + 'login.html'));
});

module.exports = router;// 暴露给外部调用该路由
```

### Express 响应对象
通过响应（Response）对象，服务器可以返回一个来自客户端（浏览器）的 `Request` ,最终返回给用户的其实就是一个经过业务逻辑层处理的 `res` 对象。来了解下 Express 的响应对象吧。

#### send()
Express 已经封装过了原生 Node.js 的响应方法，在原生 Node.js 中，通过 `res.write()` 方法可以返回字符串和 Buffer。而 Express 中的 `send()` 可以返回任意数据类型，如流、数据、普通文本等，来看个例子。
```js
res.send(new Buffer('ifyour')); // Buffer
res.send({"name": "ifyour"});   // JSON
res.send('<p>some html</p>');   // HTML
res.status(404).send('404 Not Find'); // 设置状态码并返回提示
//...
```

#### json()
通过 `json()` 方法可以返回一个 `JSON` 对象，用于 Ajax 等。
```js
res.json(null);
res.json({"user": "ifyour"});
res.status(500).json({"error": "message"});
```

#### render()
`render` 用于渲染模板引擎，比如在使用 [ejs](https://github.com/tj/ejs) 模板引擎时，响应用户请求就可以使用 `res.render()` 返回给用户一个渲染好的页面。这个用的比较多，我来举个例子。
```bash
# 目录结构
.
├── index.js
├── node_modules
│   ├── ejs
│   └── express
├── package.json
└── views
    └── login.html
```
```html
<!-- ejs 模板引擎，定义了 /login.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<!-- 注意 ejs 模板中变量的写法 -->    
<h1>欢迎你，<%=name%></h1>
</body>
</html>
```
```js
// index.js
var express = require('express');
var ejs = require('ejs'); // 引入 ejs 模板引擎
var path = require('path');
var app = express();

var viewsPath = path.join(__dirname, 'views');// views 是模板目录
// 设置 express views 层，模板根路径
app.set('views', viewsPath);

// 设置 express 实例的模板语言
app.set('view engine', 'html');

// 把 express 实例的模板引擎和 ejs 模板引擎关联
app.engine('html', ejs.__express);

app.get('/login.html', function (req, res) {
    res.render('login', {name: "ifyour"});// 替换到模板变量中的 name 为 ifyour
});

app.listen(8080, function () {
    console.log('visit http://127.0.0.1:8080/');
});
```
<div class="tip">
`__dirname` 是 Node.js 中定义的 `global` 全局变量，获取当前文件的绝对路径，返回 `string` 类型。
</div>

#### download()
```js
res.download('./123.doc'); // 下载当前目录下面的123.doc文件。
res.download('./123.doc','books.doc'); // 下载当前目录下面的123.doc文件，重命名为 books.doc
```
#### redirect()
```js
// 重定向到指定的 URL 路径
res.redirect('/404.html');
res.redirect('https://www.google.com/');
```

更多响应对象的方法，参考 [Express 官方API](http://www.expressjs.com.cn/4x/api.html#res)。
### Express 请求对象
Express 中的 `Request` 对象，包含了一次请求中的所有数据，比如请求头、路径、Cookies 等，获取请求头中的信息，服务器根据这些信息处理业务逻辑层，最终将处理过后的数据返回给用户。这里总结了常用的请求对象方法。

#### URL 中的参数
```js
// 方式一： req.query.参数名
// e.g.  http://localhost:3000/user?name=ifyour
console.log(req.query.name);
// => ifyour

// 方式二：req.params.参数名
//e.g.  http://localhost/post/123123
router.get('/post/:id', function (req, res) {
    console.log(req.params.id);
    // => 123123
});
```

#### 表单中的参数
```js
// 方式一：语法：req.param.参数名  注意这里没加 s
// e.g. <input type="text" name="user">
console.log(req.param('user'));


// 方式二：使用 body-parser 中间件
// e.g. <input type="text" name="user">
var bodyparser = require('body-parser');
console.console.log(req.boy.user);
```

### Express 中间件
Express 是一个自身功能极简，完全是由路由和中间件构成一个的 Web 开发框架：从本质上来说，一个 Express 应用就是在调用各种中间件。
![](http://ww3.sinaimg.cn/large/6057861cgw1fbcrpk71zxj20sg03kaaa.jpg)
如图，中间件（Middleware）位于客户端和路由之间，它好比是一个漏斗，经过这个漏斗的 `Request` 对象和 `Response` 对象以及循环流程中的 `Next` 会被处理，比如正确性校验、业务逻辑处理等。

- 执行任何代码
- 修改请求和响应对象
- 终结请求-响应循环
- 调用堆栈中的下一个中间件

<div class="tip">
如果当前中间件没有终结请求-响应循环，则必须调用 next() 方法将控制权交给下一个中间件，否则请求就会挂起。
</div>
举个例子来说明一下，如何通过 `next()` 方法把控制权交给下一个中间件。
```js
var app = express();
app.use(function (req, res, next) {
   var accessToken = req.query.accessToken;
   //检查请求中是否含有“认证牌”，存在就继续执行。
   if(accessToken){
       next(); // 执行下一个中间件
       }else{
          res.send(“请求必须包含token”);
        }
});
// ...
```

#### 应用级中间件
应用级中间件就是绑定到用 `express()` 生成的对象 `app` 身上的，比如 `app.use()` 中的 `use` 方法，以及 `app.post()` 、`app.get()` 中的 `POST` 和 `GET` 方法等。
#### 内置中间件
```js
// 设置公共静态目录，用于存放 css js image 等文件，项目目录里有 images 目录存放 1.png
// 那么访问：http://localhost/images/1.png 获取
app.use(express.static('public'));
```
#### 第三方中间件
中间件可以说是整个 Express 的精华所在了，使用中间件可以几大的扩展项目的功能。使用方法都差不多，这里介绍几个常用的，具体使用方式需要看官方的文档了。
- 解析客户端请求的 body 中的内容：body-parser
- cookie 解析中间件：cookie-parser
- 文件上传中间件：multer

使用命令 `npm i 包名称 --save` 安装到项目中，然后引入项目使用即可。
