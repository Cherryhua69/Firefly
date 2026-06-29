---
title: "Labelimg安装与中文版汉化"
published: 2026-06-29
description: "1、github下载源码和汉化包 源码地址:https://github.com/HumanSignal/labelImg/releases 汉化包地址:https://github.com/HumanSignal/labelImg/issues/847 2、准备一个conda环"
image: ""
tags: []
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 1、github下载源码和汉化包

源码地址:[https://github.com/HumanSignal/labelImg/releases](https://github.com/HumanSignal/labelImg/releases)

汉化包地址:https://github.com/HumanSignal/labelImg/issues/847

# 2、准备一个conda环境配置依赖

1. 进入conda环境
2. 安装依赖

```bash
pip install PyQt5

pip install pyqt5-tools

pip install lxml

# window环境下还要安装配置qt(两个不同版本,qt4,qt5,看需求配置)
# pyrcc4 -o libs/resources.py resources.qrc
# For pyqt5, pyrcc5 -o libs/resources.py resources.qrc
```

# 3、替换汉化包

- 首先下载下面提供的文件,放入`\resources\strings`内,替换原文件。

    [strings-zh-CN.zip](https://github.com/tzutalin/labelImg/files/8032830/strings-zh-CN.zip)

    **注意:如果你已经编译过资源文件了,那么需要重新编译一次。**

    *(因为替换了文件所以需要重新链接)*

    例如:`pyrcc5 -o libs/resources.py resources.qrc`

- 然后需要编辑文件`\libs\stringBundle.py`的第52行,

    将字符串`":/strings"`替换为`":/strings-zh-CN"`即可。

- 最后再次运行`labelImg.py`,你会发现已经是中文了

# 4、进入源码启动labelimg

```bash
python labelImg.py
```

# 5、参考链接:

[https://github.com/HumanSignal/labelImg/issues/847](https://github.com/HumanSignal/labelImg/issues/847)

# PS:

## 1、标注时修改默认的标签

修改源码data路径下的predefined_classes.txt文件即可
