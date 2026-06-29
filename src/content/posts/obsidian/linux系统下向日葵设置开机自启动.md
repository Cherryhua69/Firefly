---
title: "Linux系统下向日葵设置开机自启动"
published: 2026-06-29
description: "1、直接的UI界面设设置开启 若是命令安装的向日葵远程控制软件,有可能配置无法生效 2、添加开机自重启命令 1、方法一: 1 在终端输入gnome session properties 2 点击add 3 使用dpkg L sunloginclient 命令查看安装路径 4 将第"
image: ""
tags: ["Linux"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、直接的UI界面设设置开启

若是命令安装的向日葵远程控制软件,有可能配置无法生效

# 2、添加开机自重启命令

## 1、方法一:

1)在终端输入[gnome](https://so.csdn.net/so/search?q=gnome&spm=1001.2101.3001.7020)-session-properties

2)点击add

3)使用[dpkg](https://so.csdn.net/so/search?q=dpkg&spm=1001.2101.3001.7020) -L sunloginclient 命令查看安装路径

4)将第3步搜索结果的最后一条写入Command框中,Name自己定义

5)重启测试

## 2、方法二:

设置sunloginservice

sudo vim /etc/systemd/system/runsunloginclient.service

在[Unit]下添加

Wants=network-online.target

After=network-online.target

关闭保存

然后开启systemctl服务

systemctl enable runsunloginclient

重启测试即可

# 参考链接:

[https://blog.csdn.net/qq_39004117/article/details/125083918](https://blog.csdn.net/qq_39004117/article/details/125083918)
