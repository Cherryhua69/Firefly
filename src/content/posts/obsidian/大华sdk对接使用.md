---
title: "大华SDK对接使用"
published: 2026-06-29
description: "1、拉取示例代码 该代码为自己验证实现的demo示例 GitHub: https://github.com/Cherryhua69/dahua SDK 2、直接编译运行即可 根据自己的业务要求修改代码 3、遇到的问题 1、yuv原始Y、U、V分离存储数据转化 2、运行报错: ca"
image: ""
tags: []
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 1、拉取示例代码

该代码为自己验证实现的demo示例

GitHub:

[https://github.com/Cherryhua69/dahua_SDK](https://github.com/Cherryhua69/dahua_SDK)

# 2、直接编译运行即可

根据自己的业务要求修改代码

```bash
cmake..
make -j
./Yulan
```

# 3、遇到的问题

## 1、yuv原始Y、U、V分离存储数据转化

```cpp

void CALLBACK CBDecode(LONG nPort, FRAME_DECODE_INFO* pFrameDecodeInfo, FRAME_INFO_EX* pFrameInfo, void* pUser){
    if (pFrameDecodeInfo->nType == T_IYUV)
    {
        // 验证输入参数
        if (!pFrameDecodeInfo->pVideoData[0] || !pFrameDecodeInfo->pVideoData[1] || !pFrameDecodeInfo->pVideoData[2] || pFrameInfo->nWidth <= 0 || pFrameInfo->nHeight <= 0) {
            return;
        }
        cout<<"nFrameSeq(对应的视频帧序号):"<<pFrameInfo->nFrameSeq<<endl;
        uint8_t* yData = static_cast<uint8_t*>(pFrameDecodeInfo->pVideoData[0]);
        uint8_t* uData = static_cast<uint8_t*>(pFrameDecodeInfo->pVideoData[1]);
        uint8_t* vData = static_cast<uint8_t*>(pFrameDecodeInfo->pVideoData[2]);
        // YUV420P格式:Y分量占width*height,U和V分量各占width*height/4
        int ySize = pFrameInfo->nWidth * pFrameInfo->nHeight;
        int uvSize = pFrameInfo->nWidth * pFrameInfo->nHeight / 4;
        // 创建连续的YUV420P数据缓冲区
        cv::Mat yuvData(pFrameInfo->nHeight + pFrameInfo->nHeight / 2, pFrameInfo->nWidth, CV_8UC1);
        // 复制Y分量到缓冲区前部
        memcpy(yuvData.data, yData, ySize);
        // 复制U分量
        memcpy(yuvData.data + ySize, uData, uvSize);
        // 复制V分量
        memcpy(yuvData.data + ySize + uvSize, vData, uvSize);
        // 转换YUV420P到BGR
        cv::Mat bgrMat;
        cv::cvtColor(yuvData, bgrMat, cv::COLOR_YUV2BGR_I420);
        yuvData.~Mat();
        // 图片保存测试
        std::string filename = generate_random_string_fast(10) + ".jpg";
        imwrite(filename, bgrMat);
    }
}
```

## 2、运行报错:**cannot open shared object file: No such file or directory解决方法(**[libRenderEngine.so](http://librenderengine.so/)**)**

这个是因为这个动态库需要配置在系统环境变量中才能找到

```bash
# libRenderEngine.so这个动态库需要添加到系统环境中:
export LD_LIBRARY_PATH= libs的路径 :$LD_LIBRARY_PATH
```

# 4、参考:

1. https://blog.csdn.net/zong596568821xp/article/details/90297360
2. 大华官方的SDK文档(很乱且不全)
