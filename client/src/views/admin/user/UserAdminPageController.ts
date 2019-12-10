import Vue from 'vue'
import Component from 'vue-class-component'
import UserModel from '@/models/UserModel'
import RoleModel from '@/models/RoleModel'
import UserService from '@/services/UserService'
import PageService from '@/views/PageService'
import Notify from '@/components/action/Notify'
import Delete from '@/components/widget/DeleteWidget.vue'

@Component({
  name: 'UserAdminPage',
  components: { Delete }
})
export default class UserAdminPage extends Vue
  implements PageService<UserModel> {
  /********************************************************
  *                      Attributes                       *
  *******************************************************/

  // GUI
  private notyfy: Notify = new Notify()
  private dialog: boolean = false
  private search: string = ''
  private headers: any[] = []

  // Element data
  private roles: RoleModel[] = []
  private elements: UserModel[] = []
  private elementIndex: number = -1
  private element: UserModel = new UserModel()

  // Image preview
  private imageData: any = null
  private imageFile: any = null

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
      { text: 'Usuario', value: 'username' },
      { text: 'Correo', value: 'emailAddress' },
      { text: 'Estado', value: 'status', align: 'center' },
      { text: 'Rol', value: 'roleId', align: 'center' },
      { text: 'Actions', value: 'action', sortable: false, align: 'center' }
    ]
  }

  /********************************************************
  *                    API Services                       *
  ********************************************************/

  createElement (): void {
    const service: UserService = new UserService()
    service.create(this.element)
      .then((element: UserModel) => {
        this.elements.push(element)
        this.notyfy.success('Usuario creado')
      })
      .catch(() => { })
  }
  findElements (): void {
    const service: UserService = new UserService()
    service.find()
      .then((elements: UserModel[]) => {
        this.elements = elements
      })
      .catch(() => { })
  }
  findRoles (): void {
    this.$http.get('/api/roles')
      .then((res: any) => {
        this.roles = res.body
      })
  }

  updateElement (): void {
    const service: UserService = new UserService()
    service.updateById(this.element)
      .then(() => {
        Object.assign(this.elements[this.elementIndex], this.element)
        this.notyfy.success('Usuario actualizado')
      })
      .catch(() => { })
  }

  deleteElement (element: UserModel): void {
    const service: UserService = new UserService()
    service.deleteById(element.id)
      .then(() => {
        const index = this.elements.indexOf(element)
        this.elements.splice(index, 1)
        this.notyfy.success('Usuario eliminado')
      })
      .catch(() => { })
  }

  toEditElement (element: UserModel): void {
    this.elementIndex = this.elements.indexOf(element)
    this.element = Object.assign({}, element)
    this.dialog = true
  }
  submit (): void {
    if (this.elementIndex > -1) this.updateElement()
    else this.createElement()
    this.close()
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

  close (): void {
    this.dialog = false
    setTimeout(() => {
      this.element = Object.assign({}, new UserModel())
      this.elementIndex = -1
    }, 300)
  }

  /********************************************************
  *                      Image Preview                    *
  ********************************************************/

  // when a image is selected
  pickFile (): void {
    // @ts-ignore
    this.$refs.image.click()
  }

  onFilePicked (event: any): void {
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
