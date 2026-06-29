---
title: "Docker部署MinIO存储服务"
published: 2026-06-29
description: "Docker部署MinIO分布式文件存储服务及其教程 1、什么是MinIO? Minio 是个基于 Golang 编写的开源对象存储套件,基于Apache License v2.0开源协议,虽然轻量,却拥有着不错的性能。它兼容亚马逊S3云存储服务接口。可以很简单的和其他应用结合使"
image: ""
tags: ["Docker"]
category: "运维部署"
draft: false
lang: "zh-CN"
---

# Docker部署MinIO分布式文件存储服务及其教程

## 1、什么是MinIO?

Minio 是个基于 Golang 编写的开源对象存储套件,基于Apache License v2.0开源协议,虽然轻量,却拥有着不错的性能。它兼容亚马逊S3云存储服务接口。可以很简单的和其他应用结合使用,例如 NodeJS、Redis、MySQL等。

## 2、CentOS普通安装

首先下载MinIO

```
wget https://dl.min.io/server/minio/release/linux-amd64/minio
#授权
chmod +x minio
```

操作MinIO的端口是9000 访问MinIO控制台界面的端口是42579,这是一个动态生成的端口,建议启动时添加–console-address “:port”来指定一个固定的端口 默认的用户名和密码都是minioadmin,建议通过修改环境变量MINIO_ROOT_USER和MINIO_ROOT_PASSWORD来修改

```
# 修改环境变量,自定义minio的root用户名和密码(密码至少要8位)
export MINIO_ROOT_USER=admin
export MINIO_ROOT_PASSWORD=12345678

# 启动minio时指定控制台端口
./minio server --console-address ":9001" /data/minio
#后台日志启动
nohup ./minio server --console-address ":9001" /data/minio &
```

## 3、通过Docker快速安装MinIO

### 获取镜像:

```docker
docker pull minio/minio
```

### 创建目录:

一个用来存放配置,一个用来存储上传文件的目录

启动前需要先创建Minio外部挂载的配置文件( /home/minio/config),和存储上传文件的目录( /home/minio/data)

```
mkdir -p /home/minio/config
mkdir -p /home/minio/data
```

### 创建Minio容器并运行:

```docker
docker run -p 9000:9000 -p 9090:9090 \
     --net=host \
     --name minio \
     -d --restart=always \
     -e "MINIO_ACCESS_KEY=minioadmin" \
     -e "MINIO_SECRET_KEY=minioadmin" \
     -v /home/minio/data:/data \
     -v /home/minio/config:/root/.minio \
     minio/minio server \
     /data --console-address ":9090" -address ":9000"
```

### 查看运行情况

```docker
docker p
```

## 4、访问操作

访问地址为你的部署IP地址:9090/login

默认的用户名密码都为: minioadmin minioadmin

### 1)、创建用户,配置规则

### 2)、创建组

### 3)、创建accessKey和secretKey

### 4)、创建Bucket

## 5、Java中实际操作

### 1)、在项目中导入相关的Maven依赖

```xml
<dependency>    <groupId>io.minio</groupId>    <artifactId>minio</artifactId>    <version>8.2.1</version></dependency>
```

### 2)、添加配置

在aplication.yml配置中添加MInIO相关的配置,如下:

```xml
minio:  # 访问的url  endpoint: http://192.168.47.148  # API的端口  port: 9001  # 秘钥  accessKey: HQGWFYLWGC6FVJ0CQFOG  secretKey: pUGhAgQhZDxJaLmN3uz65YX7Bb3FyLdLglBvcCr1  secure: false  bucket-name: test # 桶名 我这是给出了一个默认桶名  image-size: 10485760 # 我在这里设定了 图片文件的最大大小  file-size: 1073741824 # 此处是设定了文件的最大大小
```

### 3)、新建上传文件接口

```java
/** * @author cherryhua */@RequestMapping("/minio")@RestControllerpublic class MinioController {    @Autowired    private  MinioService minioService;    @PostMapping("/upload")    public String uploadFile(MultipartFile file, String bucketName) {        String fileType = FileTypeUtils.getFileType(file);        if (fileType != null) {            return minioService.putObject(file, bucketName, fileType);        }        return "不支持的文件格式。请确认格式,重新上传!!!";    }}
```

### 4)、测试上传效果

接口返回的URL就是文件的访问地址,直接输入浏览器访问即可,在MInIO中也可以看到存储的文件。

## 6、实际项目和自定义Springboot-Starter使用

### 1)、导入minio相关依赖

```xml
<dependency>      <groupId>io.minio</groupId>      <artifactId>minio</artifactId>      <version>${minio.version}</version></dependency>
```

### 2)、创建yaml对应的配置类

```java
@Data@ConfigurationProperties("minio")public class MinioConfigurationProperties {    private String endpoint;    private String accessKey;    private String secretKey;    private String bucket;    private Integer tempUrlExpire;}
```

### 3)、创建minio自动配置类,将MinioClient存入容器

```java
@Configuration@EnableConfigurationProperties(MinioConfigurationProperties.class)public class MinioAutoConfiguration {    @Autowired    private MinioConfigurationProperties minioProperties;    @Bean    public MinioClient minioClient() {        return MinioClient.builder().endpoint(minioProperties.getEndpoint())                .credentials(minioProperties.getAccessKey(), minioProperties.getSecretKey())                .build();    }}
```

### 4)、创建MinioService,封装通用方法

```java
@Servicepublic class MinioService {    @Autowired    private MinioClient minioClient;    @Autowired    private MinioConfigurationProperties minioProperties;    /**     * 获取文件列表     * @return 文件列表     */    public List<String> listFiles() {        List<String> result = new ArrayList<>();        // 获取bucket中的文件对象列表        ListObjectsArgs listObjectsArgs = ListObjectsArgs.builder().bucket(minioProperties.getBucket()).build();        Iterable<Result<Item>> objects = minioClient.listObjects(listObjectsArgs);        objects.forEach(obj -> {            try {                Item item = obj.get();                result.add(item.objectName());            } catch (Exception e) {                throw new MinioException("文件服务异常");            }        });        return result;    }    /**     * 获取文件输入流     * @param filePath 文件在bucket中的相对路径     * @return 文件输入流     */    public InputStream getFile(String filePath) {        GetObjectArgs getObjectArgs = GetObjectArgs.builder().bucket(minioProperties.getBucket()).object(filePath).build();        try {            return minioClient.getObject(getObjectArgs);        } catch (Exception e) {            throw new MinioException("文件服务异常");        }    }    /**     * 获取文件参数     * @param filePath 文件在bucket中的相对路径     * @return 文件参数     */    public StatObjectResponse getFileStat(String filePath) {        StatObjectArgs statObjectArgs = StatObjectArgs.builder().bucket(minioProperties.getBucket()).object(filePath).build();        try {            return minioClient.statObject(statObjectArgs);        } catch (Exception e) {            throw new MinioException("文件服务异常");        }    }    /**     * 上传文件     * @param inputStream 文件输入流     * @param filePath 文件在bucket中的相对路径     * @param contentType 文件mime类型     * @param fileSize 文件大小     */    public void uploadFile(InputStream inputStream, String filePath, String contentType, long fileSize) {        PutObjectArgs putObjectArgs = PutObjectArgs.builder().bucket(minioProperties.getBucket()).object(filePath)                .contentType(contentType)                .stream(inputStream, fileSize, -1)                .build();        try {            minioClient.putObject(putObjectArgs);        } catch (Exception e) {            throw new MinioException("文件服务异常");        }    }    /**     * 删除文件     * @param filePath 文件在bucket中的相对路径     */    public void deleteFile(String filePath) {        RemoveObjectArgs removeObjectArgs = RemoveObjectArgs.builder().bucket(minioProperties.getBucket())                .object(filePath).build();        try {            minioClient.removeObject(removeObjectArgs);        } catch (Exception e) {            throw new MinioException("文件服务异常");        }    }    /**     * 获取文件临时url     * @param filePath 文件在bucket中的相对路径     * @return 文件临时url     */    public String getFileTempUrl(String filePath) {        GetPresignedObjectUrlArgs presignedObjectUrlArgs = GetPresignedObjectUrlArgs.builder()                .bucket(minioProperties.getBucket())                .object(filePath) // object的路径                .method(Method.GET) // http请求方式                .expiry(minioProperties.getTempUrlExpire(), TimeUnit.MINUTES) // url过期时间                .build();        try {            return minioClient.getPresignedObjectUrl(presignedObjectUrlArgs);        } catch (Exception e) {            throw new MinioException("文件服务异常");        }    }}
```

### 5)、其中自定义异常MinioException如下

```java
public class MinioException extends RuntimeException {    public MinioException(String message) {        super(message);    }}
```

### 6)、然后在resources下创建META-INF/spring.factories文件,指定自动配置类

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.baobao.minio.MinioAutoConfiguration
```

### 7)、最后install到本地maven仓库,这样在其他springboot工程中就可以使用这个starter了

```xml
<dependency>    <groupId>com.baobao.minio</groupId>    <artifactId>minio-spring-boot-starter</artifactId>    <version>0.0.7-SNAPSHOT</version></dependency>
```

### 8)、使用

```java
@RestController@RequestMapping("minio")public class MinioController {    @Autowired    private MinioService minioService;    @GetMapping("list")    public List<String> list() {        return minioService.listFiles();    }    /**     * 下载文件     *     * @param filePath 文件在bucket中的相对路径     */    @GetMapping("download/{filePath}")    public void download(@PathVariable("filePath") String filePath, HttpServletResponse response) throws Exception {        // 获取要下载的对象的信息        StatObjectResponse stat = minioService.getFileStat(filePath);        // 设置响应文件类型        response.setContentType(stat.contentType());        // 设置下载响应头        response.setHeader("Content-Disposition", "attachment;filename="                + URLEncoder.encode(filePath, "UTF-8"));        // 下载文件流        try (InputStream object = minioService.getFile(filePath);             OutputStream out = response.getOutputStream()) {            IOUtils.copy(object, out);        }    }    @PostMapping("upload")    public void upload(MultipartFile file) throws Exception {        // 上传文件流        try (InputStream in = file.getInputStream()) {            minioService.uploadFile(in, file.getOriginalFilename(), file.getContentType(), file.getSize());        }    }    @DeleteMapping("delete/{filePath}")    public void delete(@PathVariable("filePath") String filePath) {        minioService.deleteFile(filePath);    }    @GetMapping("url")    public String getObjectUrl(String filePath) {        return minioService.getFileTempUrl(filePath);    }}
```
