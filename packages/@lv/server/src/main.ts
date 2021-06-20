import Koa from 'koa'
import { createServer } from 'http'
// import router from './router'

// addon
import github from '@lv/server-addon-github'

const init = () => {
  process.env.LV_SERVER_PORT = '4000'
}

async function bootstrap() {
  init()

  // const port = process.env.LV_SERVER_PORT
  const port = 4000

  // Koa server
  const app = new Koa()
  // In koa resource code, app.listen() === createServer(app.callback()).listen(port)
  const httpServer = createServer(app.callback())

  // app.use(async ctx => {
  //   ctx.body = 'Hello World'
  // })

  try {
    // addon: github
    await github(app, httpServer)

    // app.use(router.routes())

    httpServer.listen(port)
    console.log(`🚀 Main Server ready at http://localhost:${port}`)
  } catch (error) {
    throw error
  }
}

bootstrap().catch(e => {
  throw e
})
