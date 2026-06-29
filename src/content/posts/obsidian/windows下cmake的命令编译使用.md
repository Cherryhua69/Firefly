---
title: "Windows下CMake的命令编译使用"
published: 2026-06-29
description: "1、下载安装Cmake,配置环境变量,检验安装是否正常 2、 下载安装MinGW,配置环境变量,检验安装是否正常 3、具体的编译命令"
image: ""
tags: ["Windows", "C++"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、下载安装Cmake,配置环境变量,检验安装是否正常

# 2、**下载安装MinGW,配置环境变量,检验安装是否正常**

# 3、具体的编译命令

```bash
# 进入项目下路径
mkdir build
cd build

cmake -G "MinGW Makefiles" ..

# (make -j4(根据CPU的核心数自定义))
make

# 生成可执行文件  .exe
# 执行即可
```
