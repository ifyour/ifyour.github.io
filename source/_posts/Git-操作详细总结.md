---
title: Git 操作详细总结
date: 2018-05-11 23:25:56
tags:
from:
---

Git 操作详细总结，以便回顾和查询。理解这些指令，觉得最重要的是理解 Git 的内部原理，比如 Git 的分布式版本控制，分清楚工作区、暂存区、版本库，还有就是理解 Git 跟踪并管理的是修改，而非文件。

<!-- more -->

![image](https://user-images.githubusercontent.com/15377484/39952532-4c0c156e-55cb-11e8-8052-e62c448325fe.png)

## 设置

```bash
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
```

## 提交

Git 追踪的是修改，而不是文件。

![image](https://user-images.githubusercontent.com/15377484/39952534-5c10f236-55cb-11e8-81bf-c4d369d07054.png)

```bash
# 将 “当前修改” 移动到暂存区 (stage)
git add filename.txt

# 将暂存区修改提交
git commit -m "Add filename.txt."
```

## 状态

```bash
git status
git diff
```

## 回退

```bash
# 放弃工作区修改
git checkout -- file.name
git checkout -- .

# 取消 commit(比如需要重写 commit 信息)
git reset --soft HEAD

# 取消 commit、add(重新提交代码和 commit)
git reset HEAD
git reset --mixed HEAD

# 取消 commit、add、工作区修改 (需要完全重置)
git reset --hard HEAD
```

## 记录

```bash
git reflog
git log
```

## 删除

```bash
rm file.name
git rm file.name
git commit -m "Del"
```

## 远程操作

```bash
git remote add origin git@github.com:ifyour/ifyour.github.io.git

# 第一次推送，-u(--set-upstream) 指定默认上游
git push -u origin master
git push origin master
```

## 克隆

```bash
git clone https://github.com/ifyour/ifyour.github.io.git path
git clone git@github.com:ifyour/ifyour.github.io.git path
```

## 分支操作

![image](https://user-images.githubusercontent.com/15377484/39952537-6b679758-55cb-11e8-9ff7-87440fcbb4d0.png)

```bash
# 查看当前分支
git branch

# 创建分支
git branch dev

# 切换分支
git checkout dev

# 创建并 checkout 分支
git checkout -b dev

# 合并分支
git merge dev

# 删除分支
git branch -d dev
```

## 标签

```bash
git tag 0.1.1
git push origin --tags
```
