// noinspection DuplicatedCode
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
// ws subscriptions
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// cache
const cache = new InMemoryCache()

// http
const httpLink = new createHttpLink({
  uri: 'http://localhost:4000/graphql-github',
})

// ws
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql-github/sub',
  options: {
    reconnect: true,
  },
})

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

// https://apollo.vuejs.org/guide/installation.html
const apolloClient = new ApolloClient({
  link,
  cache,
  connectToDevTools: true,
})

Vue.use(VueApollo)
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default Config => (Config['apolloProvider'] = apolloProvider)
