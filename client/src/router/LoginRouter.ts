import { RouteConfig } from 'vue-router'
const LoginRouter: RouteConfig = {
  path: '/login',
  name: 'LoginPage',
  component: () => import('@/views/login/LoginPage.vue')
}
export default LoginRouter
