---
title: "FreeType编译与使用"
published: 2026-06-29
description: "1、linux系统编译安装opencv linux系统中编译安装opencv是开启了freetype的使用,后续则可以直接在C++代码中实现,无需额外编译安装freetype。 2、额外编译安装使用FreeType 注意freetype版本和opencv版本的兼容性 这里编译的是"
image: ""
tags: ["C++"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1、linux系统编译安装opencv

linux系统中编译安装opencv是开启了freetype的使用,后续则可以直接在C++代码中实现,无需额外编译安装freetype。

# 2、额外编译安装使用FreeType

- 注意freetype版本和opencv版本的兼容性

这里编译的是freetype-2.13.3

源码下载:[https://download.savannah.gnu.org/releases/freetype/](https://download.savannah.gnu.org/releases/freetype/)

## 1、编译安装

```bash
# 解压后执行命令
sudo ./configure
sudo make
sudo make install
```

## 2、C++程序中使用

### 1、cmakelist.txt中配置引用

```
# freetype-2.13.3
find_package(Freetype REQUIRED)
if(FREETYPE_FOUND)
    message(STATUS "Found FreeType: ${FREETYPE_INCLUDE_DIRS}, ${FREETYPE_LIBRARIES}")
    include_directories(${FREETYPE_INCLUDE_DIRS})
else()
    message(FATAL_ERROR "FreeType not found!")
endif()

find_package(Qt6 REQUIRED COMPONENTS Core Gui Widgets) #有些情况下也要引入这个

TARGET_LINK_LIBRARIES(http_server
${FREETYPE_LIBRARIES}
Qt6::Core Qt6::Gui Qt6::Widgets
 )
```

### 2、具体在Mat上写中文的代码

- 注意:还需要下载.ttf的中文字体引入使用

```cpp
#include <ft2build.h>
#include FT_FREETYPE_H
//其它opencv相关的库自行添加

// UTF-8 转换为 wstring (Unicode)
std::wstring utf8_to_wstring(const std::string& str) {
    std::wstring_convert<std::codecvt_utf8<wchar_t>> converter;
    return converter.from_bytes(str);
}

void drawText(cv::Mat& img, const std::string& text, cv::Point position, int fontSize, cv::Scalar textColor, cv::Scalar bgColor, const std::string& fontPath) {
    // FreeType 初始化
	FT_Library ft;
    if (FT_Init_FreeType(&ft)) {
        std::cerr << "Could not initialize FreeType Library!" << std::endl;
        return;
    }
	// 加载字体
    FT_Face face;
    if (FT_New_Face(ft, fontPath.c_str(), 0, &face)) {
        std::cerr << "Could not load font: " << fontPath << std::endl;
        FT_Done_FreeType(ft);
        return;
    }
	// 设置字体大小
    FT_Set_Pixel_Sizes(face, 0, fontSize);

    int baseline = position.y; //设定文本的 基线高度,通常是 position.y,后续字符绘制时都参考这个值。
    std::wstring wtext = utf8_to_wstring(text); //把 UTF-8 编码的 text 转换为 std::wstring(因为 FreeType 处理的是 wchar_t)
    //计算文本的宽度
    int textWidth = 0; //初始化文本宽度为 0,累加所有字符的 advance.x(水平步长)
    int textHeight = fontSize;
    cv::Point pos = position;

    for (wchar_t wc : wtext) {
        if (FT_Load_Char(face, wc, FT_LOAD_RENDER)) {
            continue;
        }
        FT_GlyphSlot g = face->glyph;
        textWidth += g->advance.x >> 6;
    }
    // 绘制背景矩形
    cv::Rect bgRect(position.x, position.y - fontSize + 13, textWidth, textHeight+2); //前两个参数是左上角坐标,后两个是矩形的宽度和高度
    cv::rectangle(img, bgRect, bgColor, cv::FILLED);
    // 遍历文本绘制字符
    for (wchar_t wc : wtext) {
        if (FT_Load_Char(face, wc, FT_LOAD_RENDER)) {
            continue;
        }
		// 生成字符位图
        FT_GlyphSlot g = face->glyph;
        cv::Mat glyphBitmap(g->bitmap.rows, g->bitmap.width, CV_8UC1, g->bitmap.buffer);
		// 颜色转换 + 乘法计算字体颜色
        if (!glyphBitmap.empty()) {
            cv::Mat mask;
            cv::cvtColor(glyphBitmap, mask, cv::COLOR_GRAY2BGR);
            cv::multiply(mask, cv::Scalar(textColor[0], textColor[1], textColor[2]), mask, 1.0 / 255);

			// 计算 ROI 并复制到 img
            cv::Rect roi(pos.x + g->bitmap_left, (baseline - g->bitmap_top)+10, g->bitmap.width, g->bitmap.rows);
			//
			if (roi.x < 0 || roi.y < 0 || roi.x + roi.width > img.cols || roi.y + roi.height > img.rows) {
				continue;
			}
            mask.copyTo(img(roi), glyphBitmap); //复制 mask 到 img(roi), 使用 glyphBitmap 作为掩码,只复制字符部分
        }
		// 更新 pos.x 进行字符间距调整,字符的水平步长,控制字符之间的间距
        pos.x += g->advance.x >> 6;
    }

    FT_Done_Face(face); //释放字体对象
    FT_Done_FreeType(ft); //释放 FreeType 资源
}

// 使用
cv::Mat img; // 需要写文字的图片
cv::String det_info = "中文文字喔";
// 字体路径
std::string fontPath = "/lianxiangxiaoxinheitichanggui.ttf"; // 选择合适的中文字体
int fontSize = 27;
cv::Scalar textColor(255, 255, 255);  // 白色文字
cv::Scalar color(255, 255, 255);  // 填充颜色
cv::Point position(100,100); //写文字的位置
drawText(img, det_info, position, fontSize, textColor, color, fontPath);
```

# 3、参考链接

- https://www.cnblogs.com/dewxin/p/18096729
- https://blog.csdn.net/syangdung_wang/article/details/113611110
- https://blog.csdn.net/yaojinjian1995/article/details/129419169
