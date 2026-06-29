---
title: "Linux安装使用Jupyter"
published: 2026-06-29
description: "1、环境准备 安装好Python、pip、conda等环境 2、pip直接安装对应包 3、生成jupyter配置文件 4、进入ipython环境 5、设置jupyter配置文件 6、给文件夹授权 7、启动 设置jupyter进程始终挂载"
image: ""
tags: ["Linux", "Python"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、环境准备

安装好Python、pip、conda等环境

# 2、pip直接安装对应包

```bash
pip install jupyter
```

# 3、生成jupyter配置文件

```bash
jupyter notebook --generate-config
#选项选"Y"
```

# 4、进入ipython环境

```python
$ ipython
>>> from notebook.auth import passwd
>>> passwd()   # 注意记住密钥:'sha1:4b2678fa7669:037692fc089b07c56f10b5b'
>>> exit()
```

# 5、设置jupyter配置文件

```bash
# 进入配置文件修改配置
$ vim /root/.jupyter/jupyter_notebook_config.py

# 在配置文件最后面增加
c.NotebookApp.allow_remote_access = True #允许远程连接
c.NotebookApp.ip='*'                     # 设置所有ip皆可访问
c.NotebookApp.password = 'sha1:4b2678fa7669:037692fc089b07c56f10b5b'     # 上面复制的那个密钥'
c.NotebookApp.open_browser = False       # 禁止自动打开浏览器
c.NotebookApp.port = 8899                 # 设置打开端口
c.NotebookApp.notebook_dir = '/home/hadoop/'  #设置Notebook启动进入的目录(自己想放的文件位置)
```

# 6、给文件夹授权

```bash
# 后面写你之前配置文件写的dir
chmod  777 /home/hadoop/
```

# 7、启动(设置jupyter进程始终挂载)

```bash
# 服务器端口对外开放,才能远程访问
$ nohup jupyter notebook --allow-root&
```
