---
title: "opencv使用CMake和MinGW-w64的编译安装"
published: 2026-06-29
description: "1.安装环境 提前在电脑中安装以下软件或环境 Windows 10 MinGW x64 CMake OpenCV 4.5.5 2.使用cmake gui配置编译 1.打开 cmake gui,设置源码和生成路径: 第二个路径为自己创建的编译路径:要和第一个同级目录 Where i"
image: ""
tags: ["C++"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1.安装环境

提前在电脑中安装以下软件或环境

- **Windows-10**
- [**MinGW-x64**](http://sourceforge.net/projects/mingwbuilds/files/host-windows/releases/4.8.1/64-bit/threads-posix/seh/x64-4.8.1-release-posix-seh-rev5.7z/download)
- [**CMake**](https://cmake.org/download/)
- [**OpenCV-](https://opencv.org/releases.html)4.5.5**

# 2.使用cmake-gui配置编译

## 1.打开 cmake-gui,设置源码和生成路径:

(第二个路径为自己创建的编译路径:要和第一个同级目录)

- Where is the source code: `E:/opencv_455/opencv/sources`
- Where to build the binaries: `E:/opencv_455/opencv_mingw64_build`

## 2.点击 Configure,设置编译器(很关键)

- Specify the generator for this project: `MinGW Makefiles`
- Specify native compilers
- Next
- Compilers C: `E:\MinGW-w64\x64-4.8.1-release-posix-seh-rev5\mingw64\bin\gcc.exe`
- Compilers C++: `E:\MinGW-w64\x64-4.8.1-release-posix-seh-rev5\mingw64\bin\g++.exe`
- Finish

## 3.编译配置(默认的其它选项不改)

- 勾选 `WITH_OPENGL`
- 勾选 `ENABLE_CXX11`
- 不勾选 `WITH_IPP`
- 不勾选 `ENABLE_PRECOMPILED_HEADERS`

## 4.再次点击 Configure====》》Generate 生成 Makefile

无报错即可

# 3.**编译 OpenCV**

打开自己创建的`E:/opencv_455/opencv_mingw64_build 的路径终端cmd`

进行编译

```
cd E:/opencv_455/opencv_mingw64_build
mingw32-make -j 8
mingw32-make install

#(也可以是[**MinGW-x64**](http://sourceforge.net/projects/mingwbuilds/files/host-windows/releases/4.8.1/64-bit/threads-posix/seh/x64-4.8.1-release-posix-seh-rev5.7z/download)工具修改过后的命令
# make -j 8
# make install
# )
```

# 4.自己出现的**编译 OpenCV**错误

**调用OpenCV库出现: undefined reference to `xxxxx‘ 的解决办法(使用MinGW编译器)**

## 1.程序的CMakeLists.txt文件

```bash
cmake_minimum_required(VERSION 3.18)
project(test)

# set(OpenCV_DIR "XXX")
# xxxx目录包含OpenCVConfig.cmake
set(OpenCV_DIR "E:/opencv_455/opencv_mingw64_build")

# 寻找OpenCV库
find_package( OpenCV REQUIRED )

# 添加头文件
include_directories( ${OpenCV_INCLUDE_DIRS} )

# 链接OpenCV库
add_executable(test test01.cpp)
target_link_libraries(test ${OpenCV_LIBS})
```

## 2.测试代码

```cpp
#include <iostream>
#include <fstream>
#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include<opencv2/opencv.hpp>
using namespace std;
using namespace cv;

int main()
{
    Mat images;
    images = imread("test.jpg",0);
    cv::Mat grayim;
    Size dsize = Size(120, 160);
    Mat shrink;
    resize(images, shrink, dsize, 0, 0, INTER_AREA);
    imwrite("after.jpg", shrink);
    cout<<"处理完成!"<<endl;
    return 0;
}
```

## 3.mingw64编译运行程序

```cpp
cmake -G "MinGW Makefiles" ..       // 相当于cmake ..
mingw32-make                       // 相当于make
```

## 4.出现的问题:

**出现undefined reference to cv::Mat::Mat()等一系列的undefined reference to XXX**

**原因是没有正确链接到动态库。或者之前有安装其他版本的opencv**

## 5.解决办法

### 1.方法一(推荐):自己编译一份OpenCV的源码再使用(如图的opencv_mingw64_build就是自己编的)

### 2.方法二:

[https://github.com/huihut/OpenCV-MinGW-Build](https://github.com/huihut/OpenCV-MinGW-Build)

提供了已经有编译好opencv库,使用这个编译好的库的前提是自己的环境和作者的环境一样。所以还是自己编译吧。否则到最后会出现下图这样的问题:

### 3.最后还要添加环境变量(防止下图报错)

**将bin(`E:\opencv_455\opencv_mingw64_build\bin`)目录加到系统的环境变量PATH里,方便程序在运行时能够找到对应的动态库。**

**将bin(`E:\opencv_455\opencv_mingw64_build\bin`)目录下的所有.dll文件复制到C:\Windows\System32目录下, 否则会出现无法定位程序输入点...于动态链接库...上**

最后程序才能正常运行

# 5.**编译 OpenCV 常见其它错误**

- **MinGW-w64 的 aviriff.h 文件注释错误**
- **cap_msmf.cpp capture code 错误【2018年10月13日修改,因编译 OpenCV-4.0.0-alpha 时遇到并解决】**
- **‘M_PI’ was not declared in this scope 错误【2018年10月13日修改,因编译 OpenCV-4.0.0-alpha 时遇到并解决】**
- **‘posix_memalign’ was not declared in this scope 错误【2018年11月17日修改,因编译 OpenCV-4.0.0-rc 时遇到并解决】**
- **‘D3D11_TEXTURE2D_DESC’ was not declared in this scope 错误【2019年4月10日修改,因编译 OpenCV-4.1.0 时遇到并解决】**

**报错调整参考以下链接:**

1. [https://blog.huihut.com/2018/07/31/CompiledOpenCVWithMinGW64/](https://blog.huihut.com/2018/07/31/CompiledOpenCVWithMinGW64/)
2. [https://blog.csdn.net/poosdsd/article/details/137482573](https://blog.csdn.net/poosdsd/article/details/137482573)

# 6.参考链接:

1. https://blog.csdn.net/qq_38043069/article/details/125321250
2. https://blog.huihut.com/2018/07/31/CompiledOpenCVWithMinGW64/
