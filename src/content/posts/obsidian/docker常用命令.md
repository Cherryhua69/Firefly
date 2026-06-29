---
title: "Docker常用命令"
published: 2026-06-29
description: "docker 1 、常用 2 、删除镜像 3 、保存镜像 将我们的镜像 保存为tar 压缩文件 这样方便镜像转移和保存 ,然后 可以在任何一台安装了docker的服务器上 加载这个镜像命令: 4 、加载镜像 任何装 docker 的地方加载镜像保存文件,使其恢复为一个镜像 5 、"
image: ""
tags: ["Docker"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# docker

### 1)、常用

```
#查看正在运行的容器
docker ps

#查看已有的镜像
docker images

#查看指定运行容器的运行日志(实时)
docker logs 容器ID/Name -f

#查看指定运行容器的运行日志最新100行
docker logs 容器ID/Name --tail=100
```

### 2)、删除镜像

```
#删除一个
docker rmi -f 镜像名/镜像ID

#删除多个 其镜像ID或镜像用用空格隔开即可
docker rmi -f 镜像名/镜像ID 镜像名/镜像ID 镜像名/镜像ID

#删除全部镜像  -a 意思为显示全部, -q 意思为只显示ID
docker rmi -f $(docker images -aq)

#强制删除镜像
docker image rm 镜像名称/镜像ID
```

### 3)、保存镜像

将我们的镜像 保存为tar 压缩文件 这样方便镜像转移和保存 ,然后 可以在任何一台安装了docker的服务器上 加载这个镜像命令:

```
docker save 镜像名/镜像ID -o 镜像保存在哪个位置与名字
```

### 4)、加载镜像

任何装 docker 的地方加载镜像保存文件,使其恢复为一个镜像

```
docker load -i 镜像保存文件位置
```

### 5)、启动或重启所有镜像

```
docker start/restart $(docker ps -a | awk '{ print $1}' | tail -n +2)
```
