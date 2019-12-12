import Vue from 'vue'
import Component from 'vue-class-component'
import HonoraryModel from '@/models/HonoraryModel'
import PageService from '@/views/PageService'
import HonoraryService from '@/services/HonoraryService'
import Notify from '@/components/action/Notify'
import Delete from '@/components/widget/DeleteWidget.vue'
import { errorService } from '@/services/Service'

@Component({
  name: 'HonoraryAdminPageController',
  components: { Delete }
})
export default class HonoraryAdminPageComponent extends Vue implements PageService<HonoraryModel> {
  /********************************************************
    *                      Attributes                       *
    ********************************************************/

  // GUI
  private notyfy: Notify = new Notify()
  private dialog: boolean = false
  private search: string = ''
  private headers: any[] = []

  // Element data
  private elements: HonoraryModel[] = []
  private elementIndex: number = -1
  private element: HonoraryModel = new HonoraryModel()

  /********************************************************
  *                     Initializable                     *
  ********************************************************/

  created (): void {
    this.initHeader()
    this.findElements()
  }

  initHeader (): void {
    this.headers = [
      { text: 'Descripción', align: 'left', value: 'description' },
      { text: 'Valor', align: 'left', value: 'value' },
      { text: 'Tarífa', align: 'left', value: 'rate' },
      { text: 'MPS', align: 'left', value: 'mps' },
      { text: 'Actions', value: 'action', align: 'center', sortable: false }
    ]
  }

  /********************************************************
  *                    API Services                       *
  ********************************************************/
  createElement (): void {
    const service: HonoraryService = new HonoraryService()
    service.create(this.element)
      .then((element: HonoraryModel) => {
        this.elements.push(element)
        this.notyfy.success('Honorario guardado')
      })
      .catch((err) => { errorService(err) })
  }
  findElements (): void {
    const service: HonoraryService = new HonoraryService()
    service.find()
      .then((elements: HonoraryModel[]) => {
        this.elements = elements
      })
      .catch((err) => { errorService(err) })
  }
  updateElement (): void {
    const service: HonoraryService = new HonoraryService()
    service.updateById(this.element)
      .then(() => {
        Object.assign(this.elements[this.elementIndex], this.element)
        this.notyfy.success('Honorario actualizado')
      })
      .catch((err) => { errorService(err) })
  }
  deleteElement (element: HonoraryModel): void {
    const service: HonoraryService = new HonoraryService()
    service.deleteById(element.id)
      .then(() => {
        const index = this.elements.indexOf(element)
        this.elements.splice(index, 1)
        this.notyfy.success('Honorario eliminado')
      })
      .catch((err) => { errorService(err) })
  }
  toEditElement (element: HonoraryModel): void {
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
      this.element = Object.assign({}, new HonoraryModel())
      this.elementIndex = -1
    }, 300)
  }
}
