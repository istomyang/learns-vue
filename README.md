# learns-vue

项目灵感来源于 [Flutter Gallery](https://gallery.flutter.cn/#/)，呈现学习的代码，和展示DEMO。

## 架构
项目由三部分构成：
1. 用于呈现DEMO展示的ui子项目。
2. 连接DEMOS和前端ui的后端子项目。
3. 许多DEMO。

### 要点与想法
+ 子项目具有可替换性和扩展性，比如后端可以Express，也可以用微服务。所以部分之间要遵循一套接口标准。



# 赛



## 快捷

+ Yarn文档：https://yarn.bootcss.com/
+ Lerna 项目地址：https://github.com/lerna/lerna

## 工作区

+ Yarn的工作区与lerna的关系是：后者是前者高层的实现[1]。 如果使用，参见[2]和 4（两者集成）。
+ lerna 两种模式：
  1. Fixed/Locked mode (default) 多个包共用一个版本号，在 lerna.json
  2. Independent mode 每个包单独的版本号
+ yarn workspace 和 lerna 有很多功能重叠，优先 yarn 并且用 lerna 做发布管理3。因为 lerna 无法有效处理 node_modules 的依赖问题 4 6，并且lerna有很多yarn无法处理的高级功能 5。

> [1]https://yarnpkg.com/features/workspaces#yarn-workspaces-vs-lerna
>
> [2] https://github.com/lerna/lerna#getting-started
>
> Lerna的使用：https://github.com/lerna/lerna
>
> 3 https://segmentfault.com/a/1190000025173538
>
> 4 https://yarn.bootcss.com/blog/2017/08/02/introducing-workspaces/
>
> 5 https://yarn.bootcss.com/docs/workspaces/#toc-how-does-it-compare-to-lerna
>
> 6 https://yrq110.me/post/devops/how-lerna-manage-package-dependencies/
