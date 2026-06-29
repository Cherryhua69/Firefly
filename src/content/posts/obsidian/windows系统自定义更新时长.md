---
title: "Windows系统自定义更新时长"
published: 2026-06-29
description: "1、打开注册表 win+r键 : 输入regedit 2、依次点击 HKEY LOCAL MACHINE\\SOFTWARE\\Microsoft\\WindowsUpdate\\UX\\Settings 3、新建一个文件 DWORD 32位 值 名字设置为:FlightSettingsM"
image: ""
tags: ["Windows"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、打开注册表

win+r键 : 输入regedit

# 2、依次点击

HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings

# 3、新建一个文件(DWORD(32位)值)

名字设置为:FlightSettingsMaxPauseDays

# 4、双击打开新建的文件配置

点击右边的十进制

数值数据设置为:想要的天数,35000
