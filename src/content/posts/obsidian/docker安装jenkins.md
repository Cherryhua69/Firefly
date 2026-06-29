---
title: "Docker安装Jenkins"
published: 2026-06-29
description: "1.启动docker,下载Jenkins镜像文件 2.创建Jenkins挂载目录并授权权限 3.启动容器,同时映射宿主机和容器内端口 4.查看容器是否启动成功 5.查看docker容器日志 6.端口添加到防火墙 没开防火墙的省略 7. 配置镜像加速 打开宿主机 Jenkins 工"
image: ""
tags: ["Docker"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1.启动docker,下载Jenkins镜像文件

```bash
docker pull jenkins/jenkins
```

# 2.创建Jenkins挂载目录并授权权限

```bash
mkdir -p /usr/local/jenkins
chmod 777 /usr/local/jenkins
```

# 3.启动容器,同时映射宿主机和容器内端口

```bash
# -d 后台方式启动
# -p 映射端口,宿主机端口:容器内端口
# -v 挂载卷,将容器Jenkins工作目录/var/jenkins_home挂载到宿主机目录/usr/local/jenkins
# -name 给容器起个别名
docker run -d -p 8099:8080 -p 50099:50000 -v /usr/local/jenkins:/var/jenkins_home --name myjenkins jenkins/jenkins
```

# 4.查看容器是否启动成功

```bash
docker ps
```

# 5.查看docker容器日志

```bash
docker logs myjenkins
```

# 6.端口添加到防火墙(没开防火墙的省略)

```bash
firewall-cmd --zone=public --add-port=8099/tcp --permanent
systemctl restart firewalld
firewall-cmd --zone=public --list-ports
```

# 7.**配置镜像加速**

打开宿主机 Jenkins 工作目录下的`hudson.model.UpdateCenter.xml`文件

```bash
vim /usr/local/jenkins/hudson.model.UpdateCenter.xml
```

原始内容如下:

```bash
<?xml version='1.1' encoding='UTF-8'?>
<sites>
  <site>
    <id>default</id>
    <url>https://updates.jenkins.io/update-center.json</url>
  </site>
</sites>
```

url 修改为国内的清华大学官方镜像地址,最终内容如下:

```bash
<?xml version='1.1' encoding='UTF-8'?>
<sites>
  <site>
    <id>default</id>
    <url>https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json</url>
  </site>
</sites>
```

重启Jenkins服务

```bash
docker stop 容器ID
docker start 容器ID
```

# 8.登录初始化访问Jenkins,输入你的ip加上8099

可以查看宿主机`/usr/local/jenkins/secrets/initialAdminPassword`文件获取密码

```bash
cat /usr/local/jenkins/secrets/initialAdminPassword
```

然后再访问页面输入获取到的密码

就可以成功访问了!!!!
