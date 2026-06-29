---
title: "MySQL数据库在Linux下安装"
published: 2026-06-29
description: "MySQL数据库安装 1、首先准备安装包 这里下载的是 mysql 5.7.30 linux glibc2.12 x86 64.tar.gz 安装包,并将其直接放在了root目录下 2、卸载系统自带MARIADB 如果有 如果系统之前自带 Mariadb ,可以先卸载之。 首先查"
image: ""
tags: ["Linux", "MySQL"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# MySQL数据库安装

### 1、首先准备安装包

这里下载的是 mysql-5.7.30-linux-glibc2.12-x86_64.tar.gz 安装包,并将其直接放在了root目录下

### 2、卸载系统自带MARIADB(如果有)

如果系统之前自带 Mariadb ,可以先卸载之。

首先查询已安装的 Mariadb 安装包:

```
rpm -qa|grep mariadb
```

将其均卸载之:

```
yum -y remove mariadb-server-5.5.56-2.el7.x86_64
yum -y remove mariadb-5.5.56-2.el7.x86_64
yum -y remove mariadb-devel-5.5.56-2.el7.x86_64
yum -y remove mariadb-libs-5.5.56-2.el7.x86_64
```

### 3、解压MYSQL安装包

将上面准备好的 MySQL 安装包解压到 /usr/local/ 目录,并重命名为 mysql

```
tar -zxvf /root/mysql-5.7.30-linux-glibc2.12-x86_64.tar.gz -C
/usr/local/
mv mysql-5.7.30-linux-glibc2.12-x86_64 mysql
```

### 4、创建MYSQL用户和用户组

```
groupadd mysql
useradd -g mysql mysql
```

同时新建 /usr/local/mysql/data 目录,后续备用

### 5、修改MYSQL目录的归属用户(权限修改)

```
chown -R mysql:mysql ./
```

### 6、准备MYSQL的配置文件

在 /etc 目录下新建 my.cnf 文件

写入如下简化配置:

```
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
socket=/var/lib/mysql/mysql.sock
[mysqld]
skip-name-resolve
#设置3306端口
port = 3306
socket=/var/lib/mysql/mysql.sock
# 设置mysql的安装目录
basedir=/usr/local/mysql
# 设置mysql数据库的数据的存放目录
datadir=/usr/local/mysql/data
# 允许最大连接数
max_connections=200
# 服务端使用的字符集默认为8比特编码的latin1字符集
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
lower_case_table_names=1
max_allowed_packet=16M
```

同时使用如下命令创建 /var/lib/mysql 目录,并修改权限:

```
mkdir /var/lib/mysql
chmod 777 /var/lib/mysql
```

### 7、正式开始安装MYSQL

执行如下命令正式开始安装:

```
cd /usr/local/mysql
./bin/mysqld --initialize --user=mysql --basedir=/usr/local/mysql --
datadir=/usr/local/mysql/data
```

遇到的问题:提示失败安装解决
./bin/mysqld: error while loading shared libraries: libaio.so.1: cannot open shared object file: No such file or directory

解决:sudo apt install -y libaio1

**注意:记住上面打印出来的 root 的密码,后面首次登陆需要使用**

### 8、复制启动脚本到资源目录

执行如下命令复制:

```
[root@localhost mysql]# cp ./support-files/mysql.server
/etc/init.d/mysqld
```

并修改 /etc/init.d/mysqld ,修改其 basedir 和 datadir 为实际对应目录:

```
basedir=/usr/local/mysql
datadir=/usr/local/mysql/data
```

### 9、设置MYSQL系统服务并开启自启

1.1:centos等系统下设置

首先增加 mysqld 服务控制脚本执行权限:

```
chmod +x /etc/init.d/mysqld
```

同时将 mysqld 服务加入到系统服务:

```
chkconfig --add mysqld
```

最后检查 mysqld 服务是否已经生效即可:

```
chkconfig --list mysqld
```

这样就表明 mysqld 服务已经生效了,在2、3、4、5运行级别随系统启动而自动启动,以后可以直接使用 service 命令控制 mysql 的启停。

2.2:ubuntu系统下设置开机自启动

参考链接:[https://blog.csdn.net/DT_FlagshipStore/article/details/131312452](https://blog.csdn.net/DT_FlagshipStore/article/details/131312452)

```bash
cd /etc/systemd/system

touch mysql.service

sudo chmod +x mysql.service

sudo vi mysql.service
```

将以下内容粘贴到mysql.service文件中(要根据自己的配置情况修改!!!!):

```bash
plaintext

[Unit]
Description=MySQL Server
Documentation=https://dev.mysql.com/doc/refman/5.7/en/

[Service]
ExecStart=/usr/local/mysql/bin/mysqld --defaults-file=/etc/my.cnf
User=mysql
Group=mysql
Restart=always
RestartSec=3
LimitNOFILE=infinity

[Install]
WantedBy=multi-user.target
```

### 10、启动MYSQLD

**1.1:ubuntu**

```bash
# 重新加载Systemd管理器配置
systemctl daemon-reload
#启动MySQL服务
systemctl start mysql
#设置开机自启动MySQL服务
systemctl enable mysql
# 查看MySQL服务运行状态
systemctl status mysql
```

**1.2:centos**

```
service mysqld start
```

### 11、将 MYSQL 的 BIN 目录加入 PATH 环境变量

这样方便以后在任意目录上都可以使用 mysql 提供的命令。

编辑 `~/.bashrc` 文件,在文件末尾处追加如下信息:

```
export PATH=$PATH:/usr/local/mysql/bin
```

最后执行如下命令使环境变量生效

```
source ~/.bashrc
```

以 root 账户登录 mysql ,使用上文安装完成提示的密码进行登入

```
mysql -u root -p
```

### 12、接下来修改ROOT账户密码

在mysql的命令行执行如下命令即可,密码可以换成你想用的密码即可:

```
mysql>alter user user() identified by "111111";
mysql>flush privileges;
```

比如这里将密码设置成简单的“111111”了。

### 13、设置远程主机登录

```
mysql> use mysql;
mysql> update user set user.Host='%' where user.User='root';
mysql> flush privileges;
```

最后用Navicat或其他MySQL连接工具测试即可,验证安装成功!
