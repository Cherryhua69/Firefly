---
title: "OpenClaw安装教程"
published: 2026-06-29
description: "1、windows下安装openclaw 不推荐 1.1 安装nodejs 官方下载地址:https://nodejs.org/zh cn/download 根据环境执行安装程序 1.2 开始安装openclaw 1.2.1 设置 PowerShell 执行权限 以管理员身份运行"
image: ""
tags: []
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 1、windows下安装openclaw(不推荐)

## 1.1 安装nodejs

官方下载地址:[https://nodejs.org/zh-cn/download](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2Fdownload&objectId=2626160&objectType=1&contentType=undefined)

根据环境执行安装程序

## 1.2 开始安装openclaw

### 1.2.1 **设置 PowerShell 执行权限**

以管理员身份运行 PowerShell:

1. 按 `Win` 键,搜索 **PowerShell**
2. 右键点击 **Windows PowerShell**
3. 选择 **以管理员身份运行**
4. 点击 **是** 确认

在管理员 PowerShell 窗口中,依次执行以下两条命令:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

**(按全是)**

**这是什么意思?**

- 第一条命令:允许当前用户运行本地和下载的脚本
- 第二条命令:允许当前用户运行本地和下载的脚本

### 1.2.2 **执行一键安装命令**

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**安装过程会自动完成:**

- 检测系统环境
- 安装必要依赖(Node.js 等)
- 下载 OpenClaw 核心文件
- 配置环境变量
- 启动配置向导

注意:如果命令执行后,还是报错,可以自己到官网下载node安装包,自己安装node环境,注意版本最好在 node v22.x 以上,node官网下载地址:[https://nodejs.org/zh-cn/download](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2Fdownload&objectId=2626160&objectType=1&contentType=undefined),若还是不懂怎么安装,点头像进我主页找到我,拉你进交流群

## 1.3 **初始配置向导**

根据自己的需求配置即可

## 1.4 参考链接

[https://cloud.tencent.com/developer/article/2626160](https://cloud.tencent.com/developer/article/2626160)

# 2、WSL下安装openclaw(推荐)

## 2.1在Windows上安装wsl

1.启动配置:

启用适用于 Linux 的 Windows 子系统:打开powershell并输入:

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

> 图片附件缺失：image 16.png（image.png）

2.检查WSL2的要求:win+R打开运行,然后输入winver检查windows版本

3. 此版本需要大于1903

> 图片附件缺失：image 17.png（image.png）

4. 启用虚拟化:以管理员打开powershell输入下列命令

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

> 图片附件缺失：image 18.png（image.png）

5.安装

```powershell
wsl --status
wsl --version
# 设置WSL默认版本
wsl --set-default-version 2

# 查询 WSL 可支持的系统列表(安装找得到的系统)
wsl --list --online

# 安装 Ubuntu 系统或者(wsl --install Ubuntu-22.04)
wsl --install Ubuntu

### 注意:有些电脑要在微软商店直接下载Ubuntu
```

## 2.2给配置wsl相关内容

### 2.2.1**配置镜像网络模式**

1. **创建配置文件:** 在 Windows 文件资源管理器中导航至 `C:\Users\<你的用户名>\`。若不存在 `.wslconfig` 文件,则新建一个(注意文件名以 `.` 开头)。
2. **编辑配置:** 用记事本打开该文件,填入以下内容:

```
[wsl2]
# 启用镜像网络模式
networkingMode=mirrored
# 启用 DNS 隧道,避免 VPN 环境下的 DNS 解析问题
dnsTunneling=true
# 自动使用 Windows 的 HTTP 代理设置
autoProxy=true
# 启用防火墙集成
firewall=true

[experimental]
# 自动回收闲置内存
autoMemoryReclaim=gradual
# 允许从 WSL 访问 localhost 等回环地址
hostAddressLoopback=true
```

**应用配置与验证:** 保存文件后,在 PowerShell 中执行以下命令关闭 WSL:

```powershell
wsl --shutdown
```

### 2.2.2**配置防火墙规则(示例)**

若需要在 WSL 中运行服务并开放特定端口(例如 OpenClaw 使用的 `18789` 端口),可在 Windows PowerShell(管理员)中创建入站规则:

```powershell
# 创建入站规则,允许指定端口
New-NetFirewallRule -DisplayName "OpenClaw-Service" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 18789

# 查看已创建的规则
Get-NetFirewallRule -DisplayName "OpenClaw-Service" | Format-Table
```

## 2.3wsl内部**安装基础组件和openclaw的环境**

1.安装基础工具

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git unzip zip ca-certificates jq
```

2.**安装nvm**

```
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
# 保存全局设置
source ~/.bashrc
# 检查
nvm --version
```

3.**安装 Node**

```bash
nvm install 22
nvm use 22
# 检查
node --version
```

## 2.4安装openclaw

```bash
# 安装
npm install -g openclaw@latest
# 检查版本:
openclaw --version
# 初始化
openclaw onboard --install-daemon
```

然后按需求配置openclaw的初始化配置相关内容

## 2.5参考链接

- [https://zhuanlan.zhihu.com/p/386590591](https://zhuanlan.zhihu.com/p/386590591)
- [https://zhuanlan.zhihu.com/p/2008182925712183676](https://zhuanlan.zhihu.com/p/2008182925712183676)
- [https://damodev.csdn.net/69b1295c0a2f6a37c5969993.html#devmenu6](https://damodev.csdn.net/69b1295c0a2f6a37c5969993.html#devmenu6)
- 配置飞书:[https://cloud.tencent.com/developer/article/2626160](https://cloud.tencent.com/developer/article/2626160)
- clawhub安装配置:[https://docs.openclaw.ai/zh-CN/tools/clawhub](https://docs.openclaw.ai/zh-CN/tools/clawhub)
