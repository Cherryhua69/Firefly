---
title: "开源Paddleocr+人脸提取实现身份证信息识别"
published: 2026-06-29
description: "1、安装 根据自己的环境安装对应的依赖 参考链接:https://www.paddlepaddle.org.cn/install/quick?docurl=/documentation/docs/zh/develop/install/pip/linux pip.html 2、Pa"
image: ""
tags: ["Python", "AI"]
category: "AI"
draft: false
lang: "zh-CN"
---

# 1、安装

根据自己的环境安装对应的依赖

```bash
#系统有GPU的
pip install paddlepaddle-gpu==3.1.1 -i https://www.paddlepaddle.org.cn/packages/stable/cu126/
pip install "paddleocr"

# 人脸提取的依赖库(可以用其它方法)
pip install dlib
```

参考链接:[https://www.paddlepaddle.org.cn/install/quick?docurl=/documentation/docs/zh/develop/install/pip/linux-pip.html](https://www.paddlepaddle.org.cn/install/quick?docurl=/documentation/docs/zh/develop/install/pip/linux-pip.html)

# 2、Paddleocr使用

官方示例参考链接:[https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.6/doc/doc_ch/whl.md#6-参数说明](https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.6/doc/doc_ch/whl.md#6-%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)

官方使用示例:

```python
from paddleocr import PaddleOCR, draw_ocr

# Paddleocr目前支持中英文、英文、法语、德语、韩语、日语,可以通过修改lang参数进行切换
# 参数依次为`ch`, `en`, `french`, `german`, `korean`, `japan`。
ocr = PaddleOCR(use_angle_cls=True, lang="ch")  # need to run only once to download and load model into memory
img_path = 'PaddleOCR/doc/imgs/11.jpg'
result = ocr.ocr(img_path, cls=True)
for idx in range(len(result)):
    res = result[idx]
    for line in res:
        print(line)

# 显示结果
from PIL import Image
result = result[0]
image = Image.open(img_path).convert('RGB')
boxes = [line[0] for line in result]
txts = [line[1][0] for line in result]
scores = [line[1][1] for line in result]
im_show = draw_ocr(image, boxes, txts, scores, font_path='/path/to/PaddleOCR/doc/fonts/simfang.ttf')
im_show = Image.fromarray(im_show)
im_show.save('result.jpg')
```

自定义模型使用示例:

```python
from paddleocr import PaddleOCR
#初始化模型
global_ocr = PaddleOCR(use_textline_orientation=True, #开启自动文本平放
                text_detection_model_name=text_detection_model_name,
                text_detection_model_dir=text_detection_model_dir,
                text_recognition_model_name=text_recognition_model_name,
                text_recognition_model_dir=text_recognition_model_dir,
                textline_orientation_model_name=textline_orientation_model_name,
                textline_orientation_model_dir=textline_orientation_model_dir,
                doc_orientation_classify_model_name=doc_orientation_classify_model_name,
                doc_orientation_classify_model_dir=doc_orientation_classify_model_dir,
                doc_unwarping_model_name=doc_unwarping_model_name,
                doc_unwarping_model_dir=doc_unwarping_model_dir,
                text_recognition_batch_size=50  # 识别批量处理数(CPU建议5-10,GPU可提至20)
                )
img_path = 'PaddleOCR/doc/imgs/11.jpg'
result = global_ocr.predict(img_path)
#自行处理返回的结果
```

# 3、dlib人脸提取功能使用

参考链接:[https://blog.csdn.net/Kevin___________/article/details/105140933](https://blog.csdn.net/Kevin___________/article/details/105140933)

```python
def transpose_detector(img, cnt=0):
    '''
    检测人脸并裁剪,返回处理后的图像字节流(用于后续转Base64)
    :param img: imread后的图片对象
    :param cnt: 旋转次数计数器
    :return: 裁剪后的图像字节流(成功)/ None(失败)
    '''
    # 统一处理输入类型(包括上传文件)
    img = process_image_input(img)
    if img is None:
        return None

    # 初始化正脸检测器(移到函数内避免全局变量问题,也可保留全局)
    detector = dlib.get_frontal_face_detector()

    try:
        # 检测图上的人脸(原代码dector拼写错误,修正为detector)
        dets = detector(img, 1)
    except Exception as ex:
        print(f"人脸检测异常: {ex}")
        return None

    # 检测到人脸:裁剪并返回字节流
    if dets:
        face = dets[0]  # 获取第一个人脸(身份证默认单人脸)
        # 计算裁剪范围(原逻辑保留,增加边界检查避免越界)
        top = face.top() - 80 #40
        left = face.left() - 40 #15
        height = face.bottom() - face.top() + 120 #60
        width = face.right() - face.left() + 80 #40

        # 边界保护:避免裁剪范围超出原图尺寸(防止数组越界错误)
        top = max(0, top)
        left = max(0, left)
        bottom = min(img.shape[0], top + height)
        right = min(img.shape[1], left + width)
        # 重新计算有效裁剪尺寸(避免空白图)
        valid_height = bottom - top
        valid_width = right - left

        # 裁剪人脸区域(替换原双重循环,效率更高)
        cropped_face = img[top:bottom, left:right]

        # 检查裁剪结果是否有效(避免空图)
        if valid_height <= 0 or valid_width <= 0:
            print("裁剪范围无效,尝试旋转图像")
            return handle_rotate(img, cnt)

        # --------------- 关键:将裁剪图转为字节流(用于Base64)---------------
        # 1. 用cv2.imencode()将OpenCV图像转为PNG格式字节流(也可改为JPG,调整参数)
        # 参数1:格式后缀(.png/.jpg),参数2:图像数据,参数3:压缩质量(JPG可用,PNG忽略)
        success, img_byte_arr = cv2.imencode('.png', cropped_face)
        if not success:
            print("图像编码为字节流失败")
            return None

        # 2. 返回字节流(后续在主函数中转Base64)
        return img_byte_arr.tobytes()

    # 未检测到人脸:旋转图像重试(原逻辑保留)
    else:
        cnt += 1
        if cnt > 3:
            print("旋转超过3次仍未检测到人脸,处理失败")
            return None
        print(f"第{cnt}次旋转图像重试")

        # 图像旋转(原逻辑:transpose+flip 等效旋转90度,方向可根据需求调整)
        transpose_img = cv2.transpose(img)
        flipped_img = cv2.flip(transpose_img, 0)

        # 递归调用,继续检测旋转后的图像
        return transpose_detector(flipped_img, cnt)

def handle_rotate(img, cnt):
    '''辅助函数:处理裁剪无效时的图像旋转重试'''
    cnt += 1
    if cnt > 3:
        print("旋转超过3次仍未检测到有效人脸,处理失败")
        return None
    print(f"裁剪范围无效,第{cnt}次旋转图像重试")
    transpose_img = cv2.transpose(img)
    flipped_img = cv2.flip(transpose_img, 0)
    return transpose_detector(flipped_img, cnt)
```
