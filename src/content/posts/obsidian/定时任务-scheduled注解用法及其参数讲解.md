---
title: "定时任务@Scheduled注解用法及其参数讲解"
published: 2026-06-29
description: "1. 基本用法 @Scheduled 由Spring定义,用于将方法设置为调度任务。如:方法每隔十秒钟被执行、方法在固定时间点被执行等 1、@Scheduled fixedDelay = 1000 上一个任务结束到下一个任务开始的时间间隔为固定的1秒,任务的执行总是要先等到上一个"
image: ""
tags: []
category: "技术笔记"
draft: false
lang: "zh-CN"
---

# 1. 基本用法

@Scheduled 由Spring定义,用于将方法设置为调度任务。如:方法每隔十秒钟被执行、方法在固定时间点被执行等

1、@Scheduled(fixedDelay = 1000)
上一个任务结束到下一个任务开始的时间间隔为固定的1秒,任务的执行总是要先等到上一个任务的执行结束

2、@Scheduled(fixedRate = 1000)
每间隔1秒钟就会执行任务(如果任务执行的时间超过1秒,则下一个任务在上一个任务结束之后立即执行)

3、@Scheduled(fixedDelay = 1000, initialDelay = 2000)
第一次执行的任务将会延迟2秒钟后才会启动

4、@Scheduled(cron = “0 15 10 15 * ?”)
Cron表达式,每个月的15号上午10点15分开始执行任务

5、在配置文件中配置任务调度的参数

```
@Scheduled(fixedDelayString = "fixedDelay.in.milliseconds")

@Scheduled(fixedRateString="fixedDelay.in.milliseconds")

@Scheduled(fixedRateString="{fixedRate.in.milliseconds}")

@Scheduled(cron = "${cron.expression}")
```

# 2、Cron表达式

Cron表达式是一个字符串,字符串以5或6个空格隔开,分为6或7个域,每一个域代表一个含义,Cron有如下两种语法格式:

(1) Seconds Minutes Hours DayofMonth Month DayofWeek Year
(2)Seconds Minutes Hours DayofMonth Month DayofWeek

(1):表示匹配该域的任意值。假如在Minutes域使用, 即表示每分钟都会触发事件。

(2)?:只能用在DayofMonth和DayofWeek两个域。它也匹配域的任意值,但实际不会。因为DayofMonth和DayofWeek会相互影响。例如想在每月的20日触发调度,不管20日到底是星期几,则只能使用如下写法: 13 13 15 20 * ?, 其中最后一位只能用?,而不能使用*,如果使用*表示不管星期几都会触发,实际上并不是这样。

(3)-:表示范围。例如在Minutes域使用5-20,表示从5分到20分钟每分钟触发一次

(4)/:表示起始时间开始触发,然后每隔固定时间触发一次。例如在Minutes域使用5/20,则意味着5分钟触发一次,而25,45等分别触发一次.

(5),:表示列出枚举值。例如:在Minutes域使用5,20,则意味着在5和20分每分钟触发一次。

(6)L:表示最后,只能出现在DayofWeek和DayofMonth域。如果在DayofWeek域使用5L,意味着在最后的一个星期四触发。

(7)W:表示有效工作日(周一到周五),只能出现在DayofMonth域,系统将在离指定日期的最近的有效工作日触发事件。例如:在 DayofMonth使用5W,如果5日是星期六,则将在最近的工作日:星期五,即4日触发。如果5日是星期天,则在6日(周一)触发;如果5日在星期一到星期五中的一天,则就在5日触发。另外一点,W的最近寻找不会跨过月份 。

(8)LW:这两个字符可以连用,表示在某个月最后一个工作日,即最后一个星期五。

(9)#:用于确定每个月第几个星期几,只能出现在DayofMonth域。例如在4#2,表示某月的第二个星期三。

Cron表达式范例:
每隔5秒执行一次:            @Scheduled(cron = "*/5 * * * * ?")
每隔1分钟执行一次:           @Scheduled(cron = "0 */1 * * * ?")
每天23点执行一次:           @Scheduled(cron = "0 0 23 * * ?")
每天凌晨1点执行一次:          @Scheduled(cron = "0 0 1 * * ?")
每月1号凌晨1点执行一次:      @Scheduled(cron = "0 0 1 1 * ?")
每月最后一天23点执行一次:     @Scheduled(cron = "0 0 23 L * ?")
每周星期天凌晨1点实行一次:     @Scheduled(cron = "0 0 1 ? * L")
在26分、29分、33分执行一次:     @Scheduled(cron = " 0 26,29,33 * * * ?")
每天的0点、13点、18点、21点都执行一次:  @Scheduled(cron = " 0 0 0,13,18,21 * * ?")

# 3、线程

spring scheduled默认是所有定时任务都在一个线程中执行。也就是说定时任务1一直在执行,定时任务2一直在等待定时任务1执行完成。为了避免相互等待的情况,可以为定时任务配置线程池

```
@Configuration
public class ScheduleConfig implements SchedulingConfigurer {
    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.setScheduler(Executors.newScheduledThreadPool(50));
    }
}
```

在程序启动后,会逐步启动50个线程,放在线程池中。每个定时任务会占用1个线程。但是相同的定时任务,执行的时候,还是在同一个线程中。

也可配置异步执行,相同的任务也不会相互影响。

添加配置:

```
@Configuration
@EnableAsync
public class ScheduleConfig {

    @Bean
    public TaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        taskScheduler.setPoolSize(50);
        return taskScheduler;
    }
}
```

在方法上添加注解@Async

```
public class TaskFileScheduleService {

    @Async
    @Scheduled(cron="0 */1 * * * ?")
    public void task1(){

    }

    @Async
    @Scheduled(cron="0 */1 * * * ?")
    public void task2(){

    }
}
```
