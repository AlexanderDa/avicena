import Vue from 'vue'
import Component from 'vue-class-component'
import ProfessionalModel from '@/models/ProfessionalModel'
import PageService from '@/views/PageService'
import ProfessionalService from '@/services/ProfessionalService'
import Notify from '@/components/action/Notify'
import Delete from '@/components/widget/DeleteWidget.vue'
import { Watch } from 'vue-property-decorator'
import AccountService from '@/services/AccountService'
import UserModel from '@/models/UserModel'
import { errorService } from '@/services/Service'
import RoleService from '@/services/RoleService'
import RoleModel from '@/models/RoleModel'
import UserService from '@/services/UserService'

@Component({
  name: 'ProfessionalAdminPageController',
  components: { Delete }
})
export default class ProfessionalAdminPageController extends Vue
  implements PageService<ProfessionalModel> {
  /********************************************************
    *                      Attributes                       *
    ********************************************************/

  // GUI
  private notyfy: Notify = new Notify()
  private form: boolean = true
  private search: string = ''
  private headers: any[] = []
  public hasAccount: boolean = false

  // Element data
  private elements: ProfessionalModel[] = []
  private elementIndex: number = -1
  private element: ProfessionalModel = new ProfessionalModel()

  // Dependency data

  private user: UserModel = new UserModel()
  private roles: RoleModel[] = []

  /********************************************************
  *                     Initializable                     *
  ********************************************************/

  created (): void {
    this.initHeader()
    this.findRoles()
    this.findElements()
  }

  initHeader (): void {
    this.headers = [
      { text: 'Imagen', value: 'image', align: 'center', sortable: false },
      { text: 'Apellidos', value: 'lastName' },
      { text: 'Nombres', value: 'firstName' },
      { text: 'Correo', value: 'emailAddress' },
      { text: 'Dirección', value: 'address' },
      { text: 'Actions', value: 'action', align: 'center', sortable: false }
    ]
  }

  /********************************************************
  *                    API Services                       *
  ********************************************************/
  createElement (): void {
    const service: ProfessionalService = new ProfessionalService()
    service.create(this.element)
      .then((element: ProfessionalModel) => {
        this.elements.push(element)
        this.notyfy.success('Profesional guardado')
      })
      .catch((err) => { errorService(err) })
  }
  findElements (): void {
    const service: ProfessionalService = new ProfessionalService()
    service.find()
      .then((elements: ProfessionalModel[]) => {
        this.elements = elements
      })
      .catch((err) => { errorService(err) })
  }

  findRoles (): void {
    const service: RoleService = new RoleService()
    service.find()
      .then((elements: RoleModel[]) => {
        this.roles = elements
      })
      .catch((err) => { errorService(err) })
  }
  findUser (id: number): void {
    const service: UserService = new UserService()
    service.findById(id)
      .then((element: UserModel) => {
        this.user = element
      })
      .catch((err) => { errorService(err) })
  }

  updateElement (): void {
    const service: ProfessionalService = new ProfessionalService()
    service.updateById(this.element)
      .then(() => {
        Object.assign(this.elements[this.elementIndex], this.element)
        this.notyfy.success('Profesional actualizado')
      })
      .catch((err) => { errorService(err) })
  }
  deleteElement (element: ProfessionalModel): void {
    const service: ProfessionalService = new ProfessionalService()
    service.deleteById(element.id)
      .then(() => {
        const index = this.elements.indexOf(element)
        this.elements.splice(index, 1)
        this.notyfy.success('Honorario eliminado')
      })
      .catch((err) => { errorService(err) })
  }
  toEditElement (element: ProfessionalModel): void {
    this.elementIndex = this.elements.indexOf(element)
    this.element = Object.assign({}, element)
    if (element.userId) { this.findUser(element.userId) }
    this.hasAccount = !!(element.userId)
    this.form = false
  }
  submit (): void {
    if (this.elementIndex > -1) this.updateElement()
    else this.createElement()
    this.close()
  }

  @Watch('stepper')
  onStepperChange (newValue: number) {
    if (newValue === 2) {
      if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.element.emailAddress)) {
        const service: AccountService = new AccountService()
        service.findByEmail(this.element.emailAddress)
          .then((user: UserModel) => {
            this.user = user
            this.element.userId = user.id
          })
      }
    }
  }

  close (): void {
    this.form = true
    setTimeout(() => {
      this.hasAccount = false
      this.element = Object.assign({}, new ProfessionalModel())
      this.elementIndex = -1
      this.user = new UserModel()
    }, 300)
  }
}
