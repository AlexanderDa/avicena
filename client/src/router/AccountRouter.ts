import { RouteConfig } from 'vue-router'
const AccountRouter: RouteConfig = {
  path: '/cuenta',
  name: 'AccountPage',
  meta: { onlyLogged: true, role: 'all' },
  component: () => import('@/views/account/AccountPage.vue')
}
export default AccountRouter
