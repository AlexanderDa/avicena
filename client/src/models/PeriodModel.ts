import Model from './Model'

export default class PeriodModel extends Model {
    public startDate!: string | Date
    public finishDate!: string | Date
    public label!: string
    public isActive!: boolean ;
}
