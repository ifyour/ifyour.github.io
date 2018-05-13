---
title: CentOS 6 x86 Node.js + MongoDB + Express 环境配置笔记
date: 2015-1-1 20:18:33
tags:
comments: false
---

总体来说配置比较顺利，也踩了不少坑 TAT，毕竟不是专业的运维人员，Linux 经验完全在平常项目中一点点积累的。
<!-- more -->

<div class="tip">
    重要提示：本文适用于有一定 Linux 基础的童鞋操作，比如懂得 `ls`、`cd`、`vim`等命令基本用法。
    适用于操作系统：CentOS-6-x86_64，安装 node v6.9.4，mongodb v3.4.2。
</div>

### Node.js 安装
0.进入到待安装位置
```bash
cd /usr/local/
```

1.下载安装文件
```bash
wget https://nodejs.org/dist/v6.9.4/node-v6.9.4-linux-x86.tar.xz
```

2.解压文件
```bash
xz -d node-v6.9.4-linux-x86.tar.xz
tar xvf node-v6.9.4-linux-x86.tar
```
3.重命名文件
```bash
rm -rf node-v*.tar
mv node-v* node
```


4.配置环境变量
```bash
#编辑系统文件
vim ~/.bash_profile

#在最顶端添加环境变量地址
PATH=/usr/local/node/bin:$PATH

#保存后重新启动以生效
source ~/.bash_profile
```

5.验证是否成功，显示版本号即安装成功！
```bash
node -v
```

### Mongodb 安装

0.进入到待安装位置
```bash
cd /usr/local/
```

1.下载安装文件
```bash
wget http://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.4.2.tgz
```

2.解压文件
```bash
tar zxf mongodb-linux-*.tgz
```

3.重命名
```bash
rm -rf mongodb-*.tgz
mv mongodb-* mongodb
```

4.配置环境变量
```bash
#编辑系统文件
vim ~/.bash_profile

#在最顶端添加环境变量地址
PATH=/usr/local/mongodb/bin:$PATH

#保存后重新启动以生效
source ~/.bash_profile
```

5.验证是否安装成功
```bash
mongod --version
```

6.创建数据库目录和日志目录
```bash
mkdir -p /data/db
mkdir -p /data/logs/mongodb.log
```

7.新增配置文件 `/data/mongodb.conf`
```txet
#数据库文件
dbpath = /data/

#日志文件
logpath = /data/logs/mongodb.log

#默认端口
port = 27017

#后台运行
fork = true

#用户授权
auth = true

#不启用http访问
nohttpinterface = true
```
<div class="tip">
添加授权后需要在 mongodb 数据库文件的 Users 集合新增用户，才可以正常使用。
</div>


8.在自启动文件 `/etc/rc.local` 中写入 mongod 进程带配置文件启动
```bash
echo "/usr/local/mongodb/bin/mongod -f /data/mongodb.conf" >> /etc/rc.local
```

9.重启
```bash
reboot
```


### Express
```bash
npm i express -g
```
