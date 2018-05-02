---
title: 'Node.JS 学习笔记 [03] -- Buffer fs path'
date: 2015-1-4 21:57:05
tags:
---

今天学习了 Node.js 的缓冲区（Buffer）、文件系统（fs）、路径（path）模块，感受了一下 Node.js 作为 JavaScript 的扩展在后台方面的一些功能。给我最多的感受是，大量的异步代码和回调函数，让 Node.js 性能非常出色。来总结下今天学习的内容吧。
<!-- more -->
### 缓冲区 (Buffer)
JavaScript 语言自身只有字符串数据类型，没有二进制数据类型。但在处理像 TCP 流或文件流时，必须使用到二进制数据。因此在 Node.js 中，定义了一个 Buffer 类，该类用来创建一个专门存放二进制数据的缓存区。按照我的理解，Buffer 类很像我们的整数数组。有对应的索引，存储方式也和数组类似。来看看 Buffer 类是如何创建的。
#### 创建 Buffer 类
```js
// 方法1
// 创建长度为10字节的 Buffer 类
var buf = new Buffer(10); // 构造函数，注意这种创建形式

// 方法2
// 直接通过数组赋值的形式创建
var buf2 = new Buffer([1,2,3,4,5]);

// 方法3
// 通过字符串来创建
var buf3 = new Buffer('ifyour','utf-8');// utf-8 默认编码，可以省略
```
从代码我们可以看出这个 Buffer 类是一个构造函数，通过实例化一个 Buffer 对象，让它具有一些 Buffer 类的方法，总得来说常用的方法有下面三种。
#### 写入缓冲区
```js
// 语法：  buf.write(string[, offset[, length]][, encoding])
// 实例：

var b4 = new Buffer(14);
len = b4.write('this is buffer');
console.log('Buffer 写入了 ' + len + ' 字节，内容为：' + b4.toString());
// Buffer 写入了 14字节，内容为：this is buffer
```
#### 缓冲区读取
```js
// 语法： buf.toString([encoding[, start[, end]]])
// 实例：
buf = new Buffer(26);
for (var i = 0 ; i < 26 ; i++) {
  buf[i] = i + 97;
}

console.log( buf.toString('ascii'));       // 输出: abcdefghijklmnopqrstuvwxyz
console.log( buf.toString('ascii',0,5));   // 输出: abcde
console.log( buf.toString('utf8',0,5));    // 输出: abcde
console.log( buf.toString(undefined,0,5)); // 使用 'utf8' 编码, 并输出: abcde
```

#### 缓冲区拷贝
```js
//语法： buf.copy(targetBuffer[, targetStart[, sourceStart[, sourceEnd]]])
//实例：
var b5 = new Buffer([1,2,3,4,5]);
var b6 = new  Buffer(5);

b5.copy(b6,1,0,2);// 把 b5 中的索引 0-2 （不包括2） 的值复制给 b6 的第 1 位置
console.log(b6);
```
### 文件系统 (fs)
Node.js 文件系统（fs 模块）模块中的方法均有异步和同步版本，例如读取文件内容的函数有异步的 `fs.readFile()` 和同步的 `fs.readFileSync()`。异步的方法函数最后一个参数为回调函数，回调函数的第一个参数包含了错误信息 (error)。相比同步，异步效率更高，性能更好，没有阻塞，但是在实际使用中，一定要处理好先后顺序。

#### 文件读写方式
文件读取方式，举个简单例子，好比先把整个数据源完整拿出来放到内存中，再使用 `writeFile` 方法或 `writeFileSync` 方法写入文件内容。显然，如果数据源非常大（10GB）使用这种方式，效率就很低了。说不定就死机了。:) 这时候，就需要下一节讲到的 ***流读取***。

```Text
// data.txt
Hello,Node.js!
```
```js
var fs = require("fs");

// 异步读取
fs.readFile('data.txt', function (err, data) {
   if (err) {
       return console.error(err);
   }
   console.log("异步读取: " + data.toString());
});

// 同步读取
var data = fs.readFileSync('data.txt');
console.log("同步读取: " + data.toString());

console.log("程序执行完毕。");
```

```Text
同步读取: Hello,Node.js!
程序执行完毕。

异步读取: Hello,Node.js!
```

<div class="tip">
Node.js 中，先执行同步代码，后执行异步代码，异步代码会将回调函数放入调用 ***队列***，以 ***先进先出*** 的形式依次调用。
</div>

```js
var fs = require('fs');
// 异步写入
fs.writeFile('./data/d2.txt','我是一条数据',function (err) {
    if (!err){
        console.log('文件写入成功');
    }else {
        console.log('写入失败');
    }
});

// 同步写入
fs.writeFileSync('./data/d3','我是一条数据');

var data = fs.readFileSync('./data/d3');

console.log(data.toString());// 我是一条数据
```


#### 流读写方式
应用程序中，流是一组有序的、有起点和终点的 ***字节数据的传输方式***。在应用程序中各种对象之间交换与传输数据的时候，总是先将该对象中所包含的数据转换为各种形式的流数据（即字节数据），再通过流的传输，到达目的对象后再将流数据转换为该对象中可以使用的数据。

```js
var fs = require('fs');
var data = '';
// 流读取
var stream = fs.createReadStream('./data/d1.txt','utf-8');
stream.on('data',function (result) {
    data += result;
});
// data end 事件表示连贯的行为，字节流需要起点和终点。
stream.on('end',function () {
    console.log(data);
});

stream.on('error',function (err) {
    console.log(err.stack);
});

// 流写入
var stream = fs.createWriteStream('./data/123.txt','utf-8');
stream.write('hello','utf-8');

stream.end();

stream.on('finish',function () {// finish 事件触发，必须等 end 事件结束才可以
   console.log('写入完成！');
});

stream.on('error', function(err){
    console.log(err.stack);
});
```
<div class="tip">
流读取会依次触发事件： data -> end -> error ,每个事件发生会有对应的回调函数处理。
流写入会依次触发事件： end -> finish -> error ,每个事件发生会有对应的回调函数处理。
</div>

#### 管道流读写
管道(pipe) 提供了一个输出流到输入流的机制。通常我们用于从一个流中获取数据并将数据传递到另外一个流中。通过管道，我们就可以实现大文件流入另外一个文件的复制过程。
```js
var fs = require('fs');

var readStream = fs.createReadStream('./data/d1.txt');

var writeStrem = fs.createWriteStream('./data/d3.txt');

readStream.pipe(writeStrem);// 实现了 d1.txt 到 d3.txt 的传输过程
```

#### 链式流读写
链式是通过连接输出流到另外一个流并创建多个对个流操作链的机制。链式流一般用于管道操作。接下来我们就是用管道和链式来压缩和解压文件。
```js
// compress.js
var fs = require('fs');
var zlib = require('zlib'); // 引入压缩模块

fs.createReadStream('./data/123.txt')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('./data/123.txt.gz'));// 链式操作
console.log('文件压缩完成');
```
#### 文件、文件夹删除
```js
var fs = require("fs");
// 文件目录读取，返回一个数组，包含文件及文件夹
fs.readdir("./testdir",function(err,files){
    if (!err){
        console.log(files);// [ 'index.html', 'main.css', 'subdir' ]
    }else {
        console.log(err);
    }
});

// 文件删除
console.log("准备删除文件！");
fs.unlink('./data/123.txt.gz', function(err) {
    if (err) {
        return err;
    }
    console.log("文件删除成功！");
});

// 空文件夹删除
fs.rmdir('./data',function (err) {
    if (!err){
        console.log('删除成功！');
    }else {
        console.log(err);
    }
});

```
一个递归删除的小练习，把前面的综合运用一下。
```js
delDir('./testdir');

// 传入一个文件夹路径，删除掉该文件夹所有内容
// @param pathStr string 传入一个路径
function delDir(pathStr) {
    var fs = require('fs');
    if (fs.existsSync(pathStr)){
        var files = fs.readdirSync(pathStr);
        for (var i = 0; i < files.length; i++) {
            var curPath = pathStr + '/' + files[i];
            var stats = fs.statSync(curPath);
            if (stats.isFile()){
                fs.unlink(curPath);
            }else if(stats.isDirectory()){
                delDir(curPath);// 递归调用，最终删除掉所有文件，只剩空目录
            }
        }
        fs.rmdirSync(pathStr);// 收尾，删掉空目录
    }else {
        console.log('文件夹不存在');
    }
}
```
<div class="tip">
文件、文件夹的操作，都有同步和异步的代码，比如 `fs.unlink()` 和 `fs.unlinkSync()`,默认都是异步代码，异步代码会调用回调函数进行操作，同步代码会返回一个对象，进行后续的操作，可以认真观察上面代码的区别。使用异步代码的时候，一定注意执行顺序。
</div>


### 路径 (path)
path 模块包含一套用于 ***处理和转换文件路径*** 的工具集，用于处理目录的对象，提高开发效率。用 Node.js 的 path 命令，与使用 Linux 下的 shell 脚本命令相似。几乎所有的方法仅对字符串进行转换，文件系统是不会检查路径是否真实有效。
```js
// 引入path对象
var path = require('path');

/*
* 格式化路径  path.normalize(p)
* 特点：将不符合规范的路径格式化，简化开发人员中处理各种复杂的路径判断
* */
path.normalize('/foo/bar//baz/asdf/quux/..');  
// returns   
'/foo/bar/baz/asdf'

/*
* 路径联合 path.join([path1], [path2], [...])
* 特点：将所有名称用path.seq串联起来，然后用normailze格式化
* */
path.join('///foo', 'bar', '//baz/asdf', 'quux', '..');  
// returns   
'/foo/bar/baz/asdf'

/*
* 路径寻航 path.resolve([from ...], to)
* 特点：相当于不断的调用系统的cd命令
* */
path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile');
// 相当于终端命令：
// cd foo/bar
// cd /tmp/file/
// cd ..
// cd a/../subfile
// pwd

/*
* 相对路径 path.relative(from, to)
* 特点：返回某个路径下相对于另一个路径的相对位置串，
* 相当于：path.resolve(from, path.relative(from, to)) == path.resolve(to)
* */
//简单理解： 地址一执行怎样的 shell 命令，到达地址二
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')  
// returns  
'../../impl/bbb'

/*
* 文件夹名称 path.dirname(p)
* 特点：返回路径的上级路径
* */
path.dirname('/foo/bar/baz/asdf/quux')  
// returns  
'/foo/bar/baz/asdf'

/*
* 文件名称 path.basename(p, [ext])
* 特点：返回指定的文件名，返回结果可去掉[ext]后缀字符串
* */
path.basename('/foo/bar/baz/asdf/quux.html')  
// returns  
'quux.html'  

path.basename('/foo/bar/baz/asdf/quux.html', '.html')  
// returns  
'quux'

/*
* 扩展名称 path.extname(p)
* 特点：返回指定文件名的扩展名称
* */
path.extname('index.html')  
// returns  
'.html'  

path.extname('index.')  
// returns  
'.'  

path.extname('index')  
// returns  
''

/*
* 路径分隔符 path.sep
* 特点：获取文件路径的分隔符，主要是与操作系统相关
* 注意调用方式
* */
'foo/bar/baz'.split(path.sep)  
// returns  
['foo', 'bar', 'baz']  
```
