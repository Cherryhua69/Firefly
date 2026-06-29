---
title: "Nginx简单使用教程"
published: 2026-06-29
description: "1、找到自己安装的nginx的配置文件所在 这里配置路径示例为:/etc/nginx/sites available/default 2、修改nginx配置文件 示例的内网接口为: 127.0.0.1:8899/interface/demo1 127.0.0.1:8899/int"
image: ""
tags: ["Nginx"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# 1、找到自己安装的nginx的配置文件所在

这里配置路径示例为:/etc/nginx/sites-available/default

# 2、修改nginx配置文件

```bash
vim /etc/nginx/sites-available/default
```

示例的内网接口为:

- 127.0.0.1:8899/interface/demo1
- 127.0.0.1:8899/interface/demo2
- 127.0.0.1:8899/interface/demo3

(PS:外网域名映射到内网需自己查资料实现)

修改配置文件

```bash
server {
	#公网映射监听的端口
	listen 8088 default_server;
	listen [::]:8088 default_server;
	root /var/www/html;

	index index.html index.htm index.nginx-debian.html;
	server_name _;

    	location /v1/user/register {
		deny all;
    		return 403;
    	}

       location /hidden_danger {
            root /etc/nginx/html;
            index index.html;
	}

	location ~ ^/(ai/gangjin/(demo1|demo2|demo3))$ {
            add_header Cache-Control no-cache;
            add_header Cache-Control private;
            expires -1s;
            proxy_cache off;
            proxy_buffering off;
            chunked_transfer_encoding on;
            tcp_nopush on;
            tcp_nodelay on;
            keepalive_timeout 300;
            proxy_pass http://127.0.0.1:8899;
        }

    location / {
		add_header Cache-Control no-cache;
		add_header Cache-Control private;
		expires -1s;
		proxy_cache off;
		proxy_buffering off;
		chunked_transfer_encoding on;
		tcp_nopush on;
		tcp_nodelay on;
		keepalive_timeout 300;
        	proxy_pass http://127.0.0.1:8089; #映射到内网服务器的其它端口
    	}
}
```

# 3、修改配置后保存生效

```bash
# 检查配置文件语法:在重载或重启 Nginx 之前,必须确保配置文件语法正确,避免因错误配置导致服务无法启动。使用以下命令检查:
sudo nginx -t

# 输出示例
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
# 如果看到类似上述的成功提示,则表示配置语法正确,可以继续下一步。如果出现错误信息(如failed或err

# 平滑重启会在不中断现有连接的情况下加载新配置,适用于生产环境

sudo nginx -s reload

#或者

sudo systemctl reload nginx

# 检查服务状态
sudo systemctl status nginx
```

测试公网调用服务是否正常即可。
