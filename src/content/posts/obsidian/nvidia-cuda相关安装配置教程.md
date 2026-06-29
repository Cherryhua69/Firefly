---
title: "Nvidia cuda相关安装配置教程"
published: 2026-06-29
description: "1、原CUDA卸载 没有则可以不用这步 把所有带 NVIDIA CUDA————— 前缀的卸载干净 推荐使用geek卸载,缓存和注册表才能卸载,否则需要手动找到相关位置自行删除。 一般只有一下几个 2、准备安装位置和下载好深度学习需要的版本环境 2.1 CUDA下载 CUDA10"
image: ""
tags: ["Linux"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、原CUDA卸载

(没有则可以不用这步)

把所有带 NVIDIA CUDA—————-前缀的卸载干净

推荐使用geek卸载,缓存和注册表才能卸载,否则需要手动找到相关位置自行删除。

一般只有一下几个

# 2、准备安装位置和下载好深度学习需要的版本环境

## 2.1 CUDA下载

CUDA10.2官网下载链接:[https://developer.nvidia.com/cuda-10.2-download-archive](https://developer.nvidia.com/cuda-10.2-download-archive)

## 2.2 cuDNN下载

cuDNN官网下载链接(需登录NVIDIA账号):[https://developer.nvidia.cn/rdp/cudnn-archive](https://developer.nvidia.cn/rdp/cudnn-archive)

## 2.3 创建CUDA安装的文件夹位置

一共有两个主要文件夹,根据默认的CUDA安装位置对应修改成自己想要的位置。

- F:\Program Files\NVIDIA Corporation\CUDA Samples\v10.2
- F:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.2

多版本的话可以在.\v10.2的同级目录下创建,例如:

- F:\Program Files\NVIDIA Corporation\CUDA Samples\v11.2
- F:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v11.2

# 3、安装CUDA

- 点击.exe文件运行,第一个安装位置可选可不选,只是安装的临时缓存,安装完成之后会自动删除

- 安装选项选择自定义安装,并取消以下内容的安装勾选

- 选择安装位置:根据之前创建的文件夹对应位置放置即可(多版本也是如此)
- 等待安装完成即可(若是提示有些未安装的内容,可以不用管,除非是深度学习优化的组件)

# 4、解压cuDNN放在指定位置

**注意**:一定要和CUDA版本对应。

cuDNN解压的所有文件复制到刚才安装的CUDA的以下路径下面:

F:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.2

验证安装即可:

```bash
# 控制台输入出现对应版本号
nvcc -V
```

单版本安装完成!

# 5、多版本环境变量配置

## 5.1 删除默认变量配置

(多个版本的话都要删除)删除系统变量下的-》Path-》:

## 5.2 查看复制不同版本的变量名称

安装了多个不同本版都会在系统变量中显示

## 5.3 设置Path变量指向

- 编辑系统变量中的Path,并新建以下四个(单独新建):

**%CUDA_PATH_V10_2%\lib\x64**

**%CUDA_PATH_V10_2%\include**

**%CUDA_PATH_V10_2%\extras\CUPTI\lib64**

**%CUDA_PATH_V10_2%\bin**

- 多版本也一样新建另外四个:

- 想用哪个版本的CUDA则在保存以上内容之后,对应的四个环境变量位置上移至另一个版本的上面即可切换成自己需要的版本!

## 5.4 验证安装(更改不同的环境之后需要重新关闭打开cmd控制台才能验证)

验证安装即可:

```bash
# 控制台输入出现对应版本号
nvcc -V
```
