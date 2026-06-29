---
title: "Linux系统下卸载安装Nvidia相关内容"
published: 2026-06-29
description: "1、卸载Nvidia驱动 没有驱动则跳过这一步 2、重装驱动 1、下载驱动安装程序 官网查找对应GPU型号的驱动并下载 Nvidia驱动查询网站:https://www.nvidia.cn/drivers/lookup/ 2、 安装显卡驱动 安装过程中的选项: The distr"
image: ""
tags: ["Linux"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# # 1、卸载Nvidia驱动

没有驱动则跳过这一步

```bash
# 卸载驱动
sudo apt-get --purge remove nvidia*
sudo apt autoremove

#移除CUDA Toolkit
sudo apt-get --purge remove "*cublas*" "cuda*"

#移除NVIDIA Drivers
sudo apt-get --purge remove "*nvidia*"
```

# 2、重装驱动

## 1、下载驱动安装程序

官网查找对应GPU型号的驱动并下载

Nvidia驱动查询网站:[https://www.nvidia.cn/drivers/lookup/](https://www.nvidia.cn/drivers/lookup/)

## 2、**安装显卡驱动**

```bash
# 进入到下载好的.run文件夹下给驱动run文件赋予执行权限
sudo chmod  a+x NVIDIA-Linux-x86_64-455.45.01.run

sudo ./NVIDIA-Linux-x86_64-455.45.01.run -no-x-check -no-nouveau-check -no-opengl-files
#只有禁用opengl这样安装才不会出现循环登陆的问题
#-no-x-check:安装驱动时关闭X服务
#-no-nouveau-check:安装驱动时禁用nouveau
#-no-opengl-files:只安装驱动文件,不安装OpenGL文件
```

安装过程中的选项:

The distribution-provided pre-install script failed! Are you sure you want to continue? 选择 yes 继续。
Would you like to register the kernel module souces with DKMS? This will allow DKMS to automatically build a new module, if you install a different kernel later?  选择 No 继续。
问题没记住,选项是:install without signing
问题大概是:Nvidia's 32-bit compatibility libraries? 选择 No 继续。
Would you like to run the nvidia-xconfigutility to automatically update your x configuration so that the NVIDIA x driver will be used when you restart x? Any pre-existing x confile will be backed up.  选择 Yes

```bash
#安装完成之后重启系统
sudo reboot
```

# 3、配置环境变量

打开**~.bashrc**,添加一下内容

```bash
# 填写你对应的安装位置
export PATH="/usr/local/cuda-11.0/bin:$PATH"
export LD_LIBRARY_PATH="/usr/local/cuda-11.0/lib64:$LD_LIBRARY_PATH"
# (这里是默认的安装路径)
```

保存退出后,执行命令 **source ~/.bashrc**

# 4、验证

```bash
nvcc -V
```

# 5、可能遇到的问题

## 1、**“subprocess installed post-installation script returned error exit status 10”报错**

```bash
# dpkg:error processing package XXX (--configure):
# subprocess installed post-installation script returned error exit status 10

# 解决方法如下:
# 根据自己的情况,可以把 r-base-core 改成自己报错的那个包,如果有多个包报错,
# 目前看起来只能不断重复这个过程,来依次解决。
sudo rm /var/lib/dpkg/info/r-base-core*
sudo dpkg --configure -D 777 r-base-core
sudo apt -f install
```

## 2、**安装 NVIDIA 显卡驱动时报错:An NVIDIA kernel module ‘nvidia-drm‘ appears to already be load**

### 1、原因:

- 因为安装的是 Ubuntu图形化版本,之前也安装了 NVIDIA 驱动和 CUDA
- 系统加在图形化界面后,就会自动加载运行 NVIDIA 相关模块(如:nvidia-drm、nvidia-modeset 等)

### 2、解决办法:

- 启动 Ubuntu 系统时不让系统加载图形化界面
- 在终端命令模式下卸载 NVIDIA 驱动,再重装新的驱动

```bash
# 设置系统默认进入终端命令模式,然后重启系统
sudo systemctl set-default multi-user.target
sudo reboot 0

# 待系统重启后,通过其他主机的终端工具 ssh 登录 Ubuntu 系统,
# 依次执行如下三条命令,卸载已安装的 NVIDIA 驱动后重启
sudo apt-get purge nvidia*
sudo apt-get autoremove
sudo reboot

# 再次尝试安装Nvidia驱动
cd NVIDIA驱动安装文件所在的目录
sudo sh ./NVIDIA驱动安装文件.run

# 等待 NVIDIA 驱动安装完成并测试显卡正常识别和运行后,再在终端执行如下两条命令
# (设置系统默认进入图形化界面模式,重启系统)
sudo systemctl set-default graphical.target
sudo reboot 0
```
