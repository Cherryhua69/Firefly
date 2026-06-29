---
title: "Ubuntu22 04配置Go环境"
published: 2026-06-29
description: "1、手动配置安装go 1、下载压缩包,到官网找到下载地址All releases The Go Programming Language 2、解压 3、移动和配置环境变量 4、参考链接 https://blog.csdn.net/guo zhen qian/article/det"
image: ""
tags: ["Linux"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、手动配置安装go

## 1、下载压缩包,到官网找到下载地址[All releases - The Go Programming Language](https://golang.google.cn/dl/)

```bash
wget https://golang.google.cn/dl/go1.21.4.linux-amd64.tar.gz
```

## 2、解压

```bash
tar -xvf go1.21.4.linux-amd64.tar.gz
```

## 3、移动和配置环境变量

```bash
#移动
mv go /usr/local

# 打开环境变量配置文件
vi ~/.bashrc

# 粘贴以下内容
export GOROOT=/usr/local/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH

# 建议再增加以下两项配置
# 1.13之后的版本都是用mod了,所以gopath指定个地方就可以了,三方依赖会下载到那里
export GOPATH=/go
# 配置国内镜像,下载依赖速度会很快
export GOPROXY=https://mirrors.aliyun.com/goproxy/,direct

# 保存关闭后刷新一下即可
source ~/.bashrc

# 建议打开gomod开关
go env -w GO111MODULE=on

# 查看安装成功的版本
go version
```

## 4、参考链接

[https://blog.csdn.net/guo_zhen_qian/article/details/134319002](https://blog.csdn.net/guo_zhen_qian/article/details/134319002)

# 2、报错及其解决

# 1、**(sudo: go: command not found)找不到指令或没有权限**

修改配置文件

```bash
sudo vim /etc/sudoers

#修改以下行,加入/usr/local/go/bin/,用冒号隔开
Defaults    secure_path = /sbin:/bin:/usr/sbin:/usr/bin
#修改后
Defaults    secure_path = /usr/local/go/bin/:/sbin:/bin:/usr/sbin:/usr/bin
```

然后终端cd到你要运行的文件目录下,用chmod给文件权限,再运行就可以了

```bash
sudo chmod u+x run.sh

sudo ./run.sh
```

## 2、参考链接

[https://blog.csdn.net/qq_42503717/article/details/122183205](https://blog.csdn.net/qq_42503717/article/details/122183205)
