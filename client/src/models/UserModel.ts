import Model from './Model'

export default class UserModel extends Model {
    public username!: string ;
    public emailAddress!: string ;
    public isActive!: boolean;
    public roleId!: number ;
}
