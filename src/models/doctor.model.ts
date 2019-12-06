import { model, belongsTo } from '@loopback/repository'
import { property } from '@loopback/repository'
import { MyModel } from '.'
import { Professional } from './professional.model'

@model()
export class Doctor extends MyModel {
 @property({
  type: 'number',
  id: true,
  generated: true
 })
 id?: number

 @belongsTo(() => Professional)
 professionalId: number

 constructor(data?: Partial<Doctor>) {
  super(data)
 }
}

export interface DoctorRelations {
 // describe navigational properties here
}

export type DoctorWithRelations = Doctor & DoctorRelations
