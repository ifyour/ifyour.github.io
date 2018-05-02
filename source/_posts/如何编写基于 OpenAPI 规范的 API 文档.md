---
title: 如何编写基于 OpenAPI 规范的 API 文档
date: 2018-05-02 12:41:00
tags:
---

接到需求, 让前端定义好接口(结构), 通常来讲, 前端会更清楚需要什么类型结构的数据, 所以结构方面更熟悉. 那么如何写好接口, 不给自己挖坑? 这边文章就来总结一下使用 Swagger 编写 API 文档的正确姿势.

<!-- more -->


## What

> **Swagger** 是一个简单但功能强大的 API 表达工具。使用 Swagger 生成 API，我们可以得到交互式文档，自动生成代码的 SDK 以及 API 的发现特性等

Swagger 是一个开源项目, [这里](https://github.com/swagger-api)是他们的项目主页, 感兴趣的可以去看看.

> **OpenAPI** 规范是 Linux 基金会的一个项目，试图通过定义一种用来描述 API 格式或 API 定义的语言，来规范 RESTful 服务开发过程
 
 比如:
- 有关该API的一般性描述
- 可用路径（/资源）
- 在每个路径上的可用操作（获取/提交...）
- 每个操作的输入/输出格式


## Why

使用 OpenAPI 规范有什么好处?
- 帮助你快速表述 API, 尤其是在设计阶段
- 存取的是二进制文本文件, 利于版本管理

一旦定义好 API 文档规范, 你可以:
- 需求和系统特性描述的根据
- 前后台查询、讨论、自测的基础
- 部分或者全部代码自动生成的根据
- 其他重要的作用，比如开放平台开发者的手册...


## How
如何编写 API 文档, 推荐使用 `YAML` 语言格式来编写, 相比 `JSON` 更为简洁.

<div class="tip">
YAML（/ˈjæməl/，尾音类似 camel 骆驼）是一个可读性高, 更简洁的用来表达数据序列的格式。它的特点是大小写敏感, 使用空格缩进来表示层级关系(只要对齐就行). 
</div>

一个最简单的 YAML 实现例子, 本博客的 CI 配置文件 `.travis.yml`, 注意 `-` 表示数组关系:
```yml
language: node_js
node_js: stable
branches:
  only:
  - src
cache:
  apt: true
  yarn: true
  directories:
    - node_modules
before_install:
- git config --global user.name "ifyour"
- git config --global user.email "ifyour@outlook.com"
- curl -o- -L https://yarnpkg.com/install.sh | bash
- export PATH=$HOME/.yarn/bin:$PATH
- npm install -g hexo-cli
install:
- yarn
script:
- hexo clean
- hexo generate
after_success:
- cd ./public
- git init
- git add --all .
- git commit -m "Travis CI Auto Builder"
- git push --quiet --force https://$REPO_TOKEN@github.com/ifyour/ifyour.github.io.git
  master
```
这里只提供一个入门总结, 具体用法需要参考 Swagger 官方文档.


## More
- [Swagger 官方文档](https://swagger.io/docs/)
- [Swagger 从入门到精通](https://legacy.gitbook.com/book/huangwenchao/swagger/details)
- [YAML 是什么](http://www.ruanyifeng.com/blog/2016/07/yaml.html)
- [YAML & JSON 互转工具](http://www.awesometool.org/Encode/YAML2JSON)