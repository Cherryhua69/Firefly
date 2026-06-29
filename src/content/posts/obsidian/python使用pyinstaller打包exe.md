---
title: "Python使用pyinstaller打包exe"
published: 2026-06-29
description: "1、在自己的python环境下安装依赖 2、打包命令 参数解释: 1. w 全称 windowed ,表示生成 无控制台窗口 的 GUI 程序。适用于 PyQt、Tkinter 等图形界面程序,避免运行时弹出黑色控制台窗口。 2. onefile 生成 单文件可执行程序 所有依赖"
image: ""
tags: ["Python"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1、在自己的python环境下安装依赖

```bash
pip install pyinstaller

#验证安装
pyinstaller --version
```

# 2、打包命令

```bash
pyinstaller -w --onefile --name "Exe_program" --icon "exe.ico" --add-data "exe.ico;." --hidden-import=paramiko --hidden-import=paramiko.ssh_exception --hidden-import=paramiko.ssh_gss --hidden-import=PyQt5.QtWidgets --hidden-import=PyQt5.QtCore --hidden-import=PyQt5.QtGui --hidden-import=concurrent.futures main.py

```

参数解释:

1. **`w`**全称 `-windowed`,表示生成 **无控制台窗口** 的 GUI 程序。适用于 PyQt、Tkinter 等图形界面程序,避免运行时弹出黑色控制台窗口。
2. **`-onefile`**生成 **单文件可执行程序**(所有依赖打包到一个 `.exe` 文件中)。优点:分发方便;缺点:启动速度略慢,临时解压会占用一定磁盘空间。
3. **`-name "Exe_program"`**指定生成的可执行文件名称(默认是脚本名)。最终会生成 `Luban_Ai_Box.exe`(Windows 系统)。
4. **`-icon "exe.ico"`**设置程序的图标文件(`.ico` 格式)。图标会显示在可执行文件、任务栏、窗口标题栏等位置。
5. **`-add-data "exe.ico;."`**

    (如图标、配置文件等)。

    - 语法:`源文件路径;目标路径`(Windows 用 `;` 分隔,Linux/macOS 用 `:` 分隔)。
    - 这里表示将当前目录的 `exe.ico` 打包,并在程序运行时解压到临时目录的根目录(`.` 表示当前工作目录)。
    - 程序中需用 `sys._MEIPASS` 路径访问该文件(单文件模式下的临时解压目录)
6. **`-hidden-import=paramiko` 及相关子模块**`paramiko` 是用于 SSH 通信的库,其部分子模块(如 `ssh_exception`、`ssh_gss`)可能因动态导入被 PyInstaller 忽略,需手动指定。
7. **`-hidden-import=PyQt5.QtWidgets` 等**PyQt5 的部分组件可能因按需导入被遗漏,显式指定确保 GUI 组件能正常打包。
8. **`-hidden-import=concurrent.futures`**Python 标准库中用于并发编程的模块,若程序中动态使用了该模块,需手动声明。
9. **`main.py`**指定要打包的 **主 Python 脚本路径**(程序的入口文件)。

根据具体需求更改
