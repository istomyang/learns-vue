// const Koa = require('koa')
// const { createServer } = require('http')
// const install_router = require('./router')
// const install_apollo = require('./apollo-server')
//
// async function bootstrap() {
//   try {
//     const app = new Koa()
//     const httpServer = createServer(app.callback())
//
//     // config
//     const port = 5000
//
//     // install
//     install_router(app)
//     await install_apollo(app, httpServer)
//
//     httpServer.listen({
//       port,
//     })
//     console.log(`🚀 Main Server ready at http://localhost:${port}`)
//   } catch (e) {
//     console.error(e)
//   }
// }
//
// bootstrap().then()
const hljs = require('highlight.js')
html = hljs.highlightAuto(`console.log(123)`).value
console.log(html)
