---
title: "编译FFmpeg（支持CUDA加速，支持h264）"
published: 2026-06-29
description: "1、检查GPU相关配置 2、依赖安装编译 1、编译安装 ffnvcodec 2、配置编译安装FFmpeg 3、实际实现GPU硬解码代码 4、使用报错记录 ffmpeg硬编码踩坑Driver does not support the required nvenc API versi"
image: ""
tags: ["Linux", "流媒体"]
category: "音视频"
draft: false
lang: "zh-CN"
---

# 1、检查GPU相关配置

```bash
nvidia-smi
Wed Feb 12 16:48:50 2025
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.216.01             Driver Version: 535.216.01   CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  NVIDIA GeForce GTX 1650        Off | 00000000:01:00.0 Off |                  N/A |
| 46%   51C    P2              N/A /  75W |    369MiB /  4096MiB |     36%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+

+---------------------------------------------------------------------------------------+
| Processes:                                                                            |
|  GPU   GI   CI        PID   Type   Process name                            GPU Memory |
|        ID   ID                                                             Usage      |
|=======================================================================================|
|    0   N/A  N/A      2473      G   /usr/lib/xorg/Xorg                           49MiB |
+---------------------------------------------------------------------------------------+
```

# 2、依赖安装编译

## 1、编译安装 ffnvcodec

```bash
➜  ~ git clone https://git.videolan.org/git/ffmpeg/nv-codec-headers.git
➜  ~ cd nv-codec-headers
➜  ~ sudo make install
sed 's#@@PREFIX@@#/usr/local#' ffnvcodec.pc.in > ffnvcodec.pc
install -m 0755 -d '/usr/local/include/ffnvcodec'
install -m 0644 include/ffnvcodec/*.h '/usr/local/include/ffnvcodec'
install -m 0755 -d '/usr/local/lib/pkgconfig'
install -m 0644 ffnvcodec.pc '/usr/local/lib/pkgconfig'
➜  ~ export PKG_CONFIG_PATH="/usr/local/lib/pkgconfig"
➜  ~ pkg-config --modversion ffnvcodec
12.0.16.1
```

## 2、配置编译安装FFmpeg

```bash
sudo ./configure --prefix=/usr/local/ffmpeg --enable-shared --disable-static --disable-doc  --enable-gpl --enable-libx264 --enable-cuda --enable-cuvid --enable-network--enable-nvenc
sudo make -j # 有多少物理核心写多少,可以加快编译速度
sudo make install

# 系统配置
sudo vim ~/.bashrc
#在末尾,添加如下内容:
export LD_LIBRARY_PATH=/usr/local/ffmpeg/lib:$LD_LIBRARY_PATH

#保存,关闭文件,运行命使配置生效:
source ~/.bashrc

#生成静态链接文件,如果不执行此步骤,可能系统检测不到安装的ffmpeg软件,因此需要运行如下命令:
cd /usr/bin
sudo ln -s /home/XXX/ffmpeg-4.1/ffprobe ffprobe
sudo ln -s /home/XXX/ffmpeg-4.1/ffmpeg ffmpeg
sudo ln -s /home/XXX/ffmpeg-4.1/ffplay ffplay

# 检查安装
ffmpeg -hwaccels
# 以下为安装成功的显示结果
ffmpeg version 7.0.2 Copyright (c) 2000-2024 the FFmpeg developers
  built with gcc 11 (Ubuntu 11.4.0-9ubuntu1)
  configuration: --prefix=/usr/local/ffmpeg --enable-shared --disable-static --disable-doc --enable-gpl --enable-libx264 --enable-cuda --enable-cuvid --enable-nvenc
  libavutil      59.  8.100 / 59.  8.100
  libavcodec     61.  3.100 / 61.  3.100
  libavformat    61.  1.100 / 61.  1.100
  libavdevice    61.  1.100 / 61.  1.100
  libavfilter    10.  1.100 / 10.  1.100
  libswscale      8.  1.100 /  8.  1.100
  libswresample   5.  1.100 /  5.  1.100
  libpostproc    58.  1.100 / 58.  1.100
Hardware acceleration methods:
cuda
```

# 3、实际实现GPU硬解码代码

```cpp
// 初始化和配置一个 H.264 视频编码器,并将其与 RTSP 输出流关联
int PushOpencv::open_codec(int width, int height, int den) {
    int ret = 0;
    avformat_network_init();
    // const AVCodec *codec = avcodec_find_encoder(AV_CODEC_ID_H264);  // CPU初始编码器

    const AVCodec *codec = avcodec_find_encoder_by_name("h264_nvenc"); // GPU硬件加速编码器

    if (!codec)
    {
        throw std::logic_error("Can`t find h264 encoder!"); // 找不到264编码器
    }
    // b 创建编码器上下文
    outputVc = avcodec_alloc_context3(codec);
    if (!outputVc)
    {
        throw std::logic_error("avcodec_alloc_context3 failed!"); // 创建编码器失败
    }
    // c 配置编码器参数
    outputVc->flags |= AV_CODEC_FLAG_GLOBAL_HEADER; // 全局参数
    outputVc->codec_id = codec->id;
    outputVc->codec_type = AVMEDIA_TYPE_VIDEO;
    outputVc->thread_count = 4;

    outputVc->bit_rate = 1024 * 1024 * 8; // 压缩后每秒视频的bit位大小为50kb
    outputVc->width = width;
    outputVc->height = height;
    outputVc->time_base = {1, den};
    outputVc->framerate = {den, 1};

    outputVc->gop_size = 5;
    outputVc->max_b_frames = 0;
    outputVc->qmax = 30;
    outputVc->qmin = 10;
    outputVc->pix_fmt = AV_PIX_FMT_YUV420P;

    // // CPU进行编码配置
    // av_opt_set(outputVc->priv_data, "preset", "ultrafast", 0); //preset 决定了编码器的速度与质量权衡,superfast 是一种快速模式。
    // av_opt_set(outputVc->priv_data, "tune", "zerolatency", 0); //tune 的 zerolatency 配置适合实时流媒体应用,可减少编码延迟。
    // av_opt_set(outputVc->priv_data, "profile", "main", 0);  // Main profile 兼容性更好
    // av_opt_set(outputVc->priv_data, "nal-hrd", "none", 0);  // 关闭 HRD,减少延迟
    // // profile 是 H.264 的一种简化模式,适合低延迟、低复杂度的编码场景::防止转换成webrtc播放卡顿
    // av_opt_set(outputVc->priv_data, "profile", "baseline", 0);    // 设置 baseline profile

    //GPU硬解码详细配置参数
    av_opt_set(outputVc->priv_data, "preset", "p3", 0);   // 低延迟高质量
    av_opt_set(outputVc->priv_data, "tune", "ll", 0);
    av_opt_set(outputVc->priv_data, "profile", "main", 0);
    av_opt_set(outputVc->priv_data, "rc", "vbr", 0); //cbr (Constant Bitrate): 恒定比特率模式。编码器将尽量保持视频流的比特率不变,适用于带宽稳定的场景。vbr (Variable Bitrate): 可变比特率模式。编码器根据视频内容的复杂度调整比特率,适用于不太受带宽限制的场景,能够在保持相同视频质量的同时节省带宽。
    // av_opt_set(outputVc->priv_data, "bitrate", "4000000", 0);   // 4Mbps
    av_opt_set(outputVc->priv_data, "maxrate", "4000000", 0);
    av_opt_set(outputVc->priv_data, "bufsize", "8000000", 0);
    av_opt_set(outputVc->priv_data, "gop", "30", 0);
    av_opt_set(outputVc->priv_data, "bframes", "0", 0);
    av_opt_set(outputVc->priv_data, "spatial-aq", "1", 0);
    av_opt_set(outputVc->priv_data, "temporal-aq", "1", 0);
    av_opt_set(outputVc->priv_data, "zerolatency", "1", 0);

    // d 打开编码器上下文
    ret = avcodec_open2(outputVc, codec, 0);
    std::cout << "avcodec_open2 success!" << std::endl;

    ret = avformat_alloc_output_context2(&output, nullptr, "rtsp", url.c_str());

    vs = avformat_new_stream(output, outputVc->codec);
    vs->codecpar->codec_tag = 0;
    // 从编码器复制参数
    avcodec_parameters_from_context(vs->codecpar, outputVc);

    av_dump_format(output, 0, url.c_str(), 1);

    ret = avio_open(&output->pb, url.c_str(), AVIO_FLAG_WRITE);
    return ret;
}
```

# 4、使用报错记录

- **ffmpeg硬编码踩坑Driver does not support the required nvenc API version. Required: 12.2 Found: 12.0**

如何处理在使用ffmpeg时因nvidia驱动与nv-codec-headers版本不匹配引发的问题,通过下载对应驱动版本的nv-codec-headers、编译安装并重新编译ffmpeg来解决此问题,确保硬件加速功能正常工作。

## 1、**在官网上下载一个符合现在nvidia驱动版本的nv-codec-headers版本:**

## 2、重新编译安装**nv-codec-headers以及FFmpeg**

# 5、参考链接:

- https://blog.csdn.net/JineD/article/details/128420330
- https://blog.csdn.net/qq_43513908/article/details/138161139
- https://blog.yearnfar.com/posts/%E7%BC%96%E7%A8%8B/linux/nvidia-gpu%E5%8A%A0%E9%80%9Fffmpeg/
- https://blog.csdn.net/whf_139/article/details/135515346
- https://blog.csdn.net/as812252319/article/details/115258830
- https://blog.csdn.net/qq_36397240/article/details/107745149
