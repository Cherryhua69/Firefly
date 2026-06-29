---
title: "Python项目打包成Docker镜像"
published: 2026-06-29
description: "1、在项目根路径下编写Dockerfile文件 2、编写需要的docker compose.yaml文件 其它详细参数参考网站:https://zhuanlan.zhihu.com/p/387840381 3、执行docker打包命令生成容器 4、根据需要运行容器即可"
image: ""
tags: ["Docker", "Python"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、在项目根路径下编写Dockerfile文件

```docker
#基于的基础镜像或者FROM python:3.10.11-slim-buster
FROM python:3.10.11-slim-stretch
#代码添加到code文件夹
ADD . /code
# 设置code文件夹是工作目录
WORKDIR /code
# 安装支持
RUN pip install -r requirements.txt -i https://pypi.douban.com/simple/
# 授权
CMD [ "chmod","777","test.py" ]
# 运行
CMD [ "python", "./test.py" ]
```

# 2、编写需要的docker-compose.yaml文件

```docker
version: "1.0.0"
services:
  # xxxx容器,用户自定义,如: myContainer
  test:
    # 镜像名称,如: ai/faas/app/myImage:1.0.0
    image: ai/faas/app/test:1.0.0
    # 容器名称,用户自定义,如: myContainer
    container_name: test
    network_mode: "host"
    ports:
      # 端口
      - 51002:51002
    volumes:
      # 可映射目录
      - /etc/localtime/data:/app/data
      # 说明: name: 容器名称,如: myContainer
      #       xxxx: 容器内部目录,用户自定义
    # 容器启动命令,用户自定义
    command: ["python","./test.py"]
    # 工作目录,用户自定义
    working_dir: /app
```

其它详细参数参考网站:[https://zhuanlan.zhihu.com/p/387840381](https://zhuanlan.zhihu.com/p/387840381)

# 3、执行docker打包命令生成容器

```bash
# 打包前给程序里面的所有组成部分授权(chmod 777 *)
docker build -t [容器名称]:[容器版本] .
# 压缩成.tar
# docker save -o 名称.tar 生成好的容器名称
```

# 4、根据需要运行容器即可
