---
title: "Maven安装和配置详细教程（Windows）"
published: 2026-06-29
description: "一、下载maven 1、官网下载zip 推荐安装 ,需要登录 2、下载完成后,解压到某一路径下。本文以E:\\JAVA\\environment\\Maven\\apache maven 3.9.1为例,实际配置环境变量时以自己安装的路径为准 二、配置环境变量 配置前请将JDK装好 系统"
image: ""
tags: ["Windows", "Java"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 一、下载maven

## 1、官网下载zip(推荐安装),需要登录

> 图片附件缺失：image 15.png（image.png）

## 2、下载完成后,解压到某一路径下。本文以E:\JAVA\environment\Maven\apache-maven-3.9.1为例,实际配置环境变量时以自己安装的路径为准

# 二、配置环境变量

**配置前请将JDK装好**

系统变量配置:

- M2_HOME —> 对应自己的Maven目录下的bin目录
- MAVEN_HOME —> 对应自己的Maven的目录
- 在系统的path中配置 %MAVEN_HOME%/bin

# 三、测试maven是否配置成功

打开cmd

mvn -version

# 四、参考链接

[https://blog.csdn.net/qq_37276543/article/details/130077953](https://blog.csdn.net/qq_37276543/article/details/130077953)
