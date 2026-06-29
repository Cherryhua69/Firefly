---
title: "JDK在Linux环境下安装"
published: 2026-06-29
description: "JDK安装 方式一:gz安装包解压安装 1、准备JDK安装包 我这里下载的是 jdk 8u161 linux x64.tar.gz 安装包,并将其直接放在了 root 目录下 2、卸载已有的OPENJDK 如果有 如果系统自带有 OpenJDK ,可以按照如下步骤提前卸载之。 首"
image: ""
tags: ["Linux", "Java"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# JDK安装

## 方式一:gz安装包解压安装

### 1、准备JDK安装包

我这里下载的是 jdk-8u161-linux-x64.tar.gz 安装包,并将其直接放在了 root 目录下

### 2、卸载已有的OPENJDK(如果有)

如果系统自带有 OpenJDK ,可以按照如下步骤提前卸载之。

首先查找已经安装的 OpenJDK 包:

```
rpm -qa | grep java
```

接下来可以将 java 开头的安装包均卸载即可:

```
yum -y remove java-1.7.0-openjdk-1.7.0.141-2.6.10.5.el7.x86_64
yum -y remove java-1.8.0-openjdk-1.8.0.131-11.b12.el7.x86_64
... 省略 ...
```

### 3、创建目录并解压

在 /usr/local/ 下创建 java 文件夹并进入

```
cd /usr/local/
mkdir java
cd java
```

将上面准备好的 JDK 安装包解压到 /usr/local/java 中即可

```
tar -zxvf /root/jdk-8u161-linux-x64.tar.gz -C ./
```

解压完之后, /usr/local/java 目录中会出现一个 jdk1.8.0_161 的目录

### 4、配置JDK环境变量

编辑 /etc/profile 文件,在文件尾部加入如下 JDK 环境配置即可

```
JAVA_HOME=/usr/local/java/jdk1.8.0_161
CLASSPATH=$JAVA_HOME/lib/
PATH=$PATH:$JAVA_HOME/bin
export PATH JAVA_HOME CLASSPATH
```

然后执行如下命令让环境变量生效

```
source /etc/profile
```

### 5、验证JDK安装结果

输入如下命令即可检查安装结果:

```
java -version

javac
```
