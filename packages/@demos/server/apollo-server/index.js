const { ApolloServer } = require('apollo-server-koa')
const { typeDefs, resolvers } = require('./schema')
const { PubSub } = require('apollo-server-koa')

module.exports = async (app, httpServer) => {
  const pubSub = new PubSub()

  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: true,
      subscriptions: {
        path: '/sub',
        onConnect: (connectionParams, webSocket, context) => {
          console.log('WS client is connected!')
        },
        onDisconnect: (webSocket, context) => {
          console.log('WS client is Disconnected!')
        },
      },
      context: () => {
        return {
          pubSub,
        }
      },
    })

    await server.start()
    server.applyMiddleware({
      app,
      path: '/gql',
    })
    server.installSubscriptionHandlers(httpServer)
    console.log(`🚀 Apollo Server ready at http://localhost:5000/gql`)
    console.log(`🚀 Apollo WS Server ready at ws://localhost:5000/sub`)
  } catch (e) {
    console.error(e)
  }
}
