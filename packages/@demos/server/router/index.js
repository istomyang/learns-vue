const Router = require('@koa/router')
// https://github.com/koajs/router/blob/master/API.md
const router = new Router()

//https://koa.bootcss.com/
router.get('/', (ctx, next) => {
  ctx.body = 'Hey, Koa!'
})

module.exports = app => app.use(router.routes()).use(router.allowedMethods())
