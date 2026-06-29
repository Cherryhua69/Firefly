---
title: "C++使用MySQL事务"
published: 2026-06-29
description: "1、被调用方法Mysql相关功能: 2、主代码"
image: ""
tags: ["C++", "MySQL"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

# 1、被调用方法Mysql相关功能:

```cpp
#include "mysql_server.h"
using namespace std;

// 连接数据库
void MySQLServer::Init_sql()
{
    //初始化数据库连接池
    m_connPool = connection_pool::GetInstance();
    m_connPool->init("localhost", m_user, m_passWord, m_databaseName, 3306, m_sql_num, 0);
    //先从连接池中取一个连接
    MYSQL *mysqll = NULL;
    connectionRAII mysqlcon(&mysqll, m_connPool);
    transaction_sql = mysqll;
}

// 开始事务
bool MySQLServer::beginTransaction() {
    if (mysql_query(transaction_sql, "START TRANSACTION") != 0) {
        std::cerr << "Failed to start transaction: " << mysql_error(transaction_sql) << std::endl;
        return false;
    }
    return true;
}

// 提交事务
bool MySQLServer::commitTransaction() {
    if (mysql_query(transaction_sql, "COMMIT") != 0) {
        std::cerr << "Failed to commit transaction: " << mysql_error(transaction_sql) << std::endl;
        return false;
    }
    return true;
}

// 回滚事务
bool MySQLServer::rollbackTransaction() {
    if (mysql_query(transaction_sql, "ROLLBACK") != 0) {
        std::cerr << "Failed to rollback transaction: " << mysql_error(transaction_sql) << std::endl;
        return false;
    }
    return true;
}

// 禁用自动提交模式
bool MySQLServer::disableAutoCommit() {
    if (mysql_autocommit(transaction_sql, 0) != 0) {
        std::cerr << "Failed to disable autocommit: " << mysql_error(transaction_sql) << std::endl;
        return false;
    }
    return true;
}

// 启用自动提交模式
bool MySQLServer::enableAutoCommit() {
    if (mysql_autocommit(transaction_sql, 1) != 0) {
        std::cerr << "Failed to enable autocommit: " << mysql_error(transaction_sql) << std::endl;
        return false;
    }
        return true;
}
```

# 2、主代码

```cpp
try{
    // 开启事务
    mysql_server.beginTransaction();

		// 多个sql语句执行
    // 新增stream_bind_model关联1
    if(!mysql_server.insert_stream_bind_model1(stream_id, insert_bind_model_id)){
        throw std::runtime_error("setbindAlgorithm: Failed to insert_stream_bind_model1");
    }
    // 新增stream_bind_model关联2
    if(!mysql_server.insert_stream_bind_model2(stream_id, insert_bind_model_id)){
        throw std::runtime_error("setbindAlgorithm: Failed to insert_stream_bind_model2");
    }

    mysql_server.commitTransaction();
} catch (const std::exception& ex) {
    // 如果任意更新操作失败,回滚事务
    mysql_server.rollbackTransaction();
    cout<<"setbindAlgorithm:"<< std::string(ex.what())<<endl;
}
```
