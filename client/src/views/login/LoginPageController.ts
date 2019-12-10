import Vue from 'vue'
import Component from 'vue-class-component'
import AccountService from '@/services/AccountService'

@Component({ name: 'LoginPage' })
export default class LoginPage extends Vue {
  public username: string = '';
  public password: string = '';
  public error: boolean = false;
  public errorMsg: string = '';
  public loading: boolean = false

  public async login () {
    this.loading = true
    const service: AccountService = new AccountService()
    await service.login({
      email: this.username,
      password: this.password
    })
      .then((res: any) => {
        if (res.status === 200) {
          // @ts-ignore
          Vue.http.headers.common['Authorization'] = `Bearer ${res.body.token}`
          localStorage.setItem('token', `Bearer ${res.body.token}`)
          this.$router.push({ name: 'AuthenticationPage' })
        }
      })
      .catch((err: any) => {
        const res: any = err.body.error
        this.error = true
        switch (res.message) {
          case 'BAD_ACCOUNT':
            this.errorMsg = 'La cuenta de usuario no existe.'
            break
          case 'BAD_PASS':
            this.errorMsg = 'La contraseña es incorrecta.'
            this.password = ''
            break
          case 'INACTIVE_USER':
            this.errorMsg = 'Usted no está autorizado.'
            this.password = ''
            this.username = ''
            break

          default:
            this.errorMsg = 'ERROR INTERNO'
            break
        }
      })
    this.loading = false
  }
}
