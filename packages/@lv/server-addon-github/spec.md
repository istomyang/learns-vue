# 数据处理约定

## 账号验证

- 来自前端的数据处理如下，后端验证根据`client_id`是否存在判断用户身份级别。
~~~js
const noOauth = { client_id: '', client_secret: '' }
const hasOauth = { client_id: 'xxx', client_secret: 'xxxx' }
~~~

## 数据结果
- Graphql 返回的数据结构如下：
~~~gql
type Res {
  status: Boolean!
  body: String
  message: String
}
~~~
~~~ts
type GqlRes = {
  status: boolean
  body?: string
  message?: string
}
~~~

## 用户数据结构特定
- 用户状态标识
~~~ts
export enum UserStatus {
  // 正在验证
  oauth = 'oauth',
  // 登陆到后台，保留数据
  login = 'login',
  // 当前用户
  show = 'show',
}
~~~