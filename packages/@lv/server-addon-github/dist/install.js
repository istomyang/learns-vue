"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_koa_1 = require("apollo-server-koa");
const common_1 = require("@lv/shared/common");
const console_1 = require("console");
const src_1 = require("./src");
exports.default = async (app, httpServer) => {
    try {
        const pubSub = new src_1.MyPubSub();
        const [[typeDefs, resolvers], dataApi] = await common_1.runAsyncAll(src_1.exportSchema(), src_1.DataApi.init());
        await src_1.addonAuthorize(app, dataApi, pubSub);
        const server = new apollo_server_koa_1.ApolloServer({
            typeDefs,
            resolvers,
            playground: true,
            context: async () => {
                return {
                    pubSub,
                    dataApi,
                };
            },
            subscriptions: {
                path: '/graphql-github/sub',
                onConnect: (connectionParams, webSocket, context) => {
                    console_1.log('WS client is connected!');
                },
                onDisconnect: (webSocket, context) => {
                    console_1.log('WS client is Disconnected!');
                },
            },
        });
        await server.start();
        server.applyMiddleware({
            app,
            path: '/graphql-github',
        });
        server.installSubscriptionHandlers(httpServer);
        const port = parseInt(process.env.LV_SERVER_PORT) || 4000;
        console_1.log(`🚀 Github Graphql Server ready at http://localhost:${port}${server.graphqlPath}`);
        console_1.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`);
    }
    catch (err) {
        throw err;
    }
};
//# sourceMappingURL=install.js.map