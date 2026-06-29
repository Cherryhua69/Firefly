---
title: "Yolo模型转换"
published: 2026-06-29
description: "以下都以yolo的姿态检测模型为例 1、准备需要用的程序 第一个工程:rknn toolkit2, 用于安装模型转换所需环境 ,github地址:https://github.com/airockchip/rknn toolkit2/releases 第二个工程:ultralyt"
image: ""
tags: ["AI"]
category: "AI"
draft: false
lang: "zh-CN"
---

以下都以yolo的姿态检测模型为例

# 1、准备需要用的程序

第一个工程:rknn-toolkit2,**用于安装模型转换所需环境**,[github](https://so.csdn.net/so/search?q=github&spm=1001.2101.3001.7020)地址:[https://github.com/airockchip/rknn-toolkit2/releases](https://github.com/airockchip/rknn-toolkit2/releases)

第二个工程:ultralytics_yolov8,(这个用官方的一样)**用于pt模型转化为onnx模型,为了在rk板子上部署,官方对模型做了修改,训练好的pt模型放在这个工程中转化为onnx模型**,github地址:[https://github.com/airockchip/ultralytics_yolov8](https://github.com/airockchip/ultralytics_yolov8)

第三个工程:rknn_model_zoo,**用于onnx模型转rknn模型**,github地址: [https://github.com/airockchip/rknn_model_zoo/releases](https://github.com/airockchip/rknn_model_zoo/releases)

将这三个加压到同一个文件夹下即可

# 2、环境配置安装(conda)

## 2.1、**conda环境安装**

conda安装配置找网上其他教程

conda新建新环境的时候python建议为3.8的稳定版本

## 2.2、**rknn-toolkit环境安装**

1. cd进入该项目带有requirements依赖文件的路径
2. pip install -r requirements.txt -i [https://pypi.tuna.tsinghua.edu.cn/simple/](https://pypi.tuna.tsinghua.edu.cn/simple/)安装依赖包
3. pip install rknn_toolkit2-2.1.0+708089d1-cp38-cp38-linux_x86_64.whl安装rknn_tookit的依赖

**【注意事项】***需要注意python版本,如何使python3.8则安装requirements_**cp38**2.1.0.txt与rknn_toolkit2-2.1.0+708089d1-cp38-**cp38**linux_x86_64.whl,这些文件名称中的cp38为python3.8的意思,不同python版本安装对应的包,不然会报错*

# 3、pt转onnx

官方方法到处模型

```cpp
from ultralytics import YOLO
# Load a model
model = YOLO('./yolov8n-pose.pt')
# Export the model
results = model.export(format='rknn')
```

**【注意事项1】**

注意这句话,results = model.export(**format=‘rknn’**) ,此处格式虽然是rknn,但是导出的模型为onnx

**【注意事项2】**

官方方法,文档地址:[https://github.com/airockchip/ultralytics_yolov8/blob/main/RKOPT_README.zh-CN.md](https://github.com/airockchip/ultralytics_yolov8/blob/main/RKOPT_README.zh-CN.md)

# 4、onnx转rknn

1. cd rknn_model_zoo-2.1.0/examples/yolov8_pose/python
2. python convert.py ./yolov8n_pose.onnx rk3588*# yolov8s_pose_ultra.onnx为ultra官方下载模型*

**【遇到问题】***下载的ultra官方pt模型,onnx转rknn这一步报错*

> 图片附件缺失：image 4.png（image.png）

**【解决方案】**

***netron查看模型,查看最终的输出***

> 图片附件缺失：image 5.png（image.png）

***修改convert.py中代码,转换成功***

> 图片附件缺失：image 6.png（image.png）

具体能不能使用还得看在瑞芯微的板子上运行部署情况

# 5、参考链接:

[https://blog.csdn.net/weixin_44190670/article/details/143469973](https://blog.csdn.net/weixin_44190670/article/details/143469973)
