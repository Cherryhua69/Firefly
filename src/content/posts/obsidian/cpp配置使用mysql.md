---
title: "C++配置使用MySQL"
published: 2026-06-29
description: "1、Linux安装MySQL 这里以Ubuntu系统为例 安装完之后还要配置mysql相关连接设置 2、安装其它需要的依赖库 3、配置MySQL 参考推荐链接:https://blog.csdn.net/weixin 45626288/article/details/133220"
image: ""
tags: ["C++", "MySQL"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1、Linux安装MySQL

这里以Ubuntu系统为例

```bash
sudo apt search mysql-server
sudo apt install -y mysql-server-8.0
sudo apt search mysql-client
sudo apt install -y mysql-client-8.0
```

安装完之后还要配置mysql相关连接设置

```bash
查看是否运行
service mysql status
重启
sudo service mysql restart
```

# 2、安装其它需要的依赖库

```bash
sudo apt-get update
sudo apt-get install libmysql++-dev
sudo apt-get install libmysqlclient-dev
```

# 3、配置MySQL

参考推荐链接:https://blog.csdn.net/weixin_45626288/article/details/133220238

# 4、配置CmakeList文件

```bash
include_directories(/usr/include/mysql)
link_directories(/usr/lib/x86_64-linux-gnu)
set(MYSQL_LIBS mysqlclient pthread dl ssl crypto resolv m rt)
TARGET_LINK_LIBRARIES(http_server
${MYSQL_LIBS}
)
```

# 5、参考链接

- https://blog.csdn.net/qq_34529292/article/details/138377595
- [https://blog.csdn.net/weixin_54607027/article/details/127831023](https://blog.csdn.net/weixin_54607027/article/details/127831023)
