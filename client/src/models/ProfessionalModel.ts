import Model from './Model'

export default class ProfessionalModel extends Model {
    public id!: number;
    public lastName!: string;
    public firstName!: string;
    public dni!: string;
    public passport!: string | undefined;
    public telephone!: string | undefined;
    public mobile!: string;
    public emailAddress!: string;
    public address!: string;
    public isHired!:boolean;
    public userId!: number;
}
