---
title: "Springboot中使用kafka"
published: 2026-06-29
description: "1、Kafka的定义 Message Queue MQ ,消息队列中间件; Kafka是一个分布式、支持分区的 partition 、多副本的 replica ,基于zookeeper协调的分布式消息系统,因其可水平扩展和高吞吐率而被广泛使用 2、在SpringBoot中使用Ka"
image: ""
tags: ["Java"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1、Kafka的定义

Message Queue(MQ),消息队列中间件;

Kafka是一个分布式、支持分区的(partition)、多副本的 (replica),基于zookeeper协调的分布式消息系统,因其可水平扩展和高吞吐率而被广泛使用

# 2、在SpringBoot中使用Kafka

## 1、引入依赖

```
<dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
</dependency>
```

## 2、编写配置文件

```
server:
  port: 8081
spring:
  kafka:
    bootstrap-servers: 127.0.0.1:9092
    producer:
      retries: 3
      batch-size: 16384
      buffer-memory: 33554432
      acks: 1
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
    consumer:
      group-id: default-group
      enable-auto-commit: false
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      max-poll-records: 500
    listener:
      # 当每一条记录被消费者监听器(ListenerConsumer)处理之后提交
      # RECORD
      # 当每一批poll()的数据被消费者监听器(ListenerConsumer)处理之后提交
      # BATCH
      # 当每一批poll()的数据被消费者监听器(ListenerConsumer)处理之后,距离上次提交时间大于TIME时提交
      # TIME
      # 当每一批poll()的数据被消费者监听器(ListenerConsumer)处理之后,被处理record数量大于等于COUNT时提交
      # COUNT
      # TIME | COUNT 有一个条件满足时提交
      # COUNT_TIME
      # 当每一批poll()的数据被消费者监听器(ListenerConsumer)处理之后, 手动调用Acknowledgment.acknowledge()后提交
      # MANUAL
      # 手动调用Acknowledgment.acknowledge()后立即提交,一般使用这种
      # MANUAL_IMMEDIATE
      ack-mode: MANUAL_IMMEDIATE
```

## 3、编写消息生产者

```
@RestController
@RequestMapping("/msg")
public class MyKafkaController {
    private final static String TOPIC_NAME = "testA";

    @Autowired
    private KafkaTemplate<String,String> kafkaTemplate;

    @RequestMapping("/send")
    public String sendMessage(){
        kafkaTemplate.send(TOPIC_NAME,0,"key","this is a message!");
        return "send success!";
    }
}
```

## 4、编写消费者

```
@Component
public class MyConsumer {
    @KafkaListener(topics = "testA")
    /*    @KafkaListener(groupId = "testGroup", topicPartitions = {
            @TopicPartition(topic = "topic1", partitions = {"0", "1"}),
            @TopicPartition(topic = "topic2", partitions = "0",
                    partitionOffsets = @PartitionOffset(partition = "1",
                            initialOffset = "100"))
    },concurrency = "3")//concurrency就是同组下的消费者个数,就是并发消费数,建议小于等于分区总数*/
    public void listenGroup(ConsumerRecord<String, String> record,
                            Acknowledgment ack) {
        String value = record.value();
        System.out.println(value);
        System.out.println(record);
        //手动提交offset
        ack.acknowledge();
    }
}
```
