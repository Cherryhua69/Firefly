---
title: "Windows无法使用‘make’命令"
published: 2026-06-29
description: "1.问题 Windows系统缺少make工具,无法调用make工具的功能。 make工具主要负责一个软件工程中多个源代码的自动编译工作,同时它还可以进行程序运行环境监测、后期处理等工作。它通过读取“Makefile”的文件来自动化构建软件。简单来说,就是可以对源代码进行处理,生成"
image: ""
tags: ["Windows"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1.问题

**Windows系统缺少make工具,无法调用make工具的功能。**

make工具主要负责一个[软件工程](https://so.csdn.net/so/search?q=%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B&spm=1001.2101.3001.7020)中多个源代码的自动编译工作,同时它还可以进行程序运行环境监测、后期处理等工作。它通过读取“Makefile”的文件来自动化构建软件。简单来说,就是可以对源代码进行处理,生成可执行文件的一个自动化工具。

# 2. 解决方法

## 1.1安装**mingw,在系统环境变量中配置变量**

## 1.2检测mingw安装成功之后,在安装的bin目录下复制一份mingw32-make.exe程序并修改成make.exe即可使用make命令啦!!
