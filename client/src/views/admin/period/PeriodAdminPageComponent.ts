import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import PeriodService from '@/services/PeriodService'
import PageService from '@/views/PageService'
import PeriodModel from '@/models/PeriodModel'
import Notify from '@/components/action/Notify'
import Delete from '@/components/widget/DeleteWidget.vue'
import DateWidget from '@/components/widget/DateWidget.vue'
import { formatDate } from '@/util'

@Component({
  name: 'PeriodView',
  components: {
    DateWidget,
    Delete
  }
})
export default class PeriodView extends Vue implements PageService<PeriodModel> {
  /********************************************************
  *                      Attributes                       *
  ********************************************************/

  // GUI
  private notyfy: Notify = new Notify()
  private dialog: boolean = false
  private search: string = ''
  private headers: any[] = []

  // Element data
  private elements: PeriodModel[] = []
  private elementIndex: number = -1
  private element: PeriodModel = new PeriodModel()

  /********************************************************
  *                     Initializable                     *
  ********************************************************/

  created (): void {
    this.initHeader()
    this.findElements()
  }

  initHeader (): void {
    this.headers = [
      { text: 'Fecha de Inicio', align: 'left', value: 'startDate' },
      { text: 'Fecha de Cierre', align: 'left', value: 'finishDate' },
      { text: 'Periodo', align: 'left', value: 'label' },
      { text: 'Estado', align: 'center', value: 'status' },
      { text: 'Actions', value: 'action', sortable: false, align: 'center' }
    ]
  }

  /********************************************************
  *                    API Services                       *
  ********************************************************/
  createElement (): void {
    const service: PeriodService = new PeriodService()
    this.thereActives()
    service.create(this.element)
      .then((element: PeriodModel) => {
        element.startDate = formatDate(`${element.startDate}`)
        element.finishDate = formatDate(`${element.finishDate}`)
        this.elements.push(element)
        this.notyfy.success('Periodo guardado')
      })
      .catch(() => { })
  }

  findElements (): void {
    const service: PeriodService = new PeriodService()
    this.elements = []
    service.find()
      .then((elements: PeriodModel[]) => {
        elements.forEach((element: PeriodModel) => {
          element.startDate = formatDate(`${element.startDate}`)
          element.finishDate = formatDate(`${element.finishDate}`)
          this.elements.push(element)
        })
      })
      .catch(() => { })
  }

  updateElement (): void {
    const service: PeriodService = new PeriodService()
    this.thereActives()
    service.updateById(this.element)
      .then(() => {
        Object.assign(this.elements[this.elementIndex], this.element)
        this.notyfy.success('Periodo actualizado')
      })
      .catch(() => { })
  }

  deleteElement (element: PeriodModel): void {
    const service: PeriodService = new PeriodService()
    service.deleteById(element.id)
      .then(() => {
        const index = this.elements.indexOf(element)
        this.elements.splice(index, 1)
        this.notyfy.success('Honorario eliminado')
      })
      .catch(() => { })
  }

  toEditElement (element: PeriodModel): void {
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
      this.element = Object.assign({}, new PeriodModel())
      this.elementIndex = -1
    }, 300)
  }

  // Watch
  @Watch('element.startDate')
  public onStartDateChange () { this.labelDateFormat() }
  @Watch('element.finishDate')
  public onFinishDateChange () { this.labelDateFormat() }

  labelDateFormat (): void {
    let date: string = ''
    const startDate: Date = new Date(this.element.startDate || '')
    const finishDate: Date = new Date(this.element.finishDate || '')

    if (startDate && finishDate) {
      date = `${this.getMonth(startDate.getMonth() + 1)} ${startDate.getFullYear()}`
      date = (this.element.startDate && this.element.finishDate)
        ? `${date} - ` : date
      date = date + `${this.getMonth(finishDate.getMonth() + 1)} ${finishDate.getFullYear()}`

      this.element.label = date
    }
  }

  public thereActives (): void {
    if (this.element.isActive || this.elementIndex === -1) {
      this.elements.forEach((element: PeriodModel, index: number) => {
        if (element.isActive && index !== this.elementIndex) {
          this.notyfy.info(`El periodo ${element.label} está activo, es recomendable desavilitarlo.`)
        }
      })
    }
  }

  getMonth (value: number): string {
    let month: string = ''
    switch (value) {
      case 1: month = 'ENERO'; break
      case 2: month = 'FEBRERO'; break
      case 3: month = 'MARZO'; break
      case 4: month = 'ABRIL'; break
      case 5: month = 'MAYO'; break
      case 6: month = 'JUNIO'; break
      case 7: month = 'JULIO'; break
      case 8: month = 'AGOSTO'; break
      case 9: month = 'SEPTIEMBRE'; break
      case 10: month = 'OCTUBRE'; break
      case 11: month = 'NOVIEMBRE'; break
      case 12: month = 'DICIEMBRE'; break
    }
    return month
  }
}
