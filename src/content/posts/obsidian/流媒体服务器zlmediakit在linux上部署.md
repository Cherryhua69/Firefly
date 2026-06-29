---
title: "流媒体服务器ZLMediaKit在linux上部署"
published: 2026-06-29
description: "流媒体服务器ZLMediaKit在linux上 CentOS7 部署与启动 1、获取代码 2、安装编译器gcc 3、安装并升级cmake至3.1版本以上 1 2 删除旧版本的cmake 3 创建安装目录并在目录中下载新版本的cmake 4 编译安装 5 修改环境变量 保存环境变量"
image: ""
tags: ["Linux", "流媒体"]
category: "音视频"
draft: false
lang: "zh-CN"
---

# 流媒体服务器ZLMediaKit在linux上(CentOS7)部署与启动

## 1、获取代码

```
#国内用户推荐从同步镜像网站gitee下载
git clone --depth 1 https://gitee.com/xia-chu/ZLMediaKit
cd ZLMediaKit
#千万不要忘记执行这句命令
git submodule update --init#国内用户推荐从同步镜像网站gitee下载
git clone --depth 1 https://gitee.com/xia-chu/ZLMediaKit
cd ZLMediaKit
#千万不要忘记执行这句命令
git submodule update --init
```

## 2、安装编译器gcc

```
sudo yum -y install gcc
sudo yum -y install gcc-c++
```

## 3、安装并升级cmake至3.1版本以上

### 1)

```
yum install -y cmake
cmake -version
cmake version 2.8.12.2
```

### 2)删除旧版本的cmake

```
yum remove cmake -y
```

### 3)创建安装目录并在目录中下载新版本的cmake

```
mkdir /opt/cmake
cd /opt/cmake
wget https://cmake.org/files/v3.9/cmake-3.9.2.tar.gz
tar zxvf cmake-3.9.2.tar.gz
```

### 4)编译安装

```
./configure --prefix=/usr/local/cmake
make && make install
```

### 5)修改环境变量

```
export CMAKE_HOME=/usr/local/cmake
export PATH=$PATH:$CMAKE_HOME/bin
```

保存环境变量

```
source /etc/profile
```

### 6)查看cmake版本

```
cmake --version
```

## 4、安装其它插件

### 1)安装openssl

```
yum -y install openssl
```

### 2)安装 yasm

```
wget http://www.tortall.net/projects/yasm/releases/yasm-1.3.0.tar.gz
tar -zxvf yasm-1.3.0.tar.gz
cd yasm-1.3.0
./configure
make && make install
```

### 3)安装ffmpeg

### 1、下载解压

```
wget http://www.ffmpeg.org/releases/ffmpeg-3.1.tar.gz
tar -zxvf ffmpeg-3.1.tar.gz
```

### 2、 进入解压后目录,输入如下命令/usr/local/ffmpeg为自己指定的安装目录

```
cd ffmpeg-3.1
./configure --prefix=/usr/local/ffmpeg
make && make install
```

### 3、配置变量

```
vi /etc/profile
在最后PATH添加环境变量:
export PATH=$PATH:/usr/local/ffmpeg/bin
保存退出
查看是否生效
source /ect/profile  设置生效
```

### 4、查看版本

```
ffmpeg -version
```

## 5、构建和编译项目

```
cd ZLMediaKit
mkdir build
cd build
cmake ..
make -j4
```

## 6、运行

```
cd ZLMediaKit/release/linux/Debug
#通过-h可以了解启动参数
./MediaServer -h
#以守护进程模式启动
./MediaServer -d &
#以自定义配置文件启动
./MediaServer -c 配置文件具体地址
(nohup ./MediaServer -c 配置文件具体地址 &)
```

FFmpeg推流测试:

[**https://github.com/ZLMediaKit/ZLMediaKit/wiki/ZLMediaKit推流测试**](https://github.com/ZLMediaKit/ZLMediaKit/wiki/ZLMediaKit%E6%8E%A8%E6%B5%81%E6%B5%8B%E8%AF%95)

## 7、关闭运行命令

```bash
# 如果你是后台启动方式
sudo killall -2 MediaServer
```

## 8、参考链接

1. [https://blog.csdn.net/qq_29752857/article/details/132321380](https://blog.csdn.net/qq_29752857/article/details/132321380)
2. github:[https://github.com/ZLMediaKit/ZLMediaKit/wiki/快速开始](https://github.com/ZLMediaKit/ZLMediaKit/wiki/%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)(按照官方教程一般没啥问题)
