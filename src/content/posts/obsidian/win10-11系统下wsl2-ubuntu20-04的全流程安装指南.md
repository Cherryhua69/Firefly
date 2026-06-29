---
title: "Win10 11系统下WSL2+Ubuntu20 04的全流程安装指南"
published: 2026-06-29
description: "前言 WSL2 Windows Subsystem for Linux 2 是 Windows 提供的一种轻量级 Linux 运行环境,具备完整的 Linux 内核,并支持更好的文件系统性能和兼容性。它允许用户在 Windows 系统中运行 Linux 命令行工具和应用程序,而无"
image: ""
tags: ["Linux", "Windows"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 前言

WSL2(Windows Subsystem for Linux 2)是 Windows 提供的一种轻量级 Linux 运行环境,具备完整的 Linux 内核,并支持更好的文件系统性能和兼容性。它允许用户在 Windows 系统中运行 Linux 命令行工具和应用程序,而无需安装虚拟机或双系统。

本教程将介绍 如何安装 WSL2 并将 Ubuntu-20.04 安装到 D 盘,涵盖 WSL2 的启用、Ubuntu 的下载与解压、WSL2 发行版的导入,以及普通用户的设置与安装验证。这是全网最全的 WSL2 安装与配置指南,参考了大量博客教程,并结合实践经验,整理出最实用、最详细的方法,适用于所有 Windows 10/11 用户

# 1、安装WSL2

### **方法一:PowerShell 命令行快速安装 WSL2(推荐)**

### **1. 启用 Windows 子系统(WSL)功能**

在 PowerShell(管理员模式)中运行:

```bash
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

**解释:**

- `/all`:在所有用户上启用该功能
- `/norestart`:启用功能后不会立即重启

### **2. 启用虚拟机平台功能**

WSL2 依赖 Windows 虚拟机功能,需要额外启用:

```bash
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

**3. 将 WSL 默认版本设置为 WSL2(视情况而定)**

```bash
wsl --set-default-version 2
```

### **4. 重启电脑**

以上命令执行完成后,请重启电脑,以确保所有更改生效。

# 2、**WSL2 安装 Ubuntu-20.04 至 D盘 (方法一 | 推荐)**

**1. 创建文件夹**
• `D盘` 创建 **WSL** 文件夹,并在该文件夹下创建 **Ubuntu-20.04** 文件夹。

**2. 下载并导出 Ubuntu-20.04**
首先,查看可用的 WSL 发行版:

```bash
wsl --list --online
```

安装 **Ubuntu-20.04** :

```bash
wsl --install -d Ubuntu-20.04
```

安装完毕后会要求你创建一个新用户,按照提示输入用户名和密码即可,然后按 `Ctrl + D` 退出即可。

导出 **Ubuntu-20.04** 为 `.tar` 文件

```bash
wsl --export Ubuntu-20.04 D:\WSL\Ubuntu-20.04\Ubuntu-20.04.tar
```

这会下载 Ubuntu-20.04 并将其导出到 `D:\WSL\Ubuntu-20.04\Ubuntu-20.04.tar`,然后可以执行`ls D:\WSL\Ubuntu-20.04`查看`Ubuntu-20.04.tar`已经成功导出。

取消注册原有的 Ubuntu-20.04,如果你已经安装了 Ubuntu-20.04(默认在 `C` 盘),可以将其从 WSL 注销:

```bash
wsl --unregister Ubuntu-20.04
```

**3. 导入 Ubuntu-20.04 到 D 盘**
运行以下命令,将 Ubuntu-20.04 重新导入到 `D:\WSL\Ubuntu-20.04`:

```bash
wsl --import Ubuntu-20.04 D:\WSL\Ubuntu-20.04 D:\WSL\Ubuntu-20.04\Ubuntu-20.04.tar --version 2
```

这将会把 `Ubuntu-20.04` 安装到 `D` 盘,而不是默认的 `C` 盘,如图所示正在安装。

** 遇到的问题:

C:\Windows\system32> wsl --import Ubuntu-20.04 F:\wsl\Ubuntu-20.04 F:\wsl\Ubuntu-20.04\Ubuntu-20.04.tar --version 2
WSL 2 需要更新其内核组件。有关信息,请访问 [https://aka.ms/wsl2kernel](https://aka.ms/wsl2kernel)

** 解决:

**访问 [https://aka.ms/wsl2kernel](https://aka.ms/wsl2kernel),步骤 4 - 下载 Linux 内核更新包**

> 图片附件缺失：image 8.png（image.png）

下载安装适合你电脑环境的更新包

在 `D:\WSL\Ubuntu-20.04` 目录下,WSL2 发行版的文件存储在一个 **虚拟磁盘映像文件(ext4.vhdx)** 中,该文件用于存储整个 Ubuntu-20.04 文件系统,如下图所示:

**4. 启动 Ubuntu-20.04**

导入完成后,你可以启动 WSL:

```bash
wsl -d Ubuntu-20.04
```

但此时,你会发现默认以 `root` 用户登录,因为 WSL 手动导入的 Ubuntu 不会自动创建普通用户,需要我们手动创建。

创建新用户,在 WSL 终端(默认 `root`)下运行:

(请把 `yourusername` 替换为你想使用的用户名)

```bash
adduser yourusername

#系统会要求你输入:

#新密码
#用户信息(全部可以直接回车跳过)
```

赋予新用户 `sudo` 权限

```bash
usermod -aG sudo yourusername
```

这样,新用户就可以使用 `sudo` 进行管理员操作。

**5. 修改默认登录用户为普通用户(可选)**
以管理员身份运行`PowerShell`,执行命令:

```bash
ubuntu2004 config --default-user yourusername
```

再次启动 WSL:

```bash
wsl -d Ubuntu-20.04
```

此时,你会发现默认以普通用户登录:
