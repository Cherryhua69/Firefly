---
title: "Redis在Linux下安装教程"
published: 2026-06-29
description: "Redis安装 1、首先准备REDIS安装包 这里下载的是 redis 5.0.8.tar.gz 安装包,并将其直接放在了 root 目录下 2、解压安装包 在 /usr/local/ 下创建 redis 文件夹并进入 将 Redis 安装包解压到 /usr/local/redi"
image: ""
tags: ["Linux"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# Redis安装

### 1、首先准备REDIS安装包

这里下载的是 redis-5.0.8.tar.gz 安装包,并将其直接放在了 root 目录下

### 2、解压安装包

在 /usr/local/ 下创建 redis 文件夹并进入

```
cd /usr/local/
mkdir redis
cd redis
```

将 Redis 安装包解压到 /usr/local/redis 中即可

```
tar zxvf /root/redis-5.0.8.tar.gz -C ./
```

解压完之后, /usr/local/redis 目录中会出现一个 redis-5.0.8 的目录

### 3、编译并安装

```
cd redis-5.0.8/
make
cd src
make install PREFIX=/usr/local/redis
```

### 4、将 REDIS 安装为系统服务并后台启动

进入 utils 目录,并执行如下脚本即可:

```
[root@localhost redis-5.0.8]# cd utils/
[root@localhost utils]# ./install_server.sh
```

此处我全部选择的默认配置即可,有需要可以按需定制

### 5、查看REDIS服务启动情况

直接执行如下命令来查看Redis的启动结果:

```
systemctl status redis_6379.service
```

### 6、启动REDIS客户端并测试

启动自带的 redis-cli 客户端,测试通过:

但是此时只能在本地访问,无法远程连接,因此还需要做部分设置

### 7、设置允许远程连接

编辑 redis 配置文件

```
vim /etc/redis/6379.conf
```

将 bind 127.0.0.1 修改为 0.0.0.0

然后重启 Redis 服务即可:

```
systemctl restart redis_6379.service
```

### 8、设置访问密码

编辑 redis 配置文件

```
vim /etc/redis/6379.conf
```

找到如下内容:

```
#requirepass foobared
```

去掉注释,将 foobared 修改为自己想要的密码,保存即可。

```
requirepass cherryhua
```

保存,重启 Redis 服务即可

```
systemctl restart redis_6379.service
```

这样后续的访问需要先输入密码认证通过方可:

输入你设置的密码验证(在对应的Redis连接软件上也需密码验证)

```
127.0.0.1:6379> auth cherryhua
```

安装成功!

### 9、参考链接

[https://blog.csdn.net/u010448530/article/details/103816085](https://blog.csdn.net/u010448530/article/details/103816085)
