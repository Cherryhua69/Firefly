---
title: "Maven工具在Linux环境下安装"
published: 2026-06-29
description: "Maven工具安装 1、准备MAVEN安装包并解压 这里下载的是 apache maven 3.6.3 bin.tar.gz 安装包,并将其放置于提前创建好的 /opt/maven目录下。 执行命令解压之: 即可在当前目录得到 /opt/maven/apache maven 3."
image: ""
tags: ["Linux", "Java"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# Maven工具安装

### 1、准备MAVEN安装包并解压

这里下载的是 apache-maven-3.6.3-bin.tar.gz 安装包,并将其放置于提前创建好的 /opt/maven目录下。

执行命令解压之:

```
tar zxvf apache-maven-3.6.3-bin.tar.gz
```

即可在当前目录得到 /opt/maven/apache-maven-3.6.3 目录

### 2、配置MAVEN加速镜像源

这里配置的是阿里云的maven镜像源。

编辑修改 /opt/maven/apache-maven-3.6.3/conf/settings.xml文件,在 《mirrors》  标签对里添加如下内容即可:

```
<mirror>
 <id>alimaven</id>
 <name>aliyun maven</name>
 <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
 <mirrorOf>central</mirrorOf>
</mirror>
```

### 3、配置环境变量

因为下载的是二进制版安装包,所以解压完,配置好环境变量即可使用了。

编辑修改 /etc/profile 文件,在文件尾部添加如下内容,配置 maven 的安装路径

```
export MAVEN_HOME=/opt/maven/apache-maven-3.6.3
export PATH=$MAVEN_HOME/bin:$PATH
```

接下来执行 source /etc/profile 来刷新环境变量,让 maven 环境的路径配置生效

### 4、检验安装结果

执行 mvn –v ,能打印出 maven 版本信息说明安装、配置成功
