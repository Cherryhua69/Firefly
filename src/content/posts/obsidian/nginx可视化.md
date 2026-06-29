---
title: "Nginx可视化"
published: 2026-06-29
description: "Nginx 1、Nginx 可视化 可以一试 test 配置管理和性能监控 github地址: https://github.com/onlyGuo/nginx gui 1、下载和配置 首先到作者github说明页面,下载对应系统版本的安装包 需要注意的是linux版本有一段描述"
image: ""
tags: ["Nginx"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# Nginx

## 1、Nginx 可视化(可以一试(test))

**配置管理和性能监控**

github地址:

**https://github.com/onlyGuo/nginx-gui**

### 1、下载和配置 首先到作者github说明页面,下载对应系统版本的安装包 需要注意的是linux版本有一段描述不可忽视

#### 1) 下载并解压 Nginx-GUI-For-Linux-1.0.zip

> 图片附件缺失：298745010248879.png（298745010248879.png）

### 2) 修改配置文件

文件位置:conf/conf.properties

```
# nginx 安装路径
nginx.path = /usr/local/Cellar/nginx/1.15.12
# nginx 配置文件全路径
nginx.config = /Users/gsk/dev/apps/nginx-1.15.12/conf/nginx.conf

account.admin = admin
```

### 3) 重命名(此步骤仅linux版本需要)

根据原作者的描述: 针对linux 64位版本需要将 lib/bin/下的 java_vms 文件重命名为 java_vms_nginx_gui

### 1、 在服务器上运行

前面的步骤都完成以后,直接打包发布到服务器

```
# 赋权
sudo chmod -R 777 nginx-gui/

# 后台启动
nohup bash /root/web/nginx-gui/startup.sh > logs/nginx-gui.out &
```

访问默认端口 8889 默认账号密码都是admin
