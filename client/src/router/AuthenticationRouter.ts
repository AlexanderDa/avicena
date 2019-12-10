import { RouteConfig } from 'vue-router'
const LoginRouter: RouteConfig = {
  path: '/',
  name: 'AuthenticationPage',
  component: () => import('@/views/authentication/AuthenticationPage.vue')
}
export default LoginRouter
