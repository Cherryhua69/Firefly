---
title: "Windows 环境多个JDK安装与切"
published: 2026-06-29
description: "1、官方下载jdk 需要登录 官方地址:https://www.oracle.com/java/technologies/downloads/ 2、安装jdk 我这里是直接压缩包解压使用的 也可以自行exe文件安装 3、 多版本的jdk都下载安装完成之后,就是多版本的jdk环境变"
image: ""
tags: ["Linux", "Windows", "Java"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、官方下载jdk(需要登录)

官方地址:[https://www.oracle.com/java/technologies/downloads/](https://www.oracle.com/java/technologies/downloads/)

# 2、安装jdk

我这里是直接压缩包解压使用的(也可以自行exe文件安装)

# 3、**多版本的jdk都下载安装完成之后,就是多版本的jdk环境变量的配置**

## 3.1 找到jdk安装的目录

> 图片附件缺失：image 9.png（image.png）

## 3.2 **在环境变量中新增不同jdk版本的JAVA_HOME**

> 图片附件缺失：image 10.png（image.png）

## 3.3 **创建一个通用的JAVA_HOME,将需要使用的jdk版本的JAVA_HOME赋值给这个通用的JAVA_HOME**

> 图片附件缺失：image 11.png（image.png）

## 3.4 **配置Path环境变量,编辑Path变量,在后面添加两条变量。如果之前配置过其他的jdk的path变量的话,就先把之前的配置删除,重新添加下面两条。并且这两条需要移动到最前面,不然后续无法切换jdk版本。**

**%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;**

> 图片附件缺失：image 12.png（image.png）

## 3.5 **配置CLASSPATH环境变量,编辑CLASSPATH变量,在后面添加下面的配置,如果之前有配置过,也先删除再重新配置。**

**.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;**

> 图片附件缺失：image 13.png（image.png）

# 4、**查看当前jdk版本以及切换不同版本**

## 4.1 **查看当前版本,打开cmd命令行,输入java -version**

## 4.2 **切换其他版本,编辑通用的JAVA_HOME,设置成其他版本的JAVA_HOME值。**

> 图片附件缺失：image 14.png（image.png）

新开一个cmd窗口验证版本
