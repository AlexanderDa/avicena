
import Vue from 'vue'
import Service from '@/services/Service'
import ProfessionalModel from '@/models/ProfessionalModel'

export default class ProfessionalService extends Vue implements Service<ProfessionalModel> {
  async create (element: ProfessionalModel): Promise<ProfessionalModel> {
    let professional: ProfessionalModel = new ProfessionalModel()
    try {
      const res: any = await this.$http.post('/api/professional', this.formBody(element))
      professional = res.body
    } catch (err) {
      throw err
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
      throw err
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
      throw err
    }
    return professional
  }

  async updateById (element: ProfessionalModel): Promise<boolean> {
    let updated: boolean = false
    try {
      const res: any = await this.$http.patch(`/api/professional/${element.id}`, this.formBody(element))
      updated = res.ok
    } catch (err) {
      throw err
    }
    return updated
  }

  async deleteById (id: number): Promise<boolean> {
    let success: boolean = false
    try {
      const res: any = await this.$http.delete(`/api/professional/${id}`)
      success = res.ok
    } catch (err) {
      throw err
    }
    return success
  }

  formBody (element: ProfessionalModel): ProfessionalModel {
    let professional: ProfessionalModel = new ProfessionalModel()
    professional.lastName = element.lastName
    professional.firstName = element.firstName
    professional.dni = (element.dni) ? element.dni : undefined
    professional.passport = (element.passport) ? element.passport : undefined
    professional.telephone = (element.telephone) ? element.telephone : undefined
    professional.mobile = (element.mobile) ? element.mobile : undefined
    professional.emailAddress = element.emailAddress
    professional.address = element.address
    professional.isHired = (element.isHired) ? element.isHired : undefined
    professional.userId = (element.userId) ? element.userId : undefined
    return professional
  }
}
