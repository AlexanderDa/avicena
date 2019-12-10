import Vue from 'vue'
import Component from 'vue-class-component'
import { MenuItem } from '@/util'

@Component({
  name: 'MainAdminPage',
  components: {
    Dashboard: () => import('@/components/DashboardComponent.vue')
  }
})
export default class MainAdminPage extends Vue {
  private LeftSideBar: MenuItem[] = [
    { title: 'Usuarios', icon: 'supervisor_account', routerName: 'UserAdminPage' },
    { title: 'Periodos', icon: 'calendar_today', routerName: 'PeriodAdminPage' },
    { title: 'Profesionales', icon: 'work', routerName: 'ProfessionalAdminPage' },
    { title: 'Honorarios', icon: 'monetization_on', routerName: 'HonoraryAdminPage' }
  ]
}
