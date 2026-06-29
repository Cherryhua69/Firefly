---
title: "Windows下C++对接海康SDK"
published: 2026-06-29
description: "1.在cmakelists中编写相关配置 2.程序相关的.dll文件位置 根据项目所用到的海康摄像头接口功能,把需要用的.dll文件复制到C++的可执行文件的同级目录下"
image: ""
tags: ["Windows", "C++"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1.在cmakelists中编写相关配置

```bash
# 头文件目录设置HCNetSDK.h所在的目录
include_directories(
    ${CMAKE_SOURCE_DIR}/include
)

# 库文件路径配置HCNetSDK.lib所在的目录
link_directories(
    ${CMAKE_SOURCE_DIR}/lib
    )

# 添加可执行文件所需要链接的库(第二个参数为HCNetSDK.lib的路径)
target_link_libraries(${PROJECT_NAME} E:/AI/C++/cpp_fc_test/lib/HCNetSDK.lib)

#其余配置根据项目需求写
```

# 2.程序相关的.dll文件位置

根据项目所用到的海康摄像头接口功能,把需要用的.dll文件复制到C++的可执行文件的同级目录下
