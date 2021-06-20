import pkg from './package.json'
import icon from './icon.svg'
import bg from './card_bg.png'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import './style/mdi.css'
import './style/hljs.css'
// https://www.npmjs.com/package/apollo-boost
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
// ws subscriptions
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

export default {
  cid: pkg.name,
  card_title: {
    zh: 'Github App',
    en: 'Github App',
  },
  card_summary: {
    zh: '带动后端技术栈和数据类的学习应用。',
    en: 'A learns-app with backend tech stack and data handling.',
  },
  card_icon: icon,
  card_bg: bg,
  router: router.path,
  theme: 'dark',
}

export const install = (Vue, config, RM, SM) => {
  RM.inject(router)
  SM.addModule(store)

  Vue.use(Vuetify)
  const vuetify_opts = {
    icons: {
      iconfont: 'mdi',
    },
  }
  const vuetify = new Vuetify(vuetify_opts)
  Object.defineProperty(config, 'vuetify', {
    value: vuetify,
    enumerable: true,
    writable: true,
    configurable: true,
  })

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
  Object.defineProperty(config, 'apolloProvider', {
    value: apolloProvider,
    enumerable: true,
    writable: true,
    configurable: true,
  })
}
