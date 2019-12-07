---
title: 'Mongodb 学习笔记 -- 增删改查'
date: 2016-01-05 21:24:40
tags:
comments: false
---

记录 Mongodb 的学习之旅，从环境配置，到基础命令行使用，算是一个简单的入门教程，同时也是学习总结，还有把踩到的坑都记录下来，以后遇到同样的问题不至于在同一个地方继续踩坑。
<!-- more -->
### Mongodb 介绍
> MongoDB 是一种文档导向***数据库管理系统***，由 C++撰写而成，旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。2007 年 10 月，MongoDB 由 10gen 团队所发展。2009 年 2 月首度推出。 --- ***维基百科***

MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。听着很饶，其实就是非关系数据库。那什么又是 ***关系型数据库*** 呢？关系型数据库以行和列的形式存储数据，这一系列的行和列被称为表，一组表组成了数据库。表与表之间的数据记录有关系。

### Mongodb 安装
本人的操作系统是：MacOS，且已经安装了 [brew](http://brew.sh/index_zh-cn.html) ，所以图省事，我就使用 brew 一键安装了。没用过 brew 的同学可以去[这里看看](http://www.cnblogs.com/TankXiao/p/3247113.html)，用起来还是挺方便的。

```bash
brew install mongodb
```
安装速度取决于你的网络情况，这里稍等片刻。brew 默认的安装位置在 `/usr/local/Cellar/` 一会的功夫，我们就能在这里看到，Mongodb 乖乖的躺在这了。因为 Mongodb 会默认读取 `/data/db` 目录下的数据库，所以方便省事，我们把默认的数据库就创建在这个位置，并且给 `/data` 执行权限，执行以下命令即可。

```bash
sudo mkdir -p /data/db         # sudo 表示以管理员权限运行，-p 表示创建多层目录
sudo chown -R  UserName /data  # UserName 表示你当前的系统用户名
```
安装成功后，就可以在 Mongodb 的安装目录下 找到 `bin` 目录了，这里面放着所有需要用到的命令。
```bash
cd /usr/local/Cellar/mongodb/3.4.0/bin
./mongod   # 执行 Mongodb 进程后，浏览器打开 http://127.0.0.1:27017/
```
浏览器显示下面的内容，就表示安装成功啦。
```text
It looks like you are trying to access MongoDB over HTTP on the native driver port.
```
接下来打开终端，执行下面的命令，验证我们确实安装成功了。在 Mongodb 的控制台中，可以执行很多命令来操作数据库。
```bash
cd /usr/local/Cellar/mongodb/3.4.0/bin
./mongo

# 进入 MongoDB shell 后，光标会变成下面过的状态，执行 show dbs 后，显示如下则大功告成！
> show dbs
admin  0.000GB
local  0.000GB
```
接下来，为了方便下次执行 Mongodb ，我们把 `bin` 目录放到环境变量中，这样下次直接在终端输入 `mongod` 即可启用服务，输入命令 `mongo` 即可进入 shell 控制台。

```bash
# 添加环境变量，语法：echo "export PATH=xxxxxx:$PATH" >> ~/.bash_profile
echo 'export PATH=/usr/local/Cellar/mongodb/3.4.0/bin:$PATH'>>~/.bash_profile
```
### Mongodb 使用
使用之前，在明白几个概念，相比关系型数据库，非关系数据库采用了 ***数据库***、***集合***、***文档***、的概念。其实对比 SQL 数据库，就很容易理解，集合就好比是一张表，文档好比就是一整行数据。库的概念是一致的。就这点区别。在终端输入 `mongo` 进入 shell 控制台。
```bash
mongo
```
#### 基础命令
新增数据
- 显示数据库：`show dbs`
- 使用/创建数据库：`use 数据库名`
- 显示集合：`show collections`
- 保存数据：`db.collection.save({"key":"value","key2":"value2"})`
- 插入数据：`db.collection.insert({"key":"value","key2":"value2"})`

<div class="tip">
若新增的数据主键已经存在，insert()会不做操作并提示错误，而save()则更改原来的内容为新内容。
</div>

删除数据
- 删除所有文档：`db.collection.remove({})`
- 删除指定文档：`db.collection.remove({"key":"value"})`
- 删除集合：`db.collection.drop()` 或者 `db.runCommand({"drop":"collection"})`
- 删除数据库：`db.runCommand({"dropDatabase": 1})` 注意：1 没有引号

查找数据
- 查找所有数据： `db.collection.find({})`
- 查到单条数据：`db.collection.findOne({})`
- 条件查找：`db.collection.find({"key":"value"})`
- 条件查找 key < value：`db.collection.find({"key":{$lt:value}})`
- 条件查找 key > value：`db.collection.find({"key":{$gt:value}})`
- 条件查找 key >= value：`db.collection.find({"key":{$gte:value}})`
- 范围查找：`db.collection.find({"key":{$gt:value1,$lt:value2 } })`
- 模运算查找：`db.collection.find({"key":{$mod:[10,1]}})`
- 范围在查找：`db.collection.find({"key":{$in:[1,2,3]}})`
- 范围不在在查找：`db.collection.find({"key":{$nin:[1,2,3]}})`
- 数组长度查找：`db.collection.find({"key":{$size:1}})` key 必须是数组
- 字段存在查找：`db.collection.find({"key":{$exists:true|false}})`
- 多条件查找：`db.collection.find({$or:[{a:1},{b:2}]})`
- 内嵌对象中的值查找：`db.collection.find({"key.subkey":value})`
- 排序：`db.collection.find({}).sort({"key1":1,"key2":-1})` 1 升序 -1 降序
- 对字段建立索引：`db.collection.find({})ensureIndex({"key":1})` 1 升序 -1 降序
- 范围控制查找：`db.collection.find().skip(5).limit(5)` 跳过 5 条，读取 5 条
- 查询结果集统计：`db.collection.find().count()`
- 模糊查找：`db.collection.find({"key":/ab/})` 正则


更改数据
- `db.collection.update({"targetKey":"targetValue"},{"newKey":"newVlue"})`

#### GUI 工具
![](http://ww1.sinaimg.cn/large/6057861cgw1fbfwwdbu8qj20zq0dbqah.jpg)
***Robomongo*** 可视化 Mongodb 数据库管理工具 ，点击[这里](https://robomongo.org/download)下载，官方网站：https://robomongo.org/ 。

###  Mongoose 介绍
[Mongoose](http://mongoosejs.com/) 简而言之就是在 Node 环境中操作 MongoDB 数据库的一种对象模型工具，Mongoose 将数据库中的数据转换为 JavaScript 对象供开发人员使用。

#### 配置
安装 Mongoose
```bash
npm install mongoose --save
```
引入到项目文件中并创建链接
```js
// app.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database');
```

#### 新增数据
```js
// 引入模块
var mongoose = require('mongoose');
// 连接数据库
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/test');
// 设置数据类型
var monSchema = new mongooose.Schema({
    name:{type:String,default:"username"},
    age：{type:Number},
    sex:{type:String}
});
// 选择集合
var monModel = db.model('user',monSchema);
// 数据集
var content = {name:"Nick",age:23,sex:'男'};
// 实例化对象并插入数据
var monInsert = new monModel(content);
monInsert.save(function(err){
  if(err){
    console.log(err);
  }else{
    console.log('成功插入数据');
  }
  db.close();
});
```
#### 删除数据
```js
// 引入模块
var mongoose = require('mongoose');
// 连接数据库
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/test');
// cosole.log(db);
// 设置数据类型
var monSchema = new mongooose.Schema({
    name:{type:String,default:"name"},
    age：{type:Number},
    sex:{type:String}
});
// 选择集合
var monModel = db.model('user',monSchema);
// 原数据字段值
var oldValue  = {name:"Nick"};
// 单条件更新
var newData1 = {$set:{name:"内容"}};
// 多条件更新
var newData2 = {$set:{name:"内容",age:2}};
monModel.update(oldValue,newData,function(err,result){
  if(err){
    console.log(err);
  }else{
    console.log("update");
  }
  db.close();
});
```

#### 查询数据
```js
// 引入模块
var mongoose = require('mongoose');
// 连接数据库
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/test');
// cosole.log(db);
// 设置数据类型
var monSchema = new mongooose.Schema({
    name:{type:String,default:"name"},
    age：{type:Number},
    sex:{type:String}
});
// 选择集合
var monModel = db.model('user',monSchema);
var content = {name:"姓名2"};
var field = {name:1,age:1,sex:1};
monModel.find(content,field,function(err,result){
  if(err){
    console.log(err);
  }else{
    console.log(result);
  }
  db.close();
});
```


#### 修改数据
```js
// 引入模块
var mongoose = require('mongoose');
// 连接数据库
var db = mongoose.createConnection('mongodb://127.0.0.1:27017/test');
// cosole.log(db);
// 设置数据类型
var monSchema = new mongooose.Schema({
    name:{type:String,default:"name"},
    age：{type:Number},
    sex:{type:String}
});
// 选择集合
var monModel = db.model('user',monSchema);
// 原数据字段值
var oldValue  = {name:"Nick"};
// 单条件更新
var newData1 = {$set:{name:"内容"}};
// 多条件更新
var newData2 = {$set:{name:"内容",age:2}};
monModel.update(oldValue,newData,function(err,result){
  if(err){
    console.log(err);
  }else{
    console.log("update");
  }
  db.close();
});
```
