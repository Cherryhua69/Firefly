---
title: "VScode实现本地与远端同步开发"
published: 2026-06-29
description: "1、 在VScode中安装SFTP插件 直接在扩展程序处搜索\"SFTP\",安装这个插件 2、 用VScode打开你想要同步的那份代码所在的文件夹 3、 Ctrl+shift+P唤醒VScode命令行,输入SFTP:config,点击这个 vscode会自动在当前文件夹 src 下"
image: ""
tags: ["工具"]
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 1、**在VScode中安装[SFTP](https://so.csdn.net/so/search?q=SFTP&spm=1001.2101.3001.7020)插件**

直接在扩展程序处搜索"SFTP",安装这个插件

# 2、**用VScode打开你想要同步的那份代码所在的文件夹**

# 3、**Ctrl+shift+P唤醒VScode命令行,输入SFTP:config,点击这个**

 vscode会自动在当前文件夹(src)下创建一个.vscode文件夹,里面有一个sftp.json文件,其内容为:

```bash
{
    "name": "MyServer",
    "host": "your default host",
    "protocol": "sftp",
    "port": 22,
    "username": "xxx",
    "remotePath": "your default remote path",
    "privateKeyPath": "~/.ssh/id_rsa",
    "uploadOnSave": false,
    "useTempFile": false,
    "openSsh": false,
    "ignore": [
        "**/.git/**",
        "**/checkpoints/**",
        "**/.vscode/**",
        "**/__pycache__/**",
        "**/output/**",
        "**/wandb/**",
        "**/reorder/**",
        "**/*.zip",
        "**/*.docx"
    ],
    "profiles": {
        "Server1": {
          "name": "Server1",
          "host": "aaa",
          "username": "aaa",
          "remotePath": "aaa"
        },
        "Server2": {
          "name": "Server1",
          "host": "bbb",
          "username": "bbb",
          "remotePath": "bbb"
        }
      }
}
```

参数解释:

name: 你为这个sftp的连接起一个命名
host:目标主机IP地址,需自己查看并填写(先确保远端开启了sftp服务)
protocol:传输协议,sftp,不需要改动
port:传输端口,默认22,不需要改动
username:登录的用户名,需自己确认
password:若不想每次登录输入密码,可以增加此字段,硬编码进去
privateKeyPath:本地私钥,与password选用一个就好
remotePath:远端同步的路径
uploadOnSave:当你按下 ctrl + s 时,自动同步代码到远端服务器
ignore:不需要同步的目录or文件, 其中*** 表示所有目录, ***/.git 表示所有目录下的.git文件都不进行同步

profiles配置了2个服务器,等后面你要同步的时候你可以自己挑选使用哪个服务器

填入相应内容,保存。

上面的选项里的“uploadOnSave”:表示每当你保存时就会自动将本地代码同步到服务器端。如果是false,就需要手动进行同步操作

tips:这里有一个非常值得注意的点,就是remotePath要填入远程服务器端要同步你的代码的地址,

remotePath填写的路径是:/home/zht/ZPN_zht/src

那么在服务器端的 /home/zht/ZPN_zht/src  处同步这个代码

# **4、选择服务器**

可以用 CTRL + SHIFT + P 调出命令窗口,选择“Set profile”, 就能选择你现在要连接到哪个服务器。

选择完服务器之后,再进行下面的同步操作。

# **5、同步**

可以用 CTRL + SHIFT + P 调出命令窗口,选择同步

也可以点击左侧“SFTP”插件的按钮,右击这个MyServer文件件,将当前文件夹上传到指定远程目录下。

在本地端进行代码修改,Ctrl+S保存,自动同步到服务器端

手动进行同步操作

在src文件夹中的空白处右击,点击“Sync Local -> Remote”

点击左侧最下方的那个STFP的按钮,可以查看服务器端的文件情况(此时是只读的模式,不能对服务器端的代码进行修改)

# 6、参考链接

[https://blog.csdn.net/zht2002/article/details/130349227](https://blog.csdn.net/zht2002/article/details/130349227)
