---
title: "如何升级Jenkins版本（Docker版）"
published: 2026-06-29
description: "1、打开安装好的旧版本Jenkins 找到右上角的铃铛,点击下载最新的war包 Jenkins各版本下载地址 https://mirrors.tuna.tsinghua.edu.cn/jenkins/war stable/ 2、将下载好的jenkins.war包上传到服务器 3、"
image: ""
tags: ["Docker"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、打开安装好的旧版本Jenkins

找到右上角的铃铛,点击下载最新的war包

### **Jenkins各版本下载地址**

[https://mirrors.tuna.tsinghua.edu.cn/jenkins/war-stable/](https://mirrors.tuna.tsinghua.edu.cn/jenkins/war-stable/)

# 2、将下载好的jenkins.war包上传到服务器

# 3、进入Docker容器

```bash
docker exec -it -u root jenkins(你的容器名字或id) /bin/bash
```

# 4、找到jenkins原来的位置

```bash
whereis jenkins
```

默认路径为/usr/share/jenkins,具体自己进入容器找找

# 5、替换掉旧版本的war包

```bash
# 找到容器中旧版本的war位置之后退出容器
exit

# 随后执行替换命令
docker cp /root/jenkins.war jenkins:/usr/share/jenkins/
```

# 6、重新启动容器

```bash
docker restart jenkins
```

最后成功打开进入新版本的Jenkins!!!
