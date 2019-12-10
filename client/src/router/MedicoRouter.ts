import { RouteConfig } from 'vue-router'
const MedicoRouter: RouteConfig = {
  path: '/medico',
  name: 'MainMedicoPage',
  meta: { onlyLogged: true, role: 'medico' },
  component: () => import('@/views/medico/main/MainMedicoPage.vue'),
  redirect: { name: 'CalendarMedicoPage' },
  children: [
    {
      path: 'calendario',
      name: 'CalendarMedicoPage',
      component: () => import('@/views/medico/calendar/CalendarMedicoPage.vue')
    }
  ]
}
export default MedicoRouter
