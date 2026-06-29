---
title: "wvp-GB28181-pro安装部署教程"
published: 2026-06-29
description: "1、 安装 ZLMediaKit 教程链接:https://www.cherrylord.cn/article/post 18 2、安装环境依赖 ubuntu环境 3、安装MySQL以及Redis 4、编译配置WVP PRO 4.1、clone项目 git clone https"
image: ""
tags: ["流媒体"]
category: "音视频"
draft: false
lang: "zh-CN"
---

# 1、**安装`ZLMediaKit`**

教程链接:[https://www.cherrylord.cn/article/post-18](https://www.cherrylord.cn/article/post-18)

# 2、安装环境依赖

ubuntu环境

```
apt-get install -y openjdk-11-jre git maven nodejs npm
```

# 3、安装MySQL以及Redis

# 4、编译配置WVP-PRO

## 4.1、clone项目

- git clone [https://gitee.com/pan648540858/wvp-GB28181-pro.git](https://gitee.com/pan648540858/wvp-GB28181-pro.git)
- git clone [https://github.com/648540858/wvp-GB28181-pro.git](https://github.com/648540858/wvp-GB28181-pro.git)

## 4.2、编译前端页面(需提前安装好编译环境)

```bash
cd wvp-GB28181-pro/web_src/
npm --registry=https://registry.npmmirror.com install
npm run build
```

编译完成后在src/main/resources下出现static目录 ,编译完成一般是这个样子,中间没有报红的错误信息

> 图片附件缺失：image.png（image.png）

## 4.3、初始化mysql数据库

导入指定数据库执行文件,项目中最新的  .sql 文件即可

> 图片附件缺失：image 1.png（image.png）

## 4.4、修改配置文件

### 4.4.1、修改`application.yml`的配置

```yaml
spring:
  profiles:
    active: dev
```

### 4.4.2、修改 `application-dev.yml` `redis` `mysql` 以及 `zlm`配置

根据自己的环境修改,重点如下:

- redis
- mysql
- media中的id(和**`zlmediakit`中的配置文件的mediaServerId一致**)、ip、http-port、secret

```yaml
host-ip: 172.16.1.253
spring:
    # [可选]上传文件大小限制
    servlet:
        multipart:
            max-file-size: 10MB
            max-request-size: 100MB
    # REDIS数据库配置
    redis:
        # [必须修改] Redis服务器IP, REDIS安装在本机的,使用127.0.0.1
        host: ${host-ip}
        # [必须修改] 端口号
        port: 6679
        # [可选] 数据库 DB
        database: 6
        # [可选] 访问密码,若你的redis服务器没有设置密码,就不需要用密码去连接
        password: www.coderyj.com
        # [可选] 超时时间
        timeout: 10000
        # mysql数据源
    datasource:
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://${host-ip}:3307/wvp?useUnicode=true&characterEncoding=UTF8&rewriteBatchedStatements=true&serverTimezone=PRC&useSSL=false&allowMultiQueries=true
        username: root
        password: coderyj
        druid:
            initialSize: 10                       # 连接池初始化连接数
            maxActive: 200                        # 连接池最大连接数
            minIdle: 5                            # 连接池最小空闲连接数
            maxWait: 60000                        # 获取连接时最大等待时间,单位毫秒。配置了maxWait之后,缺省启用公平锁,并发效率会有所下降,如果需要可以通过配置useUnfairLock属性为true使用非公平锁。
            keepAlive: true                       # 连接池中的minIdle数量以内的连接,空闲时间超过minEvictableIdleTimeMillis,则会执行keepAlive操作。
            validationQuery: select 1             # 检测连接是否有效sql,要求是查询语句,常用select 'x'。如果validationQuery为null,testOnBorrow、testOnReturn、testWhileIdle都不会起作用。
            testWhileIdle: true                   # 建议配置为true,不影响性能,并且保证安全性。申请连接的时候检测,如果空闲时间大于timeBetweenEvictionRunsMillis,执行validationQuery检测连接是否有效。
            testOnBorrow: false                   # 申请连接时执行validationQuery检测连接是否有效,做了这个配置会降低性能。
            testOnReturn: false                   # 归还连接时执行validationQuery检测连接是否有效,做了这个配置会降低性能。
            poolPreparedStatements: false         # 是否開啟PSCache,並且指定每個連線上PSCache的大小
            timeBetweenEvictionRunsMillis: 60000  # 配置間隔多久才進行一次檢測,檢測需要關閉的空閒連線,單位是毫秒
            minEvictableIdleTimeMillis: 300000    # 配置一個連線在池中最小生存的時間,單位是毫秒
            filters: stat,slf4j             # 配置监控统计拦截的filters,监控统计用的filter:sta, 日志用的filter:log4j
            useGlobalDataSourceStat: true         # 合并多个DruidDataSource的监控数据
            # 通过connectProperties属性来打开mergeSql功能;慢SQL记录
            connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=1000
            #stat-view-servlet.url-pattern: /admin/druid/*

#[可选] WVP监听的HTTP端口, 网页和接口调用都是这个端口
server:
    port: 18080

# 作为28181服务器的配置
sip:
    # [必须修改] 本机的IP
    ip: 172.16.1.134
    # [可选] 28181服务监听的端口
    port: 5060
    # 根据国标6.1.2中规定,domain宜采用ID统一编码的前十位编码。国标附录D中定义前8位为中心编码(由省级、市级、区级、基层编号组成,参照GB/T 2260-2007)
    # 后两位为行业编码,定义参照附录D.3
    # 3701020049标识山东济南历下区 信息行业接入
    # [可选]
    domain: 3402000000
    # [可选]
    id: 34020000002000000001
    # [可选] 默认设备认证密码,后续扩展使用设备单独密码, 移除密码将不进行校验
    password: 12345678

#zlm 默认服务器配置
media:
    id: FQ3TF8yT83wh5Wvz
    # [必须修改] zlm服务器的内网IP
    ip: ${host-ip}
    # [必须修改] zlm服务器的http.port
    http-port: 80
    # [可选] zlm服务器的hook.admin_params=secret
    secret: 035c73f7-bb6b-4889-a715-d9eb2d1925cc
    # 启用多端口模式, 多端口模式使用端口区分每路流,兼容性更好。 单端口使用流的ssrc区分, 点播超时建议使用多端口测试
    rtp:
        # [可选] 是否启用多端口模式, 开启后会在portRange范围内选择端口用于媒体流传输
        enable: true
        # [可选] 在此范围内选择端口用于媒体流传输, 必须提前在zlm上配置该属性,不然自动配置此属性可能不成功
        port-range: 30000,30500 # 端口范围
        # [可选] 国标级联在此范围内选择端口发送媒体流,
        send-port-range: 30000,30500 # 端口范围
    # 录像辅助服务, 部署此服务可以实现zlm录像的管理与下载, 0 表示不使用
    record-assist-port: 18081
# [可选] 日志配置, 一般不需要改
logging:
    config: classpath:logback-spring-local.xml
# [根据业务需求配置]
user-settings:
    # [可选] 服务ID,不写则为000000
    server-id:
    # [可选] 自动点播, 使用固定流地址进行播放时,如果未点播则自动进行点播, 需要rtp.enable=true
    auto-apply-play: false
    # [可选] 部分设备需要扩展SDP,需要打开此设置
    senior-sdp: false
    # 保存移动位置历史轨迹:true:保留历史数据,false:仅保留最后的位置(默认)
    save-position-history: false
    # 点播等待超时时间,单位:毫秒
    play-timeout: 3000
    # 等待音视频编码信息再返回, true: 可以根据编码选择合适的播放器,false: 可以更快点播
    wait-track: false
    # 是否开启接口鉴权
    interface-authentication: true
    # 自动配置redis 可以过期事件
    redis-config: true
    # 接口鉴权例外的接口, 即不进行接口鉴权的接口,尽量详细书写,尽量不用/**,至少两级目录
    interface-authentication-excludes:
        - /api/v1/**
    # 推流直播是否录制
    record-push-live: true
    # 国标是否录制
    record-sip: true
    # 是否将日志存储进数据库
    logInDatebase: true
    # 第三方匹配,用于从stream钟获取有效信息
    thirdPartyGBIdReg: [\s\S]

# 版本信息, 不需修改
version:
    version: "@project.version@"
    description: "@project.description@"
    artifact-id: "@project.artifactId@"
```

## 4.5、生成可执行jar

```
cd wvp-GB28181-pro
mvn package
```

也可以在Windows系统上用Idea生成可执行文件

## 4.6、查看或者修改**`zlmediakit`中的相关配置**

```bash
cd  /ZLMediaKit/release/linux/Debug
vim  config.ini
```

# 5、启动

## 5.1、启动ZLMediaKit

```bash
./MediaServer -d &
# 后台启动
nohup ./MediaServer -d &
```

## 5.2、启动wvp-GB28181-pro

```bash
cd wvp-GB28181-pro/target
java -jar wvp-pro-*.jar --spring.config.location=../src/main/resources/application.yml
```

# 6、访问

**访问 输入 [http://localhost:18080](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A18080) 登录密码 `admin/admin` 即可访问**

# 7、参考链接

- https://juejin.cn/post/7137227263095308319
- [https://blog.csdn.net/KIDfengKID/article/details/127894376](https://blog.csdn.net/KIDfengKID/article/details/127894376)
- 官方说明地址:[https://doc.wvp-pro.cn/#/](https://doc.wvp-pro.cn/#/)
