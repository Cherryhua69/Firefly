---
title: "Linux环境下安装Node js"
published: 2026-06-29
description: "1、官网下载Node.js包 首先,打开Node.js官方网站 https://nodejs.org/ ,在下载页面选择适合您Linux发行版的Node.js包。您可以根据自己的需求选择不同的版本。 2、或者直接wget直接下载需要的版本 3、解压、移动和查看版本 1. 解压No"
image: ""
tags: ["Linux"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、官网下载Node.js包

首先,打开Node.js官方网站([https://nodejs.org/),在下载页面选择适合您Linux发行版的Node.js包。您可以根据自己的需求选择不同的版本。](https://nodejs.org/%EF%BC%89%EF%BC%8C%E5%9C%A8%E4%B8%8B%E8%BD%BD%E9%A1%B5%E9%9D%A2%E9%80%89%E6%8B%A9%E9%80%82%E5%90%88%E6%82%A8Linux%E5%8F%91%E8%A1%8C%E7%89%88%E7%9A%84Node.js%E5%8C%85%E3%80%82%E6%82%A8%E5%8F%AF%E4%BB%A5%E6%A0%B9%E6%8D%AE%E8%87%AA%E5%B7%B1%E7%9A%84%E9%9C%80%E6%B1%82%E9%80%89%E6%8B%A9%E4%B8%8D%E5%90%8C%E7%9A%84%E7%89%88%E6%9C%AC%E3%80%82)

# 2、或者直接wget直接下载需要的版本

```bash
 wget https://nodejs.org/dist/v16.15.1/node-v16.15.1-linux-x64.tar.xz
```

# 3、解压、移动和查看版本

1. 解压Node.js包,使用以下命令:

```
tar -xvf node-v16.15.1-linux-x64.tar.xz
```

2.将解压后的文件移动到`/usr/local/nodejs`目录下。如果`/usr/local/nodejs`目录不存在,您需要先创建它:

```
mkdir -p /usr/local/nodejs
mv node-v16.15.1-linux-x64 /usr/local/nodejs
```

3.查看Node.js版本,确认安装成功:

```
/usr/local/nodejs/bin/node -v
```

# 4、设置环境变量

## 1、编辑`/etc/profile`

为了让Node.js和npm命令在系统任何位置都能使用,您需要设置环境变量。编辑`/etc/profile`文件,添加以下内容:

```
export NODE_HOME=/usr/local/nodejs
export PATH=$NODE_HOME/bin:$PATH
```

保存并关闭文件后,运行以下命令使环境变量生效:

```
source /etc/profile
```

## 2、编辑`~/.bashrc`(1编辑后不生效的情况)

```bash
export NODE_HOME=/usr/local/nodejs
export PATH=$NODE_HOME/bin:$PATH
```

保存并关闭文件后,运行以下命令使环境变量生效:

```bash
source ~/.bashrc
```

# 5、测试验证

```bash
node -v
```

# 参考链接:

[https://cloud.baidu.com/article/3285868](https://cloud.baidu.com/article/3285868)
