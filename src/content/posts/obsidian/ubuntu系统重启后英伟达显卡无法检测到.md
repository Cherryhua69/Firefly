---
title: "Ubuntu系统重启后英伟达显卡无法检测到"
published: 2026-06-29
description: "1.报错 2.报错原因 系统内核版本自动更新了: NVIDIA内核驱动版本和系统驱动不一致 内核版本自动更新了,导致新版本内核和原来显卡驱动不匹配 3.解决办法 1.查看已安装驱动的版本信息: 2.查看已安装内核: 查看正在使用的内核: 3.依次输入以下两条命令即可: 4.输入n"
image: ""
tags: ["Linux"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1.报错

```bash
# 执行命令
nvidia-smi

#报错:NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver.
#Make sure that the latest NVIDIA driver is installed and running.
```

# 2.报错原因

系统内核版本自动更新了:

**NVIDIA内核驱动版本和系统驱动不一致(内核版本自动更新了,导致新版本内核和原来显卡驱动不匹配)**

# 3.解决办法

## 1.查看已安装驱动的版本信息:

```bash
ls /usr/src | grep nvidia
```

## 2.查看已安装内核:

```bash
dpkg --get-selections |grep linux-image
```

查看正在使用的内核:

```bash
uname -a
```

## 3.依次输入以下两条命令即可:

```bash
sudo apt-get install dkms

sudo dkms install -m nvidia -v 525.105.17
#这里的525.105.17是自己的显卡驱动版本
```

> 图片附件缺失：image 2.png（image.png）

> 图片附件缺失：image 3.png（image.png）

## 4.输入nvidia-smi检测显卡驱动是否显示

# 4.参考链接

[Ubuntu:解决显卡驱动问题NVIDIA-SMI has failed because it couldn‘t communicate with the NVIDIA driver._ubuntu nvidia-smi has failed because it couldn't c-CSDN博客](https://blog.csdn.net/weixin_39450145/article/details/133643342)
