---
title: "boost使用CMake和MinGW-w64的编译安装"
published: 2026-06-29
description: "1.环境 操作系统: Windows 10 Boost 版本: 1.84.0 GCC 版本: mingw x64 CMake 2. Boost 库编译安装 1. 下载解压 Boost 源码,并解压 官网链接:https://www.boost.org/users/history/"
image: ""
tags: ["C++"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1.环境

- 操作系统: Windows 10
- Boost 版本: 1.84.0
- GCC 版本: mingw-x64
- CMake

# 2.**Boost 库编译安装**

## 1.**下载解压 Boost 源码,并解压**

官网链接:https://www.boost.org/users/history/

## 2.安装

1. 进入 `tools\build\v2\` 目录(注: 此处**最好查阅一下官方文档**, 如最新 Boost 1.80.0 版本中只进入到 `tools\build\` 目录), **重点是确认当前路径下具有 `bootstrap.bat`(一定要有) 和 `b2.exe`(这个文件没有也没关系,新版本可能没有) 两个文件**.
2. 运行**使用 GCC** 运行 `bootstrap.bat` 脚本, **注意要使用 `gcc` 作为参数**.
3. 运行 `.\b2 install --prefix=PREFIX` 安装 Boost.Build, **其中 `PREFIX` 是 Boost.Build 的安装路径**, 此处路径为 `D:\ProgTools\boost_1_54_0\boost_build`.

命令:

```bash
cd .\tools\build\v2\
.\bootstrap.bat gcc
# --prefix=自己创建的目标安装路径
.\b2 install --prefix=D:\ProgTools\boost_1_84_0\boost_build
```

**安装成功后, 在 Boost.Build 安装路径下找到 `b2.exe` 文件: 在 1.54.0 版本是在 `bin` 目录下; 而在 1.80.0 版本直接在 Boost.Build 的安装目录下.**

## 3.**编译安装 Boost**

在 Boost 的根目录使用以下命令使用 GCC 编译安装 Boost:

```bash
.\tools\build\v2\b2 --build_dir=D:\ProgTools\boost_1_84_0\boost_build toolset=gcc --build-type=complete stage
```

- `b2` 即上文 Boost.Build 路径下的 `b2.exe` 文件, 此处可以通过完整路径运行, 也可以将其添加到环境变量从而省去路径部分.
- `-build_dir`: 编译生成的中间文件存放目录, 可以不指定.
- `toolset`: 编译所用的工具集, 此处**使用 GCC 编译所用要特别指明为 `gcc`**.
- `-build_type`: 构建类型, `complete` 表示构建库的所有支持的编译版本, 包括静态库、动态库、调试版本等

**编译需要一段时间, 完成后, 可以在 `stage\lib` 目录下看到生成的库文件:**

# 3.程序使用

## 1.测试代码

```cpp
#include <boost/regex.hpp>
#include <iostream>
#include <string>

int main() {
    std::string line("Subject: Aw shell");
    boost::regex pat("^Subject: (Re: |Aw: )*(.*)");

    boost::smatch matches;
    if (boost::regex_match(line, matches, pat))
        std::cout << "MATCH: " << matches[2] << std::endl;
    return 0;
}
```

## 2.CMakeLists.txt

```bash
set(BOOST_ROOT "D:/ProgTools/boost_1_84_0/")    # 指定Boost库的根目录
set(Boost_USE_STATIC_LIBS ON)    # 设置使用Boost静态库
#set(Boost_ARCHITECTURE "-x64")    # 指定库架构为x64
find_package(Boost REQUIRED)    # 查找Boost库
include_directories(${Boost_INCLUDE_DIRS})    # 包含Boost库的头文件目录

add_executable(cppexp main.cpp)
target_link_libraries(cppexp ${Boost_LIBRARIES})    # 链接Boost库
```

- `set(BOOST_ROOT "D:/ProgTools/boost_1_54_0/")`: 指定 Boost 库的根目录. 由于是编译安装的 Boost 库, 因此一般需要该语句, 否则会出现找不到 Boost 库的情况.
- `find_package(Boost COMPONENTS regex REQUIRED)`: 查找 Boost 库配置, `COMPONENTS` 选项用于指定所使用的具体的 Boost 库名称, 完整指令格式如下:
- `include_directories(${Boost_INCLUDE_DIRS})`: 包含 Boost 库的头文件目录
- `target_link_libraries(cppexp ${Boost_LIBRARIES})`: 链接 Boost 库
- `set(Boost_USE_STATIC_LIBS ON)`: 设置使用 Boost 静态库. **笔者在不使用该语句时会出现运行异常退出的情况**, 如下图所示:
- `set(Boost_ARCHITECTURE "-x64")`: **指定库架构为 `x64`**. 该指令在 1.54.0 版本并不需要, 但**在 1.80.0 则必须加上**, 这是因为 1.80.0 版本生成的**库文件中有 `x32` 和 `x64` 的后缀**, 需要用该选项进行指定, 否则会出现找到 Boost 库但找不到具体模块的情况.

# 4.**MinGW编译Boost库报错处理**

## 1.错误

运行[boost](https://so.csdn.net/so/search?q=boost&spm=1001.2101.3001.7020)编译指令,报错“notice: could not find main target stage

notice: assuming it is a name of file to create.

don’t know how to make stage

...found 1 target...

...can’t find 1 target...”

## 2.解决

要在根路径执行

```
cd D:\boost
b2 --build-dir="D:\boost_1_80_0\build" --toolset=gcc --build-type=complete stage
```

## 3.其它

“...found 1 target...”:忽略此类错误也可以执行代码

# 5.参考链接:

[https://blog.csdn.net/LostUnravel/article/details/127076377](https://blog.csdn.net/LostUnravel/article/details/127076377)

[https://blog.csdn.net/zeye5731/article/details/127379995](https://blog.csdn.net/zeye5731/article/details/127379995)
