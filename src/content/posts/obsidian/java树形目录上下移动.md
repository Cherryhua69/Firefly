---
title: "Java树形目录上下移动"
published: 2026-06-29
description: "1、Controller层 2、interface层 3、实现层 4、Mapper 5、.XML"
image: ""
tags: ["Java"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1、Controller层

```
@PostMapping("/menuUpOrDown")
    @ApiOperation(value = "菜单上下平移")
    @ApiImplicitParam(name = "json", value = "{\"menuId\":\"菜单ID\",\"direct\":\"1-上移,2-下移\"}")
    public ApiResult menuUpOrDown(@RequestBody String json) {
        try {
            CheckToolClass.assertIsJsonLegal(json,"请求参数不能为空!");
            Long menuId = Long.valueOf(JSONObject.parseObject(json).get("menuId").toString());
            Integer direct = Integer.valueOf(JSONObject.parseObject(json).get("menuId").toString());
            return sysMenuService.menuUpOrDown(menuId,direct);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return ApiResult.error(ResultStatus.error.getCode(), MsgConstant.INQUIRE_FAILURE.getMsg());
        }
    }
```

# 2、interface层

```
    /**
     * 菜单同级上下平移
     * @param menuId 菜单id
     * @param direct 方向
     * @return 移动成功
     */
    ApiResult menuUpOrDown(Long menuId, Integer direct);
```

# 3、实现层

```
 @Override
    public ApiResult menuUpOrDown(Long menuId, Integer direct) {
        if (direct == NumberConstants.ONE){
            return moveUp(menuId);
        }else {
            return moveDown(menuId);
        }
    }

    //菜单上移
    private ApiResult moveUp(Long menuId) {
        //获取上移的那条数据的信息
        SysMenu upSysMenu = sysMenuMapper.selectById(menuId);
        Integer temp = upSysMenu.getOrderNum();
        //查询上一条记录
        SysMenu downSysMenu = sysMenuMapper.moveUp(temp,upSysMenu.getMenuId());
        //SysMenu ltMenu = sysMenuMapper.selectOne(Wrappers.lambdaQuery(SysMenu.class)
                //.lt(SysMenu::getOrderNum, orderNum)
                //.eq(SysMenu::getParentId, upSysMenu.getParentId()).orderByDesc(SysMenu::getOrderNum).last("limit 1"));
        //如果上面已经没有记录了,返回
        if (downSysMenu == null) {
            return ApiResult.fail("已经平移至最上方,无法移动!");
        }
        upSysMenu.setOrderNum(downSysMenu.getOrderNum());
        downSysMenu.setOrderNum(temp);
        sysMenuMapper.updateById(upSysMenu);
        sysMenuMapper.updateById(downSysMenu);
        return ApiResult.success();
    }

    //菜单下移
    private ApiResult moveDown(Long menuId) {
        SysMenu downSysMenu = sysMenuMapper.selectById(menuId);
        Integer temp = downSysMenu.getOrderNum();
        //查询下一条记录
        SysMenu upSysMenu = sysMenuMapper.moveDown(temp,downSysMenu.getMenuId());
        //SysMenu gtMenu = sysMenuMapper.selectOne(Wrappers.lambdaQuery(SysMenu.class)
                //.gt(SysMenu::getOrderNum, orderNum)
                //.eq(SysMenu::getParentId, downSysMenu.getParentId()).orderByAsc(SysMenu::getOrderNum).last("limit 1"));
        if (upSysMenu == null) {
            return ApiResult.fail("已经平移至最下方,无法移动!");
        }
        downSysMenu.setOrderNum(upSysMenu.getOrderNum());
        upSysMenu.setOrderNum(temp);
        sysMenuMapper.updateById(upSysMenu);
        sysMenuMapper.updateById(downSysMenu);
        return ApiResult.success();
    }
```

# 4、Mapper

```
 /**
     * 查询上一条记录
     * @param orderNum 排序字段
     * @param menuId 菜单id
     * @return 菜单对象
     */
    SysMenu moveUp(@Param("orderNum") Integer orderNum, @Param("menuId") Long menuId);

    /**
     * 查询下一条记录
     * @param orderNum 排序字段
     * @param menuId 菜单id
     * @return 菜单对象
     */
    SysMenu moveDown(@Param("orderNum") Integer orderNum, @Param("menuId") Long menuId);
```

# 5、.XML

```
<select id="moveUp" resultType="com.luban.system.entity.SysMenu">
        select
        <include refid="AllColumnlist"></include>
        from sys_menu a
        WHERE a.order_num &lt; #{orderNum} and menu_id &lt; #{menuId}
        order by a.order_num desc limit 1
</select>
<select id="moveDown" resultType="com.luban.system.entity.SysMenu">
        select
        <include refid="AllColumnlist"></include>
        from sys_menu a
        WHERE a.order_num &gt; #{orderNum} and menu_id &gt; #{menuId}
        order by a.order_num asc limit 1
</select>
```
