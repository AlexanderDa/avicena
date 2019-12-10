import Model from './Model'

export default class PeriodModel extends Model {
    public id!: number;
    public startDate!: string ;
    public finishDate!: string ;
    public label!: string;
    public isActive!: string;
}
