---
title: "Windows下使用adb命令"
published: 2026-06-29
description: "1.下载安装adb工具包 下载地址:http://adbshell.com/downloads 2.解压后,配置环境变量 打开 ”我的电脑“ “属性” “高级系统设置” “环境变量” 3.打开Cmd命令窗口测试使用"
image: ""
tags: ["Windows", "工具"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# # **1.下载安装adb工具包**

下载地址:[http://adbshell.com/downloads](http://adbshell.com/downloads)

```bash
# 卸载驱动
sudo apt-get --purge remove nvidia*
sudo apt autoremove

#移除CUDA Toolkit
sudo apt-get --purge remove "*cublas*" "cuda*"

#移除NVIDIA Drivers
sudo apt-get --purge remove "*nvidia*"
```

# **2.解压后,配置环境变量**

打开 ”我的电脑“ - “属性” - “高级系统设置” - “环境变量”

# 3.打开Cmd命令窗口测试使用
