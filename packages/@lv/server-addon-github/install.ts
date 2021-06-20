import { ApolloServer, Config } from 'apollo-server-koa'
import { runAsyncAll } from '@lv/shared/common'
import { log } from 'console'

// TODO: Typedefs and resolvers import
import {
  addonAuthorize,
  DataApi,
  exportSchema,
  Channel,
  PSMInstance,
  PSM,
} from './src'

export default async (app, httpServer) => {
  try {
    // PubSub
    PSMInstance.heartbeat(Channel.INIT)
    PSMInstance.heartbeat(Channel.TOKEN)

    const [[typeDefs, resolvers], dataApi] = await runAsyncAll(
      exportSchema(),
      DataApi.init()
    )

    // addon
    await addonAuthorize(app, dataApi, PSMInstance)

    // https://www.npmjs.com/package/apollo-server-koa
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: true,
      context: async () => {
        return {
          Psm: PSMInstance,
          dataApi,
        }
      },
      // TODO: learn more
      subscriptions: {
        path: '/graphql-github/sub',
        // When client connect to ws server, then show log in terminal
        // onConnect is not a signal of Created a ws Server
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onConnect: (connectionParams, webSocket, context) => {
          log('WS client is connected!')
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onDisconnect: (webSocket, context) => {
          log('WS client is Disconnected!')
        },
      },
    } as Config) /* Fucking TS must declare as Config */

    await server.start()
    server.applyMiddleware({
      app,
      path: '/graphql-github',
    })

    // Sub for 'timer' should use mutation to start timer, then use subscription to receive data
    server.installSubscriptionHandlers(httpServer)

    const port = parseInt(process.env.LV_SERVER_PORT) || 4000

    log(
      `🚀 Github Graphql Server ready at http://localhost:${port}${server.graphqlPath}`
    )
    log(
      `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
    )
  } catch (err) {
    throw err
  }
}
