const App = () => import('./src/app.vue')
const Login = () => import('./src/components/Login')
const Home = () => import('./src/components/Home')
// const Repo = () => import('./src/components/Repo')
// const Tab = () => import('./src/components/Tab')

export default {
  path: '/github',
  component: App,
  // TODO: 是否选择自动用户登陆
  redirect: { name: 'github_login' },
  children: [
    {
      name: 'github_login',
      path: '/github_login',
      component: Login,
    },
    {
      name: 'github_home',
      path: '/github_home/:username',
      component: Home,
      props: true,
    },
  ],
}
