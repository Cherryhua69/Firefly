---
title: "yolov8蒸馏训练"
published: 2026-06-29
description: "1、分别训练学生模型和教师模型 这里用的是yolov8x.pt为权重训练教师模型,yolov8s.pt作为学生模型 2、蒸馏训练 参考链接: https://blog.csdn.net/W extend/article/details/140902235?spm=1001.201"
image: ""
tags: ["AI"]
category: "AI"
draft: false
lang: "zh-CN"
---

# 1、分别训练学生模型和教师模型

这里用的是yolov8x.pt为权重训练教师模型,yolov8s.pt作为学生模型

```python
import os
from ultralytics import YOLO
import torch
os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

def main():
    model = YOLO("yolov8x.pt")
    # model = YOLO("yolov8s.pt") # 训练为学生模型,也可以自己剪枝
    model.train(data="data.yaml", Distillation = None, loss_type='None', amp=False, imgsz=640, epochs=50, batch=20, device=0, workers=0)

if __name__ == '__main__':
    main()
```

# 2、蒸馏训练

```python
import os
from ultralytics import YOLO
import torch

os.environ['KMP_DUPLICATE_LIB_OK'] = 'True'

def main():
    model_t = YOLO('runs/detect/yolov8x/weights/best.pt')  # the teacher model
    model_s = YOLO('runs/detect/yolov8s/weights/best.pt')  # the student model
    """
    Attributes:
        Distillation: the distillation model
        loss_type: mgd, cwd
        amp: Automatic Mixed Precision
    """
    model_s.train(data="data.yaml", Distillation=model_t.model, loss_type='mgd', amp=False, imgsz=640, epochs=100,
                  batch=20, device=0, workers=0, lr0=0.001)

if __name__ == '__main__':
    main()

```

# 参考链接:

[https://blog.csdn.net/W_extend/article/details/140902235?spm=1001.2014.3001.5502](https://blog.csdn.net/W_extend/article/details/140902235?spm=1001.2014.3001.5502)

# yolov5蒸馏训练项目链接:

[https://github.com/tangjunjun966/yolov5-6.0-distillation-master](https://github.com/tangjunjun966/yolov5-6.0-distillation-master)
