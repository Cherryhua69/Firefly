---
title: "Anaconda常用操作"
published: 2026-06-29
description: "1、升级 2、conda环境使用基本命令 3、conda更新卸载安装包 4、conda安装本地包 5、修改镜像源 6、conda自动开启/关闭激活"
image: ""
tags: ["Python"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1、升级

```bash
conda update conda          #基本升级
conda update anaconda       #大的升级
conda update anaconda-navigator    //update最新版本的anaconda-navigator
```

# 2、conda环境使用基本命令

```bash
conda update -n base conda        #update最新版本的conda
conda create -n xxxx python=3.7   #创建python3.7的xxxx虚拟环境
conda activate xxxx               #开启xxxx环境
conda deactivate                  #关闭环境
conda env list                    #显示所有的虚拟环境
conda info --envs                 #显示所有的虚拟环境
conda create --name newname --clone oldname      #克隆环境
conda remove --name oldname --all      #彻底删除旧环境
conda install tensorflow=1.8.0        #安装特定版本的包
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple jupyterthemes         			#清华源下载更快
conda install nb_conda          #安装后便可以在jupyter选择环境
```

# 3、conda更新卸载安装包

```bash
conda list         #查看已经安装的文件包
conda list  -n xxx       #指定查看xxx虚拟环境下安装的package
conda update xxx   #更新xxx文件包
conda uninstall xxx   #卸载xxx文件包
```

# 4、conda安装本地包

```bash
#pip 安装本地包
pip install   ~/Downloads/a.whl
#conda 安装本地包
conda install --use-local  ~/Downloads/a.tar.bz2
```

# 5、修改镜像源

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --set show_channel_urls yes`

# 然后在.condarc修改内容如下,亲测有效:

channels:
  - defaults
show_channel_urls: true
channel_alias: https://mirrors.tuna.tsinghua.edu.cn/anaconda
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/pro
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  msys2: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  bioconda: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  menpo: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  simpleitk: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
ssl_verify: true
```

# 6、conda自动开启/关闭激活

```bash
conda activate   #默认激活base环境
conda activate xxx  #激活xxx环境
conda deactivate #关闭当前环境
conda config --set auto_activate_base false  #关闭自动激活状态
conda config --set auto_activate_base true  #关闭自动激活状态
```
