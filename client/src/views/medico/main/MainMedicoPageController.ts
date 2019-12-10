import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'MainMedicoPage',
  components: {
    Dashboard: () => import('@/components/DashboardComponent.vue')
  }
})
export default class MainMedicoPage extends Vue {
}
