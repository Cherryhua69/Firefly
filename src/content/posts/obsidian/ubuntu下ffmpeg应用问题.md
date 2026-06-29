---
title: "Ubuntu下FFmpeg应用问题"
published: 2026-06-29
description: "1. ubuntu彻底卸载ffmpeg 1.查看ffmpeg: 2.卸载 3.检查是否卸载成功 2. Ubuntu22.04编译安装FFmpeg 1.下载 官网:https://ffmpeg.org/download.html repositories github仓库:http"
image: ""
tags: ["Linux", "流媒体"]
category: "音视频"
draft: false
lang: "zh-CN"
---

# 1.**ubuntu彻底卸载ffmpeg**

## 1.查看ffmpeg:

```bash
sudo dpkg -l | grep ffmpeg
```

## 2.卸载

```bash
sudo find / | grep -w ffmpeg | sudo xargs rm -r -f
sudo apt-get --purge remove ffmpeg
sudo apt-get --purge autoremove
```

## 3.检查是否卸载成功

```bash
ffmpeg -version
```

# 2.**Ubuntu22.04编译安装FFmpeg**

## 1.下载

官网:https://ffmpeg.org/download.html#repositories

github仓库:[https://git.ffmpeg.org/ffmpeg.git](https://git.ffmpeg.org/ffmpeg.git) ffmpeg

## 2.编译安装

### 1.按需安装需要的依赖文件

```bash
sudo apt-get update && sudo apt-get -y install \
  autoconf \
  automake \
  build-essential \
  cmake \
  git-core \
  libass-dev \
  libfreetype6-dev \
  libgnutls28-dev \
  libmp3lame-dev \
  libsdl2-dev \
  libtool \
  libva-dev \
  libvdpau-dev \
  libvorbis-dev \
  libxcb1-dev \
  libxcb-shm0-dev \
  libxcb-xfixes0-dev \
  meson \
  ninja-build \
  pkg-config \
  texinfo \
  wget \
  yasm \
  zlib1g-dev \
  libunistring-dev
```

### 2.**编译配置**

```bash
#仅配置路径
./configure --enable-shared  --prefix=/usr/local/ffmpeg

#配置某些选项
./configure --prefix=/usr/local/ffmpeg --enable-shared --disable-static --disable-doc  --enable-gpl --enable-libx264

#配置项查看
./configure --help
```

### 3.安装

```bash
sudo make
sudo make install
```

## 3.**建立软链接**

FFmpeg编译完成后,生成了ffmpeg、ffplay、ffprobe3个可执行程序。

`ffmpeg` 是用于处理视频和音频文件的命令行工具。它可以合并多个音频/视频流、剪辑、转换格式、调整大小等功能。

`ffplay` 是一个基于 `FFmpeg` 库的简单媒体播放器。它支持大多数音频和视频格式,并且可以根据需要进行实时解码和播放。

`ffprobe` 用于分析媒体文件及其详细信息的多媒体分析工具,旨在提供有关媒体文件内容的详细信息,包括编解码器的详细信息、容器信息等。它是通过 `FFmpeg` 库调用实现的。

```bash
sudo ln -s /usr/local/ffmpeg/bin/ffmpeg /usr/bin/ffmpeg
sudo ln -s /usr/local/ffmpeg/bin/ffprobe /usr/bin/ffprobe
sudo ln -s /usr/local/ffmpeg/bin/ffplay /usr/bin/ffplay
```

## 4.**工具路径添加到环境变量**

方便使用工具。直接在任意路径下,都可以输入工具名称并执行指令。

```bash
#打开.bashrc文件
sudo gedit ~/.bashrc
#sudo vim ~/.bashrc

#在文件中添加
export PATH="/usr/local/ffmpeg/bin:$PATH"

#使修改生效
source ~/.bashrc
```

## 5.**动态库配置到环境变量**

```bash
sudo vi /etc/ld.so.conf
在其中添加路径:/usr/local/ffmpeg/lib

sudo ldconfig#更新环境变量
```

## 6.查看版本

```bash
ffmpeg -version
```

# 3.各种报错解决

## 1.**ffmpeg: error while loading shared libraries: libavdevice.so.58**

输入ffmpeg -version,报错:

ffmpeg: error while loading shared libraries: libavdevice.so.58: cannot open shared object file: No such file or directory

### 1.原因:

ubuntu通过源码安装[软件](https://marketing.csdn.net/p/3127db09a98e0723b83b2914d9256174?pId=2782?utm_source=glcblog&spm=1001.2101.3001.7020)未进行环境变量配置,找不到启动路径

### 2.解决

```bash
sudo gedit /etc/ld.so.conf
#sudo vim /etc/ld.so.conf

# 加入以下路径(即自己安装FFmpeg的相关路径)
/usr/local/ffmpeg/lib/

sudo ldconfig

# 最后输入指令检查
ffmpeg
```

## 2.**ffmpeg 无法找到libpostproc的问题**

在编译的时候,加上的参数必须有enable-gpl否则的话,很多后期处理的函数参数就没法使用了,如ffmpeg 滤波,去除不想要的干扰,噪声,颜色等等,如下:

```bash
./configure --enable-shared --enable-postproc --enable-gpl
```
