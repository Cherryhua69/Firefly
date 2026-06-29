---
title: "Nginx在Linux下安装教程"
published: 2026-06-29
description: "Nginx安装 1、首先安装包并解压 这里下载的是 nginx 1.17.10.tar.gz 安装包,并将其直接放在了 root 目录下 在 /usr/local/ 下创建 nginx 文件夹并进入 将 Nginx 安装包解压到 /usr/local/nginx 中即可 解压完之"
image: ""
tags: ["Linux", "Nginx"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# Nginx安装

### 1、首先安装包并解压

这里下载的是 nginx-1.17.10.tar.gz 安装包,并将其直接放在了 root 目录下

在 /usr/local/ 下创建 nginx 文件夹并进入

```
cd /usr/local/
mkdir nginx
cd nginx
```

将 Nginx 安装包解压到 /usr/local/nginx 中即可

```
[root@localhost nginx]# tar zxvf /root/nginx-1.17.10.tar.gz -C ./
```

解压完之后, /usr/local/nginx 目录中会出现一个 nginx-1.17.10 的目录

### 2、预先安装额外的依赖

```
yum -y install pcre-devel
yum -y install openssl openssl-devel
```

### 3、编译安装NGINX

```
cd nginx-1.17.10
./configure
make && make install
```

安装完成后,Nginx的可执行文件位置位于

```
/usr/local/nginx/sbin/nginx
```

### 4、启动NGINX

直接执行如下命令即可:

```
[root@localhost sbin]# /usr/local/nginx/sbin/nginx
```

如果想停止Nginx服务,可执行:

```
/usr/local/nginx/sbin/nginx -s stop
```

如果修改了配置文件后想重新加载Nginx,可执行:

```
/usr/local/nginx/sbin/nginx -s reload
```

注意其配置文件位于:

```
/usr/local/nginx/conf/nginx.conf
```

### 5、浏览器验证启动情况

输入你的虚拟机IP直接访问(默认就为80端口)
