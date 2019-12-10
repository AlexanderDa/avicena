import Vue from 'vue'
import { AppInfo, appInfo } from '../../common'
import Component from 'vue-class-component'
import AccountService from '@/services/AccountService'
import UserModel from '@/models/UserModel'
import RoleModel from '@/models/RoleModel'
import ProfessionalModel from '@/models/ProfessionalModel'
import ProfessionalService from '@/services/ProfessionalService'

@Component({ name: 'AccountPage' })
export default class AccountPageController extends Vue {
  /*********************************************************
   *                      Attributes                       *
   *********************************************************/
  public app: AppInfo = appInfo;
  private me: UserModel = new UserModel()
  private professional: ProfessionalModel = new ProfessionalModel()
  private roles: RoleModel[] = []
  private password: any = {
    newPassError: null,
    repeatedPassError: null,
    diffPassError: null,
    smallPassword: null
  }

  // Image preview
  private imageData: any = null
  private imageFile: any = null
  /*********************************************************
  *                    API Services                       *
  *********************************************************/

  private created () {
    this.findRoles()
    this.initialize()
  }

  private async initialize () {
    const accountService: AccountService = new AccountService()
    const profServise: ProfessionalService = new ProfessionalService()
    const me: UserModel = await accountService.me()
    if (me) {
      this.me = me
      profServise.findByUserId(me.id)
        .then((professional: ProfessionalModel) => {
          this.professional = professional
        })
    }
  }

  findRoles (): void {
    this.$http.get('/api/roles')
      .then((res: any) => {
        this.roles = res.body
      })
  }

  private async changeAvatar () {
    // upload user avatar
  }

  private async updateProfile () {
    this.changeAvatar()
  }

  private async changePass () {
    let isValid: boolean = false

    this.password.newPassError = (this.password.new === undefined)
    this.password.repeatedPassError = (this.password.repeated === undefined)
    this.password.diffPassError = (this.password.new !== this.password.repeated)

    if (this.password.new === this.password.repeated) {
      if (this.password.new === this.password.repeated) {
        this.password.smallPassword = (this.password.new.length < 8 && this.password.repeated.length < 8)
      }
    }

    isValid = (
      (this.password.new !== undefined || this.password.new !== '') &&
      (this.password.repeated !== undefined || this.password.repeated !== '') &&
      this.password.repeated === this.password.new &&
      this.password.new.length >= 8 && this.password.repeated.length >= 8
    )
    if (isValid) {
      // Change the password
    }
  }
  /********************************************************
  *                        Functions                      *
  ********************************************************/

  getRole (roleId: number): string {
    let role: string = ''
    this.roles.forEach((element: RoleModel) => {
      if (element.id === roleId) { role = element.name }
    })
    return role
  }

  /*********************************************************
  *                      Image Preview                    *
  *********************************************************/

  // when a image is selected
  pickFile () {
    // @ts-ignore
    this.$refs.image.click()
  }

  async onFilePicked (event: any) {
    this.imageFile = event.target.files[0]

    const files = event.target.files
    if (this.imageFile !== undefined) {
      const fr = new FileReader()
      fr.readAsDataURL(files[0])
      fr.addEventListener('load', () => {
        this.imageData = fr.result
        this.imageFile = files[0]
      })
    } else {
      this.imageFile = ''
      this.imageData = ''
    }
  }
}
