---
title: "Python中property的使用技巧"
published: 2026-06-29
description: "property属性 一种用起来像是使用实例属性一样的特殊属性,可以对应于某个方法 既要保护类的封装特性,又要让开发者可以使用 对象.属性 的方式操作方法, @property 装饰器 ,可以直接通过方法名来访问方法,不需要在方法名后添加一对 小括号。 来看下求圆的面积的例子 p"
image: ""
tags: ["Python"]
category: "开发笔记"
draft: false
lang: "zh-CN"
---

### property属性

> 一种用起来像是使用实例属性一样的特殊属性,可以对应于某个方法
>

既要保护类的封装特性,又要让开发者可以使用 **对象.属性** 的方式操作方法,`@property 装饰器`,可以直接通过方法名来访问方法,不需要在方法名后添加一对 `()` 小括号。

来看下求圆的面积的例子

```python
class Circle(object):

    PI = 3.14

    def __init__(self, r):
        # r圆的半径
        self.r = r
        self.__area = self.PI * self.r * self.r

    @property
    def area(self):
        return self.__area

    def get_area(self):
        return self.__area

In [2]: c = Circle(10)

In [3]: c.area
Out[3]: 314.0

In [4]: c.get_area()
Out[4]: 314.0
```

**property属性的定义和调用要注意一下几点:**

-

    定义时,在实例方法的基础上添加 `@property` 装饰器;并且仅有一个 `self` 参数

-

    调用时,无需括号 `()`

```python
  实例方法:c.get_area()
  property装饰的方法:c.area
12
```

### 具体实例

对于某商城中显示电脑主机的列表页面,每次请求不可能把数据库中的所有内容都显示到页面上,而是通过分页的功能局部显示,所以在向数据库中请求数据时就要显示的指定获取从第 `m` 条到第 `n`条的所有数据 这个分页的功能包括:

-

    根据用户请求的当前页和总数据条数计算出 m 和 n

-

    根据 m 和 n 去数据库中请求数据

```python
class Pager(object):

    def __init__(self, current_page):

        # 用户当前请求的页码(第一页、第二页...)
        self.current_page = current_page

        # 每页默认显示10条数据
        self.per_items = 10

    @property
    def start(self):
        val = (self.current_page - 1) * self.per_items
        return val

    @property
    def end(self):
        val = self.current_page * self.per_items
        return val

# ipython测验
In [2]: p = Pager(1)

In [3]: p.start		# 就是起始值,即:m
Out[3]: 0

In [4]: p.end		# 就是结束值,即:n
Out[4]: 10

In [5]: p = Pager(2)

In [6]: p.start
Out[6]: 10

In [7]: p.end
Out[7]: 20
```

### property属性的有两种方式

-

    **装饰器** 即:在方法上应用装饰器 `@property`

-

    **类属性** 即:在类中定义值为 `property` 对象的类属性 `property()`

### 装饰器方式

在类的实例方法上应用 `@property` 装饰器

[Python](https://so.csdn.net/so/search?q=Python&spm=1001.2101.3001.7020)中的类有`旧式类` 和 `新式类`,`新式类` 的属性比 `旧式类`的属性丰富。

### 旧式类

旧式类,具有一种 `@property` 装饰器

```python

class Goods:

    def __init__(self, name):
        self.name = name

    @property
    def price(self):
        return 100

# ipython测验
In [10]: g = Goods('手表')

In [11]: g.price
Out[11]: 100
```

### 新式类

新式类,具有三种 `@property` 装饰器

```python

class Goods:
    """
    python3中默认继承object类
    以python2、3执行此程序的结果不同,因为只有在python3中才有@xxx.setter  @xxx.deleter
    """
    @property
    def price(self):
        print('@property')

    @price.setter
    def price(self, value):
        print('@price.setter')

    @price.deleter
    def price(self):
        print('@price.deleter')

# ipython测验
In [13]: g = Goods()

In [14]: g.price
@property

In [15]: g.price = 100
@price.setter

In [16]: del g.price
@price.deleter
```

-

    `g.price` 单独调用自动执行 `@property` 修饰的 `price` 方法,并获取方法的返回值

-

    `g.price = 100` 赋值自动执行 `@price.setter` 修饰的 `price` 方法,并将 `100` 赋值给方法的参数

-

    `del g.price` 删除自动执行 `@price.deleter` 修饰的 `price` 方法

### 注意

-

    旧式类中的属性只有一种访问方式,其对应被 `@property` 修饰的方法

-

    新式类中的属性有三种访问方式,并分别对应了三个被`@property`、`@方法名.setter`、`@方法名.deleter` 修饰的方法

由于新式类中具有三种访问方式,我们可以根据它们几个属性的访问特点,分别将三个方法定义为对同一个属性:获取、修改、删除。

```python
# Goods类@property应用

class Goods(object):

    def __init__(self, name, price):
        # 原价
        self.original_price = price

        # 折扣
        self.discount = 0.8

    @property
    def price(self):
        # 实际价格 = 原价 * 折扣
        new_price = self.original_price * self.discount
        return new_price

    @price.setter
    def price(self, value):
        self.original_price = value

    @price.deleter
    def price(self):
        print('删除商品原价')
        del self.original_price

# ipython测验
In [22]: g = Goods('小米手机', 2000)

In [23]: g.price
Out[23]: 1600.0

In [24]: g.price = 3000

In [25]: g.price
Out[25]: 2400.0

In [26]: del g.price
删除商品原价

In [27]: g.price
---------------------------------------------------------------------------
AttributeError                            Traceback (most recent call last)
<ipython-input-27-38ee45b469f2> in <module>
----> 1 g.price

<ipython-input-18-d5ea66eb7ece> in price(self)
     12     def price(self):
     13         # 实际价格 = 原价 * 折扣
---> 14         new_price = self.original_price * self.discount
     15         return new_price
     16

AttributeError: 'Goods' object has no attribute 'original_price'
```

### 类属性方式

> 创建值为 property 对象的类属性,当使用类属性的方式创建 property 属性时,旧式类 和 新式类无区别
>

```python

class Foo:

    def get_bar(self):
        return 'get_bar'

    BAR = property(get_bar)

# ipython 测验
In [32]: f = Foo()

In [33]: f.BAR
Out[33]: 'get_bar'
```

`f.BAR` 自动调用 `get_bar()` 方法,并获取方法的返回值

`property()` 中有个四个参数

-

    第一个参数是方法名,调用 **对象.属性** 时自动触发执行方法

-

    第二个参数是方法名,调用 **对象.属性 = XXX** 时自动触发执行方法

-

    第三个参数是方法名,调用 **del 对象.属性** 时自动触发执行方法

-

    第四个参数是字符串,调用 **对象.属性._*doc*****_** ,此参数是该属性的描述信息

```python

class Foo(object):

    def __init__(self, bar):
        self.bar = bar

    def get_bar(self):
        print('get_bar')
        return self.bar

    def set_bar(self, value):
        """必须要有两个参数"""
        print('set bar ' + value)
        self.bar = value

    def del_bar(self):
        print('del bar')
        del self.bar

    BAR = property(get_bar, set_bar, del_bar, "bar description...")

# ipython测验
In [50]: f = Foo('python')

In [51]: f.BAR
get_bar
Out[51]: 'python'

In [52]: f.BAR = 'Java'
set bar Java

In [53]: f.BAR
get_bar
Out[53]: 'Java'

In [54]: del f.BAR
del bar
```

### property对象与@property装饰器对比

由于 **类属性方式** 创建 `property` 对象属性具有3种访问方式,我们可以根据它们几个属性的访问特点,分别将三个方法定义为对 **同一个属性:获取、修改、删除** ,跟 `@property` 装饰器对比。

### property对象类属性

```python
# Goods类 property对象类属性 应用

class Goods(object):

    def __init__(self, name, price):
        # 原价
        self.original_price = price

        # 折扣
        self.discount = 0.8

    def get_price(self):
        # 实际价格 = 原价 * 折扣
        new_price = self.original_price * self.discount
        return new_price

    def set_price(self, value):
        self.original_price = value

    def del_price(self):
        print('删除商品原价')
        del self.original_price

    PRICE = property(get_price, set_price, del_price, "price description")

# ipython测验
In [59]: g = Goods('Mac电脑', 9000)

In [60]: g.PRICE
Out[60]: 7200.0

In [61]: g.PRICE = 10000

In [62]: g.PRICE
Out[62]: 8000.0

In [63]: del g.PRICE
删除商品原价
```

### @property装饰器

```python
# Goods类 @property装饰器 应用

class Goods(object):

    def __init__(self, name, price):
        # 原价
        self.original_price = price

        # 折扣
        self.discount = 0.8

    @property
    def price(self):
        # 实际价格 = 原价 * 折扣
        new_price = self.original_price * self.discount
        return new_price

    @price.setter
    def price(self, value):
        self.original_price = value

    @price.deleter
    def price(self):
        print('删除商品原价')
        del self.original_price

# ipython测验
In [59]: g = Goods('Mac电脑', 9000)

In [60]: g.PRICE
Out[60]: 7200.0

In [61]: g.PRICE = 10000

In [62]: g.PRICE
Out[62]: 8000.0

In [63]: del g.PRICE
删除商品原价
```

可以发现两种都可以实现但 `@property` 装饰器的在 旧式类中只有 `@property` , 没有`@method.setter` 和

`@method.deleter`,新式类则两种都可以使用.
