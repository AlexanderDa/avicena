import { RouteConfig } from 'vue-router'
const NotFoundRouter: RouteConfig = {
  path: '*',
  name: 'NotFoundPage',
  component: () => import('@/views/404/NotFoundPage.vue')
}
export default NotFoundRouter
