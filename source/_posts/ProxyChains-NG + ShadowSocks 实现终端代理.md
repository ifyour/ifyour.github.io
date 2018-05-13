---
title: ProxyChains-NG + ShadowSocks 实现终端代理
date: 2016-03-23 08:25:31
tags:
comments: false
---

经常在终端下执行一些网络命令，例如 `wget` 、`git`、`ssh` 等命令，速度慢的不行，说白了，有些是因为 GFW 的原因，有些则是访问国外的服务器本来速度就很慢，而我们的 ShadowSocks 提供的是 `socks5` 代理，终端无法享用。这个时候 **ProxyChains-NG** 应势而生。
<!-- more -->
### 安装
使用 [brew](http://brew.sh/index_zh-cn.html) 快速安装 ProxyChains-NG，想详细了解 ProxyChains-NG 可以去他们[项目主页](https://github.com/rofl0r/proxychains-ng)。
```bash
brew install proxychains-ng
```

配置
```bash
vi /usr/local/etc/proxychains.conf
```

添加代理
```bash
socks5  127.0.0.1 1080
```

### 使用
到此为止，整个命令安装完成，用法 `proxychains4 需要执行的命令`。举个例子：执行下面的命令后，可以看到是 ss 的 IP 了。
```bash
proxychains4 curl ip.cn
```


### 优化
这个命令太长了，我想换一个！我使用的是 zsh，来给 `proxychains4` 配置一个别名吧！:P
编辑 zsh 配置文件
```bash
vi ~/.zshrc
```

添加别名
```bash
alias myss='proxychains4'
```

让配置生效
```bash
source ~/.zshrc
```

再执行之前查看 ip 的命令
```bash
myss curl ip.cn
```

Have done! :)

### 测速
使用 speedtest 的命令行工具，来测上行宽带和下行宽度。
```bash
# 下载 speedtest-cli
wget -O speedtest-cli https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py

# 给执行权限
chmod +x speedtest-cli

# 运行
./speedtest-cli

# 测试下代理的速度
myss ./speedtest-cli
```

#### 附：brew 常用命令

|命令          |含义                       |
|:------------|:--------------------------|
|安装包        |brew install `<PackageName>`|
|搜索包        |brew search `<PackageName>` |
|查询包信息    |brew info `<PackageName>`   |
|升级指定包    |brew upgrade `<PackageName>`|
|更新自己      |brew update                |
|检查过时包    |brew outdated              |
|升级所有包    |brew upgrade               |
|清理缓存      |brew cleanup               |
