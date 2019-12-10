import { RouteConfig } from 'vue-router'
const AdminRouter: RouteConfig = {
  path: '/admin',
  name: 'MainAdminPage',
  component: () => import('@/views/admin/main/MainAdminPage.vue'),
  redirect: { name: 'UserAdminPage' },
  meta: { onlyLogged: true, role: 'admin' },
  children: [
    {
      path: 'usuario',
      name: 'UserAdminPage',
      component: () => import('@/views/admin/user/UserAdminPage.vue')
    },
    {
      path: 'periodo',
      name: 'PeriodAdminPage',
      component: () => import('@/views/admin/period/PeriodAdminPage.vue')
    },
    {
      path: 'honorarios',
      name: 'HonoraryAdminPage',
      component: () => import('@/views/admin/honorary/HonoraryAdminPage.vue')
    },
    {
      path: 'profesionales',
      name: 'ProfessionalAdminPage',
      component: () => import('@/views/admin/professional/ProfessionalAdminPage.vue')
    }
  ]
}
export default AdminRouter
