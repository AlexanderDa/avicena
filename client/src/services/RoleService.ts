
import Vue from 'vue'
import Service from '@/services/Service'
import RoleModel from '@/models/RoleModel'

export default class RoleService extends Vue {
  count (): Promise<number> {
    throw new Error('Method not implemented.')
  }

  async find (): Promise<RoleModel[]> {
    let list: RoleModel[] = []
    try {
      const res: any = await this.$http.get('/api/roles')
      list = res.body
    } catch (err) {
      throw err
    }
    return list
  }
}
