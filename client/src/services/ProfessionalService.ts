
import Vue from 'vue'
import Service from '@/services/Service'
import ProfessionalModel from '@/models/ProfessionalModel'

export default class ProfessionalService extends Vue implements Service<ProfessionalModel> {
  async create (element: ProfessionalModel): Promise<ProfessionalModel> {
    let professional: ProfessionalModel = new ProfessionalModel()
    try {
      const res: any = await this.$http.post('/api/professional', element)
      professional = res.body
    } catch (err) {
      throw err.body
    }
    return professional
  }
  count (): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async find (): Promise<ProfessionalModel[]> {
    let list: ProfessionalModel[] = []

    try {
      const res: any = await this.$http.get('/api/professionals')
      list = res.body
    } catch (err) {
      throw err.body
    }
    return list
  }
  findById (id: number): Promise<ProfessionalModel> {
    throw new Error('Method not implemented.')
  }

  async findByUserId (userId: number): Promise<ProfessionalModel> {
    let professional: ProfessionalModel = new ProfessionalModel()

    try {
      const res: any = await this.$http.get(`/api/professional/user/${userId}`)
      professional = res.body
    } catch (err) {
      throw err.body
    }
    return professional
  }

  async updateById (element: ProfessionalModel): Promise<boolean> {
    let updated: boolean = false
    try {
      element.createdAt = undefined
      element.createdBy = undefined
      element.telephone = (element.telephone) ? element.telephone : undefined
      element.passport = (element.passport) ? element.passport : undefined
      const res: any = await this.$http.patch(`/api/professional/${element.id}`, element)
      updated = res.ok
    } catch (err) {
      throw err.body
    }
    return updated
  }

  async deleteById (id: number): Promise<boolean> {
    let success: boolean = false
    try {
      const res: any = await this.$http.delete(`/api/professional/${id}`)
      success = res.ok
    } catch (err) {
      throw err.body
    }
    return success
  }
}
