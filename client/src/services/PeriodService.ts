
import Vue from 'vue'
import Service from '@/services/Service'
import PeriodModel from '@/models/PeriodModel'

export default class PeriodService extends Vue implements Service<PeriodModel> {
  async create (element: PeriodModel): Promise<PeriodModel> {
    let period: PeriodModel = new PeriodModel()
    try {
      const res: any = await this.$http.post('/api/period', this.formBody(element))
      period = res.body
    } catch (err) {
      throw err
    }
    return period
  }
  count (): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async find (): Promise<PeriodModel[]> {
    let list: PeriodModel[] = []

    try {
      const res: any = await this.$http.get('/api/periods')
      list = res.body
    } catch (err) {
      throw err
    }
    return list
  }
  findById (id: number): Promise<PeriodModel> {
    throw new Error('Method not implemented.')
  }

  async updateById (element: PeriodModel): Promise<boolean> {
    let updated: boolean = false
    try {
      const res: any = await this.$http.patch(`/api/period/${element.id}`, this.formBody(element))
      updated = res.ok
    } catch (err) {
      throw err
    }
    return updated
  }

  async deleteById (id: number): Promise<boolean> {
    let success: boolean = false
    try {
      const res: any = await this.$http.delete(`/api/period/${id}`)
      success = res.ok
    } catch (err) {
      throw err
    }
    return success
  }

  formBody (element: PeriodModel): PeriodModel {
    let period:PeriodModel = new PeriodModel()
    period.startDate = new Date(element.startDate || '')
    period.finishDate = new Date(element.finishDate || '')
    period.label = element.label
    period.isActive = element.isActive
    return period
  }
}
