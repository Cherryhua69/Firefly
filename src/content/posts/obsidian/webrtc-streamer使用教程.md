---
title: "webrtc-streamer使用教程"
published: 2026-06-29
description: "1、 webrtc streamer的安装部署 1、下载地址: https://github.com/mpromonet/webrtc streamer/releases 2、 Linux版本部署 系统环境都正常的情况安装步骤如下: 1. webrtc streamer包:web"
image: ""
tags: ["流媒体"]
category: "音视频"
draft: false
lang: "zh-CN"
---

# 1、**webrtc-streamer的安装部署**

## 1、下载地址:[**https://github.com/mpromonet/webrtc-streamer/releases**](https://github.com/mpromonet/webrtc-streamer/releases)

## 2、**Linux版本部署**

系统环境都正常的情况安装步骤如下:

1. webrtc-streamer包:webrtc-streamer-v0.7.2-Linux-x86_64-Release.tar.gz
2. 拷贝到root下,解压:tar -xvf webrtc-streamer-v0.7.2-Linux-x86_64-Release.tar.gz
3. 进入webrtc-streamer-v0.7.2-Linux-x86_64-Release:cd webrtc-streamer-v0.7.2-Linux-x86_64-Release
4. 执行 ./webrtc-streamer  -C config.json -o        (具体参数看以下详情)

```bash
# 启动命令参数介绍
./webrtc-streamer [-H http port] [-S[embeded stun address]] -[v[v]]  [url1]...[urln]
./webrtc-streamer [-H http port] [-s[external stun address]] -[v[v]] [url1]...[urln]
./webrtc-streamer -V
    	-v[v[v]]           : verbosity
    	-V                 : print version
    	-H [hostname:]port : HTTP server binding (default 0.0.0.0:8000)
	-w webroot         : path to get files
	-c sslkeycert      : path to private key and certificate for HTTPS
	-N nbthreads       : number of threads for HTTP server
	-A passwd          : password file for HTTP server access
	-D authDomain      : authentication domain for HTTP server access (default:mydomain.com)

	-S[stun_address]                   : start embeded STUN server bind to address (default 0.0.0.0:3478)
	-s[stun_address]                   : use an external STUN server (default:stun.l.google.com:19302 , -:means no STUN)
	-t[username:password@]turn_address : use an external TURN relay server (default:disabled)
	-T[username:password@]turn_address : start embeded TURN server (default:disabled)

	-a[audio layer]                    : spefify audio capture layer to use (default:0)
	-q[filter]                         : spefify publish filter (default:.*)
	-o                                 : use null codec (keep frame encoded)

	-C config.json                     : load urls from JSON config file
	-R [Udp port range min:max]        : Set the webrtc udp port range (default 0:65535)

	-n name -u videourl -U audiourl    : register a name for a video url and an audio url
[url]                              : url to register in the source list
```

# 3、参考链接

[https://www.pythonziliao.com/post/340.html#三、webrtc-streamer的启动命令介绍](https://www.pythonziliao.com/post/340.html#%E4%B8%89%E3%80%81webrtc-streamer%E7%9A%84%E5%90%AF%E5%8A%A8%E5%91%BD%E4%BB%A4%E4%BB%8B%E7%BB%8D)
