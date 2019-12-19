
import Vue from 'vue'
import Service from '@/services/Service'
import SurgeryRoomModel from '@/models/SurgeryRoomModel'

export default class SurgeryRoomService extends Vue implements Service<SurgeryRoomModel> {
  async create (element: SurgeryRoomModel): Promise<SurgeryRoomModel> {
    let surgeryroom: SurgeryRoomModel = new SurgeryRoomModel()
    try {
      const res: any = await this.$http.post('/api/surgeryroom', this.formBody(element))
      surgeryroom = res.body
    } catch (err) {
      throw err
    }
    return surgeryroom
  }
  count (): Promise<number> {
    throw new Error('Method not implemented.')
  }
  async find (): Promise<SurgeryRoomModel[]> {
    let list: SurgeryRoomModel[] = []

    try {
      const res: any = await this.$http.get('/api/surgeryrooms')
      list = res.body
    } catch (err) {
      throw err
    }
    return list
  }
  findById (id: number): Promise<SurgeryRoomModel> {
    throw new Error('Method not implemented.')
  }

  async updateById (element: SurgeryRoomModel): Promise<boolean> {
    let updated: boolean = false
    try {
      const res: any = await this.$http.patch(`/api/surgeryroom/${element.id}`, this.formBody(element))
      updated = res.ok
    } catch (err) {
      throw err
    }
    return updated
  }

  async deleteById (id: number): Promise<boolean> {
    let success: boolean = false
    try {
      const res: any = await this.$http.delete(`/api/surgeryroom/${id}`)
      success = res.ok
    } catch (err) {
      throw err
    }
    return success
  }

  formBody (element: SurgeryRoomModel): SurgeryRoomModel {
    let surgeryroom:SurgeryRoomModel = new SurgeryRoomModel()
    surgeryroom.name = element.name
    surgeryroom.minValue = Number(element.minValue)
    return surgeryroom
  }
}
