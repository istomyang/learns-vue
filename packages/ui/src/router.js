import Vue from 'vue'
import VueRouter from 'vue-router'
// https://router.vuejs.org/zh/
Vue.use(VueRouter)

import Home from './page/Home/index'
import Setting from './page/Setting/index.vue'
import Content from './page/Home/src/Content.vue'

const router = new VueRouter({
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
      ],
    },
    {
      // Gallery > Github
      path: 'github',
    },
    {
      path: '*',
      redirect: '/home',
    },
  ],
})

export default router
