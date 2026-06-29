---
title: "Json cpp中文字符串被转换成unicode的解决办法"
published: 2026-06-29
description: "1.问题情况 正确的返回: 现在返回: 2.解决办法 最后结果返回时统一处理: 3.参考链接 https://www.cnblogs.com/zhangdongsheng/p/12731021.html"
image: ""
tags: []
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 1.问题情况

```cpp
Json::Value root;
root["name"] = "你的名字";   //Chinese, and use utf8
Json::FastWriter fwriter;
std::string retStr = fwriter.write(root);
std::cout << retStr;
```

正确的返回:

```cpp
{"name", "你的名字"}
```

现在返回:

```cpp
{"name", "\u4f60\u7684\u540d\u5b57"}
```

# 2.解决办法

最后结果返回时统一处理:

```cpp
std::string JsonToString(const Json::Value & root)
{
	static Json::Value def = []() {
		Json::Value def;
		Json::StreamWriterBuilder::setDefaults(&def);
		def["emitUTF8"] = true;
		return def;
	}();

	std::ostringstream stream;
	Json::StreamWriterBuilder stream_builder;
	stream_builder.settings_ = def;//Config emitUTF8
	std::unique_ptr<Json::StreamWriter> writer(stream_builder.newStreamWriter());
	writer->write(root, &stream);
	return stream.str();
}
```

# 3.参考链接

[https://www.cnblogs.com/zhangdongsheng/p/12731021.html](https://www.cnblogs.com/zhangdongsheng/p/12731021.html)
