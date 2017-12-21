title: 'Node.JS 学习笔记 [04] -- HTTP'
date: 2015-01-05 15:05:10
tags:

---
本次的学习内容是 Node.js Web 模块，介绍了什么是 web 服务器，以及常见的几种模式，比如 B/S 模式（Browser/Server，浏览器/服务器模式），C/S 模式（Client/Server，客户端/服务器模式）等。Web 客户端通过使用 HTTP 协议就能访问到 Web 服务器上的数据，Web 服务器响应客户端的请求。
<!-- more -->
### HTTP
#### HTTP 协议
***HTTP***  协议是 Hyper Text Transfer Protocol（超文本传输协议）的缩写,是用于从万维网服务器传输超文本到本地浏览器的传送协议。用于定义 Web 浏览器与 Web 服务器之间交换数据的过程以及数据本身的格式。

简单理解其实就是一种规范，以何种方式请求，以何种方式应答。特点嘛，***一次请求（Request）对应一次响应（Response）***。来看一个简单例子，访问 Google 首页的请求和应答。
![](http://ww3.sinaimg.cn/large/6057861cgw1fbb9dlv1ylj20xy0ts7ct.jpg)

在第一栏 General 中可以看到本次的请求目标，来解释一下这几个参数代表啥意思。

- Request URL:https://www.google.com/  请求的 URL，这里我们访问的是 Google 首页。
- Request Method:GET 请求方式，这里采用的是 GET 方式请求。
- Status Code:200  状态码200 ，表示 OK。
- Remote Address:127.0.0.1:1080 这里表示请求的远端 IP 地址及端口，因为我是科学上网，这里才显示了一个回路地址。

#### Node.js 搭建 http 服务器
Node.js 提供了 http 模块，使用 HTTP 服务器或客户端功能必须调用 http 模块，Node.js 搭建一个 http 服务器非常简单，只需要几行代码，来看看把。:P
```js
// 引入 http 模块
var http = require('http');

// 创建服务，回调函数处理请求（Request）和响应（Response），监听8080端口
http.createServer(function (req, res) {
    res.write('hello,world!');
    res.end();
}).listen(8080, function () {
    console.log('Server running at http://127.0.0.1:8080/');
});
```
打开浏览器，输入 http://127.0.0.1:8080/ 就可以看到刚刚创建的服务成功啦。
![](http://ww4.sinaimg.cn/large/6057861cgw1fbbabbplavj20tg08mmyp.jpg)

#### HTTP 响应内容
问题来了，那么如何根据不同的 URL 来响应不同的内容呢？答案很简单，http 服务器在处理 URL 的时候，会根据 URL 的参数来分辨不同的请求内容，根据请求的内容来响应与之对应的内容。一个完整的 URL 长这个样子。
```Text
scheme://host.domain:port/path/filename?queryName=queryValue
```
- scheme：定义服务类型，常见的如 http
- host：定义域主机，http 通常是 www
- domain：定义域名，比如 google.com
- :port：定义主机的端口号，默认是80
- path：定义路径，省略 `/` 表示根目录
- filename：定义文件名
- ?queryName=queryValue：查询字符串

可以看出，想要响应不同的内容，就需要分析出 URL 中的 `path` 和 `filename` 以及对应的查询字符串。来看个简单的例子。
```js
var http = require('http');
var fs = require('fs');
var url = require('url');// 引入 url 模块用于处理地址
var querystring = require('querystring'); // 引入 querystring 模块

http.createServer(function (req, res) {
    // 首页
    var path = url.parse(req.url).pathname;
    if (path == '/') {
        fs.readFile('./html/index.html', 'utf-8', function (err, result) {
            if (!err) {
                res.write(result);
                res.end();
            }
        });
    }
    // 登录
    if (path == '/login'){
        //{...}
    }
    // 登录验证
    if (path == '/checkLogin') {
        var queryObj = querystring.parse(url.parse(req.url).query);
        // querystring.parse() 把查询字符串转成对象，{ usr: 'admin', pwd: '123' }
        if (queryObj.usr == 'admin' && queryObj.pwd == '123') {
            res.write('Login Success!');
            res.end();
        }
    }
}).listen(8080, function () {
    console.log('Server running at http://127.0.0.1:8080/');
});
```

#### HTTP 响应状态码
HTTP 状态码由三个十进制数字组成，第一个十进制数字定义了状态码的类型，后两个数字没有分类的作用。HTTP 状态码共分为5种类型：

|分类   |分类描述                                   |
|:-----|:------------------------------------------|
|1**   |信息，服务器收到请求，需要请求者继续执行操作   |
|2**   |成功，操作被成功接收并处理                   |
|3**   |重定向，需要进一步的操作以完成请求            |
|4**   |客户端错误，请求包含语法错误或无法完成请求     |
|5**   |服务器错误，服务器在处理请求的过程中发生了错误 |

需要记住常见的几种就可以了，另外的可以[查手册](http://tools.jb51.net/table/http_status_code)找到非常详细的解释。
- 200	OK	请求成功。一般用于 GET 与 POST 请求。
- 304	Not Modified	未修改。所请求的资源未修改，服务器返回此状态码时，不会返回任何资源。
- 404	Not Found	服务器无法根据客户端的请求找到资源（网页）。
- 500	Internal Server Error	服务器内部错误，无法完成请求。

#### HTTP 响应不同的数据类型
服务器具有返回各种数据的能力，但是返回数据时，应告诉浏览器返回的是一个什么文件。通过 `Content-Type` 可以设置，响应的数据类型。来看个简单的例子。
```js
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    // 设置响应的状态码，数据类型
    res.writeHeader('200', {'Content-Type': 'image/png;charset=utf-8'});
    fs.readFile('./hello.png', function (err, result) {
        if (!err) {
            res.write(result);
            res.end();
        }
    })
}).listen(8080, function () {
    console.log('Server running at http://127.0.0.1:8080/');
});
```
可以通过 [node-mime](https://github.com/broofa/node-mime) 来查询各种文件的数据类型。先用 npm 安装。
```bash
npm install mime --save
```
```js
var mime = require('mime');

console.log(mime.lookup('test.txt'));   // text/plain
console.log(mime.lookup('test.html'));  // text/html
console.log(mime.lookup('test.css'));   // text/css
console.log(mime.lookup('test.js'));    // application/javascript
console.log(mime.lookup('test.mp3'));   // audio/mpeg
```
### Web 客户端数据传递

#### 通过 URL 传递
```Text
scheme://host.domain:port/path/filename?queryName=queryValue
```
其中 `?queryName=queryValue` 就是通过 URL 传递的数据，举个例子：`?usr=admin&pwd=123` 就表示传递一个 `usr` 为 `admin` ，`pwd` 为 `123` 的数据到后台。
#### 通过表单传递
```html
<form action="/user" method="get">
    用户名：<input type="text" name="username"/><br/>
    密 码：<input type="password" name="password"><br/>
    <input type="submit" value="提交"/>
</form>
```
- action：提交到服务器处理程序的url地址
- method：提交方式有 `GET` 和 `POST`
- GET：会把表单数据作为 URL 的一部分显示在地址栏中，URL 长度有限制不能提交大量数据
- POST：会把表单数据放到 HTTP 请求体中，相对安全，而且可以提交大量数据（比如文件）

#### 数据类型
前面讲了，在服务器端，返回给浏览器数据时，会通过 `Content-Type` 指定数据类型，同样的，浏览器向服务器传递数据时，也需要指定数据类型。在这两种数据传递方式中，表单传递数据时，`POST` 方式，必须指定数据类型，举个简单的例子。
```html
<form action="/user" method="post" enctype="multipart/form-data">
    <input type="file">
    <input type="submit" value="上传">
</form>
```
`enctype` 指定 POST 的数据类型，默认是 `application/x-www-form-urlencoded`，上传文件时，就需要 `multipart/form-data` 类型了。
