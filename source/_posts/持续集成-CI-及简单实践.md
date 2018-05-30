---
title: '持续集成 (CI) 及简单实践'
date: 2018-04-30 9:00:00
tags:
comments: true
---

在软件开发领域, 一直有很多比较专业的术语, 本着科普的精神, 来填一下自己的 ~~知识盲区~~ 😂, 什么是持续集成? 如何做持续集成? 为什么要做持续集成? 带着这些问题, 本篇文章会给你答案.

<!-- more -->

## What

> 持续集成（英语：Continuous integration，缩写 CI）是一种软件工程流程，是将所有软件工程师对于软件的工作副本持续提交到共用主线（mainline）的一种措施。

## Why

持续集成的目的，就是让产品可以快速迭代，同时还能保持高质量。

![image](https://user-images.githubusercontent.com/15377484/39465580-acb719cc-4d56-11e8-9915-2964d5e523c5.png)

## How

它的核心措施是，代码集成到主干之前，必须通过自动化测试。只要有一个测试用例失败，就不能集成。以本次给博客做持续集成为例，它的流程是这样子的：

1. 写完博客后，直接 push 到 GitHub 的 `src` 分支(我的 `master` 分支是 pages)
2. CI 服务通过配置文件 `.travis.yml` 监听当前 `src` 分支发生变化，触发 webhook
3. CI 服务将当前项目 clone 过去，根据 `.travis.yml` 的配置执行测试和构建
4. 将最终可以作为生产环境的代码推送到线上环境，并且 push 回  `src` 分支

这样做的好处就是：

- 发布新文章，只需 push 一次到仓库，剩下的测试、构建、部署生产环境等，CI 帮我自动完成。
- 快速发现错误。每完成一点更新，就集成到主干，定位错误也比较容易。
- 防止分支大幅偏离主干。如果不是经常集成，主干又在不断更新，会导致以后集成的难度变大。

## More

- [持续集成是什么](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)
- [使用 Travis 自动部署 Hexo](https://segmentfault.com/a/1190000009054888)
