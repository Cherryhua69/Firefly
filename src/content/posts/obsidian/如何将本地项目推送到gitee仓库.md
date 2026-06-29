---
title: "如何将本地项目推送到gitee仓库"
published: 2026-06-29
description: "有时候我们在本地开发了一个项目,想推送到gitee仓库管理,有两种方式 一,新建gitee空仓库,然后git clone到本地,然后把代码复制进去提交 1.在gitee创建一个仓库,然后git clone 新建的仓库地址,到本地 2.把项目代码复制到clone下来的仓库 3.gi"
image: ""
tags: ["工具"]
category: "技术笔记"
draft: false
lang: "zh-CN"
---

有时候我们在本地开发了一个项目,想推送到[gitee](https://so.csdn.net/so/search?q=gitee&spm=1001.2101.3001.7020)仓库管理,有两种方式

# 一,新建gitee空仓库,然后git clone到本地,然后把代码复制进去提交

1.在gitee创建一个仓库,然后git clone 新建的仓库地址,到本地

2.把项目代码复制到clone下来的仓库

3.git add 提交代码

# 二.新建gitee空仓库,然后在本地项目git init初始化项目,然后推送到空项目

1.cd项目,执行git init,初始化本地仓库

2.给本地仓库关联远程仓库

```
$ git remote add origin https://gitee.com/用户个性地址/HelloGitee.git
```

3.先更新本地仓库,

```
$ git pull origin master
```

4.推送本地仓库代码到远程仓库

```
$ git add .
$ git commit -m "第一次提交"
$ git push origin master
```

# 三、可能出现的错误

## 出现“warning: LF will be replaced by CRLF”的提示

修改 git 設定

```
$git config –-global core.autocrlf
# 輸入該指令查看是 false 還是 true
$git config –-global core.autocrlf false
# 這裡的意思是關閉自動轉換成crlf
```
