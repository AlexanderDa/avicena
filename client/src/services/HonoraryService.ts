
import Vue from 'vue'
import Service from '@/services/Service'
import HonoraryModel from '@/models/HonoraryModel'

export default class HonoraryService extends Vue implements Service<HonoraryModel> {
  async create (element: HonoraryModel): Promise<HonoraryModel> {
    let honorary: HonoraryModel = new HonoraryModel()
    try {
      const res: any = await this.$http.post('/api/honorary', this.formBody(element))
      honorary = res.body
    } catch (err) {
      throw err
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
      throw err
    }
    return list
  }
  findById (id: number): Promise<HonoraryModel> {
    throw new Error('Method not implemented.')
  }

  async updateById (element: HonoraryModel): Promise<boolean> {
    let updated: boolean = false
    try {
      const res: any = await this.$http.patch(`/api/honorary/${element.id}`, this.formBody(element))
      updated = res.ok
    } catch (err) {
      throw err
    }
    return updated
  }

  async deleteById (id: number): Promise<boolean> {
    let success: boolean = false
    try {
      const res: any = await this.$http.delete(`/api/honorary/${id}`)
      success = res.ok
    } catch (err) {
      throw err
    }
    return success
  }

  formBody (element: HonoraryModel): HonoraryModel {
    console.log(element)
    let honorary: HonoraryModel = new HonoraryModel()
    honorary.description = element.description
    honorary.value = Number(element.value)
    honorary.rate = Number(element.rate)
    honorary.mps = Number(element.mps)
    return honorary
  }
}
