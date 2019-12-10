
import Vue from 'vue'
import Service from '@/services/Service'
import HonoraryModel from '@/models/HonoraryModel'

export default class HonoraryService extends Vue implements Service<HonoraryModel> {
  async create (element: HonoraryModel): Promise<HonoraryModel> {
    let honorary: HonoraryModel = new HonoraryModel()
    element.value = Number(element.value)
    element.rate = Number(element.rate)
    element.mps = Number(element.mps)
    try {
      const res: any = await this.$http.post('/api/honorary', element)
      honorary = res.body
    } catch (err) {
      throw err.body
    }
    return honorary
  }
  count (): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async find (): Promise<HonoraryModel[]> {
    let list: HonoraryModel[] = []
    try {
      const res: any = await this.$http.get('/api/honoraries')
      list = res.body
    } catch (err) {
      throw err.body
    }
    return list
  }
  findById (id: number): Promise<HonoraryModel> {
    throw new Error('Method not implemented.')
  }

  async updateById (element: HonoraryModel): Promise<boolean> {
    let updated:boolean = false
    element.createdAt = undefined
    element.createdBy = undefined
    element.value = Number(element.value)
    element.rate = Number(element.rate)
    element.mps = Number(element.mps)
    try {
      const res: any = await this.$http.patch(`/api/honorary/${element.id}`, element)
      updated = res.ok
    } catch (err) {
      throw err.body
    }
    return updated
  }

  async deleteById (id: number): Promise<boolean> {
    let success: boolean = false
    try {
      const res: any = await this.$http.delete(`/api/honorary/${id}`)
      success = res.ok
    } catch (err) {
      throw err.body
    }
    return success
  }
}
