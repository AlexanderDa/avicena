
import Vue from 'vue'
import Service from '@/services/Service'
import UserModel from '@/models/UserModel'

export default class UserService extends Vue implements Service<UserModel> {
  async create (element: UserModel): Promise<UserModel> {
    let user: UserModel = new UserModel()
    try {
      const res: any = await this.$http.post('/api/user', element)
      user = res.body
    } catch (err) {
      throw err.body
    }
    return user
  }

  count (): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async find (): Promise<UserModel[]> {
    let list: UserModel[] = []

    try {
      const res: any = await this.$http.get('/api/users')
      list = res.body
    } catch (err) {
      throw err.body
    }
    return list
  }

  findById (id: number): Promise<UserModel> {
    throw new Error('Method not implemented.')
  }

  async updateById (element: UserModel): Promise<boolean> {
    let updated: boolean = false
    element.createdAt = undefined
    element.createdBy = undefined
    element.image = (element.image) ? element.image : undefined
    try {
      const res: any = await this.$http.patch(`/api/user/${element.id}`, element)
      updated = res.ok
    } catch (err) {
      throw err.body
    }
    return updated
  }

  async deleteById (id: number): Promise<boolean> {
    let success: boolean = false
    try {
      const res: any = await this.$http.delete(`/api/user/${id}`)
      success = res.ok
    } catch (err) {
      throw err.body
    }
    return success
  }
}
