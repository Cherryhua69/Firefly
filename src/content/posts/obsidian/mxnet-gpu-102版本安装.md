---
title: "Mxnet-GPU-102版本安装"
published: 2026-06-29
description: "1、安装10.2版本的CUDA硬件加速环境 本blog的安装教程的跳转连接:https://blog.cherrylord.cn/article/post 29 2、创建conda虚拟环境 要创建的环境的python版本需要3.7.13的版本 3、直接安装mxnet cu102的"
image: ""
tags: ["AI"]
category: "AI"
draft: false
lang: "zh-CN"
---

# 1、安装10.2版本的CUDA硬件加速环境

**本blog的安装教程的跳转连接:[https://blog.cherrylord.cn/article/post-29](https://blog.cherrylord.cn/article/post-29)**

# 2、创建conda虚拟环境

要创建的环境的python版本需要3.7.13的版本

```bash
conda create --name mxnet python==3.7.13
```

# 3、直接安装mxnet_cu102的pip包

- 有对应下载源的可以直接在线安装下载

```bash
pip install mxnet_cu102 -i <下载源地址>
```

- 没有下载源的可以找资源下载.whl文件后,手动安装下载

依赖包下载地址:[https://dist.mxnet.io/python](https://dist.mxnet.io/python)

在依赖包路径下,进入创建的虚拟环境进行安装:

```bash
pip install mxnet_cu102-1.7.0-py2.py3-none-win_amd64.whl
```
