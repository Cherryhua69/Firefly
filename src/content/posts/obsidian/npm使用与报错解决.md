---
title: "npm使用与报错解决"
published: 2026-06-29
description: "1、安装配置node 2、npm指定源配置 进入demo的路径下: 这里以大华的无插件预览demo示例 执行配置: 3、安装node依赖模块 这一步出现依赖包反复安装失败问题,换了安装源也没用 出现的问题: 解决方法: 换成yarn安装依赖就可以了 4、启动node服务"
image: ""
tags: ["工具"]
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 1、安装配置node

# 2、npm指定源配置

进入demo的路径下:

> 图片附件缺失：image 7.png（image.png）

这里以大华的无插件预览demo示例

执行配置:

```bash
npm config set registry [http://npm.dahuatech.com](http://npm.dahuatech.com/)
```

# 3、安装node依赖模块

```bash
npm install
```

这一步出现依赖包反复安装失败问题,换了安装源也没用

出现的问题:

```bash
npm ERR! code ENOTFOUND
npm ERR! syscall getaddrinfo
npm ERR! errno ENOTFOUND
npm ERR! network request to http://npm.dahuatech.com/yargs-parser/-/yargs-parser-13.1.2.tgz failed, reason: getaddrinfo ENOTFOUND npm.dahuatech.com
npm ERR! network This is a problem related to network connectivity.
npm ERR! network In most cases you are behind a proxy or have bad network settings.
npm ERR! network
npm ERR! network If you are behind a proxy, please make sure that the
npm ERR! network 'proxy' config is set properly.  See: 'npm help config'

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\16605\AppData\Local\npm-cache\_logs\2025-06-19T02_00_01_235Z-debug-0.log
```

解决方法:

换成yarn安装依赖就可以了

```bash
# 安装 yarn
npm install -g yarn

# 使用 yarn 安装依赖
yarn install
```

# 4、启动node服务

```bash
node index.js
```
