---
title: "海康摄像头相关设备使用SDK登录报错"
published: 2026-06-29
description: "1、问题描述 在ubuntu系统下调用海康SDK,调用初始化函数之后,死活登录不上!!!! 登录函数:lUserID = NET DVR Login V40 &pLoginInfo, &lpDeviceInfo ; 错误输出函数:std::cout << \"Login faile"
image: ""
tags: []
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 1、问题描述

在ubuntu系统下调用海康SDK,调用初始化函数之后,死活登录不上!!!!

登录函数:lUserID = NET_DVR_Login_V40(&pLoginInfo, &lpDeviceInfo);

错误输出函数:std::cout << "Login failed, error code: " << NET_DVR_GetLastError() << std::endl;

有些摄像头报错码为13,有些则为29

Login failed, error code:13 (or29)

系统中已安装`libcrypto.so.1.1`(与海康 SDK 版本冲突)

# 2、解决办法

**问题原因:是因为libcrypto链接到系统自带版本造成的,需要链接到sdk中提供的版本即可解决问题**

这里的测试程序为C++程序

## 2.1、查看目前编译好的C++程序使用的海康SDK是引用的哪个头文件

```bash
# haikang在这里为你编译好的运行程序
ldd  haikang | grep libcrypto

# 输出为下面的类似
# libcrypto.so.1.1 => /path/to/hikvision_sdk/lib/libcrypto.so.1.1 (0x00007f...)
# /path/to/hikvision_sdk/lib/libcrypto.so.1.1 (0x00007f...)为你当前程序链接的头文件,一般会链接到系统路径下的
```

## 2.2、重新链接海康SDK自带的头文件libcrypto.so.1.1下面

### 方法1:

```bash
# 直接配置环境(或者修改配置文件/etc/profile:(这里本人并不知道这两个配置文件的区别))
sudo vim .bashrc

# 最后面写入(/path/to/hikvision_sdk/lib:这个修改为海康SDK头文件的路径)
export LD_LIBRARY_PATH=/path/to/hikvision_sdk/lib:$LD_LIBRARY_PATH

# 保存
source .bashrc
```

# 3、参考链接

[https://blog.csdn.net/jkhjklhn/article/details/148104576](https://blog.csdn.net/jkhjklhn/article/details/148104576)
