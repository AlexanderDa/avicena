
import Vue from 'vue'
import { Credentials } from '@/common'
import UserModel from '@/models/UserModel'
export default class AccountService extends Vue {
  async login (credentials: Credentials): Promise<any> {
    return this.$http.post('/api/account/login', credentials)
  }

  async me (): Promise<UserModel> {
    let user: UserModel = new UserModel()
    try {
      const res: any = await this.$http.get('/api/account/me')
      user = res.body
    } catch (err) {
      throw err.body
    }
    return user
  }

  async findByEmail (emailAddress: string): Promise<UserModel> {
    let user: UserModel = new UserModel()
    try {
      const res: any = await this.$http.get(`/api/account/${emailAddress}`)
      user = res.body
    } catch (err) {
      throw err.body
    }
    return user
  }

  async changeAvatar (): Promise<any> {
    return this.$http.get('/api/users')
  }
}
