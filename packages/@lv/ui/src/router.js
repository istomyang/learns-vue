import Vue from 'vue'
import VueRouter from 'vue-router'
// https://router.vuejs.org/zh/
Vue.use(VueRouter)

// 动态加载
// https://alexjover.com/blog/lazy-load-in-vue-using-webpack-s-code-splitting/

const Home = () => import('./components/index')
const Setting = () => import('./components/Setting/index')
const Content = () => import('./components/Content.vue')
const DemoPage = () => import('./components/Template/index.vue')

class RouterManagement {
  constructor(config) {
    this.config = config

    // remove last 404 redirect
    const routes = config.routes
    const len = routes.length
    if (routes[len - 1].path === '*') this.redirectRoute = routes.pop()
  }

  inject(config) {
    const routes = this.config.routes
    routes.push(config)
  }

  generate() {
    this.config.routes.push(this.redirectRoute)
    return new VueRouter(this.config)
  }
}

export default new RouterManagement({
  base: '/',
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '',
          components: {
            setting: Setting,
            content: Content,
          },
        },
        {
          path: 'categories/:categoryid/:demoid',
          components: {
            demo: DemoPage,
          },
          props: {
            demo: true,
          },
        },
      ],
    },
    {
      path: '*',
      redirect: '/home',
    },
  ],
})
