
import Vue from 'vue'
import Service from '@/services/Service'
import UserModel from '@/models/UserModel'

export default class UserService extends Vue implements Service<UserModel> {
  async create (element: UserModel): Promise<UserModel> {
    let user: UserModel = new UserModel()
    try {
      const res: any = await this.$http.post('/api/user', this.formBody(element))
      user = res.body
    } catch (err) {
      throw err
    }
    return user
  }

  async avatar (id: number, data: FormData): Promise<string> {
    let url: string = ''
    try {
      const res: any = await this.$http.post(`/api/user/${id}/avatar`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      url = res.body.url
    } catch (err) {
      throw err
    }
    return url
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
      throw err
    }
    return list
  }

  findById (id: number): Promise<UserModel> {
    throw new Error('Method not implemented.')
  }

  async updateById (element: UserModel): Promise<boolean> {
    let updated: boolean = false
    try {
      const res: any = await this.$http.patch(`/api/user/${element.id}`, this.formBody(element))
      updated = res.ok
    } catch (err) {
      throw err
    }
    return updated
  }

  async deleteById (id: number): Promise<boolean> {
    let success: boolean = false
    try {
      const res: any = await this.$http.delete(`/api/user/${id}`)
      success = res.ok
    } catch (err) {
      throw err
    }
    return success
  }

  formBody (element: UserModel): UserModel {
    let user: UserModel = new UserModel()
    user.username = element.username
    user.emailAddress = element.emailAddress
    user.isActive = element.isActive
    user.roleId = element.roleId
    return user
  }
}
