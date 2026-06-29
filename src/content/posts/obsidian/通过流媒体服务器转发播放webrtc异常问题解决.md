---
title: "通过流媒体服务器转发播放webrtc异常问题解决"
published: 2026-06-29
description: "1、问题 这里使用的事ZlmediaKit流媒体服务器 BUG 使用海康设备推送h265格式视频,webrtc播放异常,提示必须确保最少有一个活跃的track 经过排查,发现谷歌浏览器才支持h265格式的视频流以webrtc的形式播放,火狐、Edge原生都播放不了 2、解决 1."
image: ""
tags: ["流媒体"]
category: "音视频"
draft: false
lang: "zh-CN"
---

# 1、问题

这里使用的事ZlmediaKit流媒体服务器

- **BUG 使用海康设备推送h265格式视频,webrtc播放异常,提示必须确保最少有一个活跃的track**
- 经过排查,发现谷歌浏览器才支持h265格式的视频流以webrtc的形式播放,火狐、Edge原生都播放不了

# 2、解决

1. 改成H264推送方案,海康相关设备都可以直接在后台配置修改
2. 可以选择wasm的播放器方案,webrtc播放265目前无解

# 3、参考链接

1. https://github.com/ZLMediaKit/ZLMediaKit/issues/1674
2. https://github.com/ZLMediaKit/ZLMediaKit/issues/2179
