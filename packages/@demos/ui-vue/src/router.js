import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import A from './components/router/a'
import B from './components/router/b'

const routes = [
  {
    path: '/r/:a',
    component: A,
    props: true,
    children: [{ path: ':b', component: B, props: true }],
  },
]

const router = new Router({
  routes,
})

export default Config => (Config['router'] = router)
