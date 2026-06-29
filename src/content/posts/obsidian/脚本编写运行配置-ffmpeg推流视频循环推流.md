---
title: "脚本编写运行配置（FFmpeg推流视频循环推流）"
published: 2026-06-29
description: "下面主要介绍下如何推流文件夹内的所有视频,目前已测试B站和虎牙推流直播没问题,斗鱼应该也行; 1. 建立config目录,目录下创建是三个文件,dir,temp,key dir文件里写入要播放的视频的文件夹地址 key文件写入要推流的key,直接从直播网站复制过来放到这个文件里就"
image: ""
tags: ["流媒体"]
category: "音视频"
draft: false
lang: "zh-CN"
---

下面主要介绍下如何推流文件夹内的所有视频,目前已测试B站和虎牙推流直播没问题,斗鱼应该也行;

1. 建立config目录,目录下创建是三个文件,dir,temp,key
- dir文件里写入要播放的视频的文件夹地址
- key文件写入要推流的key,直接从直播网站复制过来放到这个文件里就行(不推流到直播平台可以不设置)
- temp文件写入待播放的第一个视频的名字,不要带目录,视频要放在dir里配置的文件夹里,这个文件后续会通过play.sh脚本进行更新的
1. 在config同级目录下编写自动重启脚本(play.sh),同时计算出下一个待播放的视频的名字,存储到temp文件里

```bash
#!/bin/bashbase_path=/data/video
config_path=$base_path/config
path=`cat $config_path/dir`temp=`cat $config_path/temp`index=0

for filename in `ls $path`do
  if -z $temp  && $index == 0; then
     index=1
     temp=$filename
  elif $filename == $temp && $index -lt 2; then
     index=2
     continue
  elif [ $index == 2  ]; then
     index=0
     temp=$filename
     break
  fi
done
echo $temp > $config_path/temp

STREAM_KEY=`cat $config_path/key`pid=`ps -ef | grep ffmpeg | grep -v "grep" | awk '{print $2}'`kill -9 $pid
nohup ffmpeg -re -stream_loop -1 -i "$path/$temp" -c copy -f flv "$STREAM_KEY" &
1234567891011121314151617181920212223242526272829303132

#只遍历文件夹内的视频推流到mediatx服务器上(其它服务器也行srs...)
#STREAM_URL="rtsp://127.0.0.1:8554/stream"
#pid=`ps -ef | grep ffmpeg | grep -v "grep" | awk '{print $2}'`
#kill -9 $pid
#nohup ffmpeg -re -stream_loop -1 -i "$path/$temp" -vcodec copy -acodec copy -f rtsp "$STREA#M_URL" > /home/luban/logs/ffmepg-vedio-stream-log.out 2>&1 &
```

1. 在config同级目录下创建(scheduled.sh)计算出下一个视频的时长,并休眠计算出的下一个视频的时长

```bash
#!/bin/bashBASE_PATH=/data/video
VIDEO_PATH=${BASE_PATH}/mp4/sydt

while true
do
  /bin/bash ${BASE_PATH}/play.sh
  filename=`cat ${BASE_PATH}/config/temp`seconds=`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -i ${VIDEO_PATH}/${filename}`sleep $seconds
done
123456789101112
```

1. 将该脚本使用nohup挂载到后台就可以了

```bash
# 先授权
sudo chmod 777 *
nohup ./scheduled.sh > /home/cherry/logs/vedio-stream-log.out 2>&1 &
```

1. 运行报错解决
- bash: ./scheduled.sh: /bin/bash^M: bad interpreter: No such file or directory

### **解决方法:**

**使用 `dos2unix` 工具转换文件**: 如果你有 `dos2unix` 工具,可以直接使用它来转换文件的换行符。

```bash
bash

sudo apt-get install dos2unix# 在 Debian/Ubuntu 系统上安装 dos2unix
dos2unix scheduled.sh
dos2unix play.sh
```

参考链接:

[https://blog.csdn.net/sangskf123/article/details/130376705](https://blog.csdn.net/sangskf123/article/details/130376705)
