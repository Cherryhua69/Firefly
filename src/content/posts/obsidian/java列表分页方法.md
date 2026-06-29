---
title: "Java列表分页方法"
published: 2026-06-29
description: "1、PageHelper 2、IPage"
image: ""
tags: ["Java"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1、PageHelper

```
public PageResult<SysOperationLog> selectPageList(PageParam pageParam, SysOperationLog sysOperationLog) {
        //分页参数带入 ,并放在最顶上
        PageHelper.startPage(Integer.parseInt(pageParam.getCurrent()+""),Integer.parseInt(pageParam.getSize() +""));
        //带入需要分页的列表
        List<SysOperationLog> sysOperationLogResList = sysOperationLogMapper.selectByCondition(sysOperationLog);
        //包装列表数据
        PageInfo<SysOperationLog> pageInfo = new PageInfo<>(sysOperationLogResList);
        PageResult<SysOperationLog> pageResult = new PageResult<>();
        pageResult.setRecords(pageInfo.getList());
        pageResult.setTotal(pageInfo.getTotal());
        return pageResult;
    }
```

# 2、IPage

```
#Mapper层
default PageResult<SysPermission> selectPageList(QueryReq queryReq){
		//分页参数
        PageParam pageParam = new PageParam();
        pageParam.setCurrent(queryReq.getCurrent());
        pageParam.setSize(queryReq.getSize());
        IPage<SysPermission> page = this.prodPage(pageParam);
        //分页查询参数
        LambdaQueryWrapper<SysPermission> wrapper = Wrappers.lambdaQuery(SysPermission.class)
                .likeIfPresent(SysPermission::getPermissionName,queryReq.getParameter().get("permissionName"))
                .orderByDesc(SysPermission::getCreateTime);
        this.selectPage(page, wrapper);
        return new PageResult<>(page.getRecords(), page.getTotal());
    }
```
