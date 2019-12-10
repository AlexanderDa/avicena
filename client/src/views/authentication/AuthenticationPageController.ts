import Vue from 'vue'
import Component from 'vue-class-component'
import AccountService from '@/services/AccountService'
import UserModel from '@/models/UserModel'

@Component({ name: 'AuthenticationPage' })
export default class AuthenticationPageController extends Vue {
  created () {
    const service: AccountService = new AccountService()
    service.me()
      .then((me: UserModel) => {
        switch (me.roleId) {
          case 1:
            this.$router.push({ name: 'MainAdminPage' })
            break
          case 2:
            this.$router.push({ name: 'MainMedicoPage' })
            break
          default:
            this.$router.push({ name: 'LoginPage' })
            break
        }
      })
      .catch(() => {
        this.$router.push({ name: 'LoginPage' })
      })
  }
}
