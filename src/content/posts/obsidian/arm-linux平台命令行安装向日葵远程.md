---
title: "Arm Linux平台命令行安装向日葵远程"
published: 2026-06-29
description: "1、进入贝锐向日葵官网下载安装包 我这里是arm64的:https://sunlogin.oray.com/download/linux?type=personal 2、安装命令 3、启动向日葵远程命令 4、卸载命令"
image: ""
tags: ["Linux", "工具"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、进入贝锐向日葵官网下载安装包

我这里是arm64的:[https://sunlogin.oray.com/download/linux?type=personal](https://sunlogin.oray.com/download/linux?type=personal)

# 2、安装命令

```bash
# 找到安装包名字执行安装
sudo dpkg -i 文件名.deb
```

# 3、启动向日葵远程命令

```bash
/usr/local/sunlogin/bin/sunloginclient
```

# 4、卸载命令

```bash
sudo dpkg -r sunloginclient
```
