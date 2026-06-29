---
title: "在web页面使用mediamtx流媒体服务器播放rtsp视频流"
published: 2026-06-29
description: "1、使用背景 mediamtx真乃神器也! 项目地址:https://github.com/bluenviron/mediamtx/tree/main 参考 感谢博主 :https://blog.csdn.net/qq 20937557/article/details/13227"
image: ""
tags: ["流媒体"]
category: "音视频"
draft: false
lang: "zh-CN"
---

# 1、使用背景

mediamtx真乃神器也!
项目地址:[https://github.com/bluenviron/mediamtx/tree/main](https://github.com/bluenviron/mediamtx/tree/main)
参考(感谢博主):[https://blog.csdn.net/qq_20937557/article/details/132271507?spm=1001.2014.3001.5501](https://blog.csdn.net/qq_20937557/article/details/132271507?spm=1001.2014.3001.5501)

先说优点:

1、不管是在windows还是linux,安装和使用都极其简单;
2、作者写的文档比较详细,使用过程中遇到的问题很少,不需要去参考其他文档;
3、在github上进行提问以及bug提交作者都能回复并及时修复bug,非常赞;
4、支持rtsp、rtmp、hsl;并且延迟处理的比较好;
5、集成webrtc可直接播放视频;
6、可进行视频访问加密处理;

# 2、安装ffmpeg

这个比较简单,网上教程也比较多,此处不做介绍。

ubuntu18.04上安装ffmpeg5.1可以参考:

[ubuntu18安装ffmpeg5](https://blog.csdn.net/haixiangyun/article/details/132583757)

# 3、**下载运行mediamtx**

下载地址:[mediamtx下载地址](https://github.com/bluenviron/mediamtx/releases)

运行方式:

- windows直接双击mediamtx.exe;
- linux下在当前目录直接运行sudo ./mediamtx

# 4、功能介绍

**mediamtx.yml文件的配置:**

1. 日志:
    1. 默认日志的logDestinations配置的是logDestinations,可加入file保存为日志文件;日志文件保存在当前目录下
2. API:
    1. API配置设为yes,apiAddress是api的地址和端口号,默认127.0.0.1:9997,可以使用本机IP,0.0.0.0表示127.0.0.1和本机实际IP都可以访问
3. 视频流:

    此处介绍一下rtsp,其他的一样,protocols中使用的协议可以根据设置的先后顺序进行优先排序

4. webrtc

    使用webrtc可以直接在网页中浏览视频

5.  **配置现有非H265视频流**

    如果你的需求是能直接在网页中播放H264的rtsp或者其他视频流,stream01是你起的名字,source是视频流地址,在此处配置后可直接访问,使用webrtc直接访问:[http://127.0.0.1:8889/stream01就能出来视频](http://127.0.0.1:8889/stream01%E5%B0%B1%E8%83%BD%E5%87%BA%E6%9D%A5%E8%A7%86%E9%A2%91)

6. **配置使用ffmpeg转换流**
    1. runOnInit:配置ffmpeg转换命令,服务器启动后就一直在后台执行转换命令,使用webrtc直接访问:http://127.0.0.1:8889/stream11就能出来视频
    2. runOnDemand:配置ffmpeg转换命令,只有在调用流时才会执行转换命令,

    使用webrtc直接访问:[http://127.0.0.1:8889/stream22](http://127.0.0.1:8889/stream22) 时,或者播放rtsp://127.0.0.1:8554/stream22时才会调用ffmpeg转换命令,还可以调整runOnDemandCloseAfter参数来配置不调用后关闭执行转换命令的时间

    # 5、API使用

    API文档:[https://bluenviron.github.io/mediamtx/](https://bluenviron.github.io/mediamtx/)
    1、 [http://127.0.0.1:9997/v2/paths/list](http://127.0.0.1:9997/v2/paths/list)
    查看当前的视频流,包括yml里面配置的和通过api添加的

    2、 [http://127.0.0.1:9997/v2/config/paths/add/stream11,此处我使用postman演示调用api。](http://127.0.0.1:9997/v2/config/paths/add/stream11%EF%BC%8C%E6%AD%A4%E5%A4%84%E6%88%91%E4%BD%BF%E7%94%A8postman%E6%BC%94%E7%A4%BA%E8%B0%83%E7%94%A8api%E3%80%82)
    (1)添加一个现有的视频流,添加后访问http://127.0.0.1:8889/stream11

    (2)添加一个使用ffmpeg转换的视频流

    我这个ffmpeg命令是把原来H265的视频转换为H264的rtsp视频流,访问http://127.0.0.1:8889/stream12,简单说明一下我使用的参数:
    -vcodec libx264 输出流为h264格式
    -b:v 1024k 视频码流
    -vf scale=1280:720 分辨率
    -bf 0 禁用B帧,因为webrtc在网页调用时控制台一直输出 WebRTC doesn’t support H264 streams with B-frames,没有此问题的可以不设置

    (3)[http://192.168.234.133:9997/v2/config/paths/remove/stream11](http://192.168.234.133:9997/v2/config/paths/remove/stream11)  ,删除stream11流,remove后面的参数就是要删除的名字

# 6、参考链接

[https://blog.csdn.net/haixiangyun/article/details/132489160](https://blog.csdn.net/haixiangyun/article/details/132489160)
