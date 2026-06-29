---
title: "该Blog使用教程"
published: 2026-06-29
description: "模板使用说明 您的NotionNext项目必须绑定一个Notion数据库才能使用。 请复制该模板到您的Notion中,并按照模板格式创建文章: NOTION BLOG 数据库字段说明 Notion数据库中,每条数据都将有以下属性🤔: 属性 必填 说明 备注 title 是 文章"
image: ""
tags: []
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 模板使用说明

您的NotionNext项目必须绑定一个Notion数据库才能使用。

请复制该模板到您的Notion中,并按照模板格式创建文章:

[NOTION BLOG](https://tanghh.notion.site/02ab3b8678004aa69e9e415905ef32a5?v=b7eb215720224ca5827bfaa5ef82cf2d)

## 数据库字段说明

Notion数据库中,每条数据都将有以下属性🤔:

| 属性 | 必填 | 说明 | 备注 |
| --- | --- | --- | --- |
| `title` |  是 |  文章标题 |  |
| `status` | 是 | 发布状态 | (仅当状态为`Published` 时会被 展示) |
| `type` | 是 | 页面类型 (博文`Post` / 单页(`Page`) | 单页不会在博文列表显示 。 |
| `summary` | 否 | 内容摘要 | 搜索和简略显示会用到 |
| `date` | 否 | 发布日期 | 在V3.3.9之前的版本此项为必填。 |
| `category` | 否 | 文章分类 | 可以自定义 |
| `tags` | 否 | 文章标签 | 可多个,建议不要太多 |
| `slug` | 否 | 文章短路径 |  (每篇文章唯一,请勿 重复) |
| `icon` | 否 | 菜单栏图标(仅当`Page`类型有效) | 可以参考:[图标库地址](https://fontawesome.com/v6/search) |
| `password` |  否 |  文章加锁 |  需要输入密码才允许访问 |
