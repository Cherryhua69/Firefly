---
title: "海康摄像头SDK登录失败解决"
published: 2026-06-29
description: "1、账号密码登录IP无误的情况 输入命令修改环境变量:echo \"export LD LIBRARY PATH=$LD LIBRARY PATH:/usr/lib:/usr/lib/HCNetSDKCom\" /etc/profile"
image: ""
tags: []
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 1、账号密码登录IP无误的情况

输入命令修改环境变量:echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/lib:/usr/lib/HCNetSDKCom" >> /etc/profile
