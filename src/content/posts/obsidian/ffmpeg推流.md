---
title: "FFmpeg推流"
published: 2026-06-29
description: "1、单个视频循环播放推流 2、接收摄像头的流再做推流"
image: ""
tags: ["流媒体"]
category: "音视频"
draft: false
lang: "zh-CN"
---

# 1、单个视频循环播放推流

```bash
ffmpeg -re  -stream_loop -1 -i E:\AI\Data\video\4.mp4 -vcodec copy -acodec copy -f rtsp rtsp://127.0.0.1:8554/stream
```

# 2、接收摄像头的流再做推流

```bash
ffmpeg -re -i rtsp://摄像头账号:摄像头密码@192.168.10.121:554/Streaming/Channels/1 -c copy -f rtsp rtsp://127.0.0.1:8554/stream
```
