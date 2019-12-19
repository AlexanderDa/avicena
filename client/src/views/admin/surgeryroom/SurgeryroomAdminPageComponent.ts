import Vue from 'vue'
import Component from 'vue-class-component'
import SurgeryRoomModel from '@/models/SurgeryRoomModel'
import PageService from '@/views/PageService'
import SurgeryRoomService from '@/services/SurgeryRoomService'
import Notify from '@/components/action/Notify'
import Delete from '@/components/widget/DeleteWidget.vue'
import { errorService } from '@/services/Service'

@Component({
  name: 'SurgeryRoomAdminPageController',
  components: { Delete }
})
export default class SurgeryRoomAdminPageComponent extends Vue implements PageService<SurgeryRoomModel> {
  /********************************************************
    *                      Attributes                       *
    ********************************************************/

  // GUI
  private notyfy: Notify = new Notify()
  private dialog: boolean = false
  private search: string = ''
  private headers: any[] = []

  // Element data
  private elements: SurgeryRoomModel[] = []
  private elementIndex: number = -1
  private element: SurgeryRoomModel = new SurgeryRoomModel()

  /********************************************************
  *                     Initializable                     *
  ********************************************************/

  created (): void {
    this.initHeader()
    this.findElements()
  }

  initHeader (): void {
    this.headers = [
      { text: 'Nombre', align: 'left', value: 'name' },
      { text: 'Valor', align: 'left', value: 'minValue' },
      { text: 'Actions', value: 'action', align: 'center', sortable: false }
    ]
  }

  /********************************************************
  *                    API Services                       *
  ********************************************************/
  createElement (): void {
    const service: SurgeryRoomService = new SurgeryRoomService()
    service.create(this.element)
      .then((element: SurgeryRoomModel) => {
        this.elements.push(element)
        this.notyfy.success('Honorario guardado')
      })
      .catch((err) => { errorService(err) })
  }
  findElements (): void {
    const service: SurgeryRoomService = new SurgeryRoomService()
    service.find()
      .then((elements: SurgeryRoomModel[]) => {
        this.elements = elements
      })
      .catch((err) => { errorService(err) })
  }
  updateElement (): void {
    const service: SurgeryRoomService = new SurgeryRoomService()
    service.updateById(this.element)
      .then(() => {
        Object.assign(this.elements[this.elementIndex], this.element)
        this.notyfy.success('Honorario actualizado')
      })
      .catch((err) => { errorService(err) })
  }
  deleteElement (element: SurgeryRoomModel): void {
    const service: SurgeryRoomService = new SurgeryRoomService()
    service.deleteById(element.id)
      .then(() => {
        const index = this.elements.indexOf(element)
        this.elements.splice(index, 1)
        this.notyfy.success('Honorario eliminado')
      })
      .catch((err) => { errorService(err) })
  }
  toEditElement (element: SurgeryRoomModel): void {
    this.elementIndex = this.elements.indexOf(element)
    this.element = Object.assign({}, element)
    this.dialog = true
  }
  submit (): void {
    if (this.elementIndex > -1) this.updateElement()
    else this.createElement()
    this.close()
  }

  close (): void {
    this.dialog = false
    setTimeout(() => {
      this.element = Object.assign({}, new SurgeryRoomModel())
      this.elementIndex = -1
    }, 300)
  }
}
