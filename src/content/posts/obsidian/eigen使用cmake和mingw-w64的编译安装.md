---
title: "Eigen使用CMake和MinGW-w64的编译安装"
published: 2026-06-29
description: "1.环境 平台: Windows 10 编译器: mingw , gcc/g++ CMake Eigen 版本:3.4.0 2. 编译安装 1.官网下载源码 https://eigen.tuxfamily.org/index.php?title=Main Page 2.打开 cm"
image: ""
tags: ["C++"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1.环境

- 平台:*Windows 10*
- 编译器:*mingw*,*gcc/g++*
- *CMake*
- *Eigen*版本:3.4.0

# 2.**编译安装**

## 1.官网下载源码

[https://eigen.tuxfamily.org/index.php?title=Main_Page](https://eigen.tuxfamily.org/index.php?title=Main_Page)

## 2.打开 *cmake-gui* 配置编译安装环境

- *where is the source code* 处选择刚刚下载并解压的源码文件夹,在同级目录新建一个 *build* 文件夹,在 *where to build the binaries* 处选择该文件夹。
- 点击*Configure*
- 设置编译器(很关键):

---

**Specify the generator for this project: `MinGW Makefiles`**

**Specify native compilers**

**Next**

**Compilers C: `E:\MinGW-w64\x64-4.8.1-release-posix-seh-rev5\mingw64\bin\gcc.exe`**

**Compilers C++: `E:\MinGW-w64\x64-4.8.1-release-posix-seh-rev5\mingw64\bin\g++.exe`**

**Finish**

---

- 由于 *cmake-gui* 生成的默认安装路径有问题,所以我们要自己进行修改,将 *INCLUDE_INSTALL_DIR* 变量设置为源码的路径,比如我源码的路径是 *D:/eigen-3.4.0* ,我就要填上 *eigen-3.4.0* (注意使用//分割路径;非完整路径,而是eigen-3.4.0的上级路径一起写)。如下图所示。
- 点击*Configure* ==》》Generate

# 3.程序中使用Eigen

## 1.CMakeLists.txt

```
find_package(Eigen3 REQUIRED)

include_directories(${EIGEN3_INCLUDE_DIRS})
message(-----${EIGEN3_INCLUDE_DIRS}-----)

add_executable(eigen_test eigen_test.cpp)
target_link_libraries(eigen_test)
```

## 2.测试程序

```cpp
#include <iostream>
#include "Eigen/Dense"

int main(int argc, char** argv)
{
    Eigen::Matrix<int, 2, 2> a, b;
    a << 1, 1,
         1, 0;
    b << 1, 0,
         0, 1;
    std::cout << a * b << std::endl;
    return 0;
}
```

下图输出则成功:

# 4.其它问题

linux或者arm架构下的需要手动安装:

```bash
sudo apt-get install libeigen3-dev
```

# 5.参考链接

[https://blog.csdn.net/weixin_45467056/article/details/120531111](https://blog.csdn.net/weixin_45467056/article/details/120531111)
