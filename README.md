# 学习系列：learns-vue

本项目为全栈Web，设计的灵感来自 Flutter Gallery 项目，提供一个写demo和小项目的平台，旨在广泛地涉猎技术栈。

## 亮点

+ 前端的设计尽可能地接近Flutter Gallery项目，跟随大师的设计对培养CSS基本功很有用，另外，数学能让代码从300行减到100行，并提高维护性。

+ 后端Github addon采用GraphQL作为通信媒介，访问Github REST API获取数据，设计有缓存池，采用LRU策略。目前对GraphQL技术的覆盖率比较低，放心，这是数据库能力。

+ 后端是训练JS基本功的天堂，`@lv/shared` 包含数据处理的工具函数，还有对异步的运用，在数学处理上，我更喜欢数学语言，放心，这些核心函数已经通过单元测试：

  ~~~js
  const result = getRandomNumber('[1:100)') // It's cool!
  ~~~

  ~~~js
  // If you get a big data object, well, nothing could be worse than it!
  // Now you can:
  const filterCode = 'a,b,c.d,.e,.f.g,..h.s,.j.r,.k.l.m,n.o.p,..t,..u.v,.w,x,y'
  const result = filterObject(filterCode,source)
  ~~~

+ 好了，慢慢欣赏，不过整个项目的完成度目前依然非常残缺，除了精妙的考量，你还会碰到简单粗暴的操作，颇有C语言的强势作风，不管咋样。。。路漫漫其修远兮(✿◕‿◕✿)

## 架构图

![总架构图](README.assets/总架构图.png)

![Github Server](README.assets/image-20210621234826227.png)
