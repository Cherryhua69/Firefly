---
title: "cmake和opencv的编译安装"
published: 2026-06-29
description: "1、准备工作 1.1 C/C++编译环境配置 安装gcc和g++ 或者直接安装build essential,安装了该软件包,编译c/c++所需要的软件包也都会被安装。 安装cmake编译工具 cmake包直接安装: 根据实际需要,选择性安装libjpeg dev, libpng"
image: ""
tags: ["C++"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1、准备工作

## 1.1 C/C++编译环境配置

安装gcc和g++

```bash
sudo apt install gcc
sudo apt install g++
```

或者直接安装build-essential,安装了该软件包,编译c/c++所需要的软件包也都会被安装。

```bash
sudo apt install build-essential
```

安装cmake编译工具

```bash
sudo apt install cmake
```

(cmake包直接安装:

```bash
# 下载
wget https://cmake.org/files/v3.22/cmake-3.22.1.tar.gz

# 解压
tar -xvzf cmake-3.22.1.tar.gz

# 设置环境变量
vim /etc/profile
# 末尾加上
export CMAKE_HOME=/opt/cmake/cmake-3.5.2-Linux-x86_64/bin
export PATH=$CMAKE_HOME:$PATH

# 保存退出,刷新环境变量
source /etc/profile

# 检查
cmake -version
```

)

根据实际需要,选择性安装libjpeg-dev, libpng-dev, libtiff-dev, libjasper-dev, libdc1394-22-dev等

```bash
sudo apt install libjpeg-dev, libpng-dev, libtiff-dev, libjasper-dev, libdc1394-22-dev libtbb2 libtbb-dev libdc1394 2.x CUDA Toolkit 6.5
```

# 2、安装OpenCV

## **下载opencv_contrib包**

```bash
# 或者网站资源直接下载(要和OpenCV的版本一致)
git clone https://github.com/opencv/opencv_contrib.git
```

## 下载OpenCV包

```bash
wget https://codeload.github.com/opencv/opencv/zip/refs/tags/4.5.5
```

## 解压进入OpenCV文件夹安装编译操作

```bash
unzip opencv-4.5.5.zip

cd opencv-4.5.5

mkdir build

cd build

sudo cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local
-D INSTALL_PYTHON_EXAMPLES=OFF -D INSTALL_C_EXAMPLES=OFF
# 以下的路径要指定 **opencv_contririb包的路径**
-D OPENCV_EXTRA_MODULES_PATH=/home/hf/Downloads/opencv_contrib-4.5.5/modules
-D PYTHON_EXCUTABLE=/usr/bin/python3 -D BUILD_opencv_xfeatures2d=OFF
-D BUILD_EXAMPLES=ON -D BUILD_TIFF=ON -D WITH_TIFF=ON -D WITH_OPENMP=ON -D WITH_FFMPEG=ON ..

sudo make -j4
sudo make install
sudo sh -c 'echo "/usr/local/lib" >> /etc/ld.so.conf.d/opencv.conf'
sudo ldconfig

# 验证安装是否成功
pkg-config --modversion opencv
```
