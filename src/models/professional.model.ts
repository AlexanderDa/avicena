import { model, property, belongsTo } from '@loopback/repository'
import { MyModel } from '.'
import { User } from './user.model'

@model()
export class Professional extends MyModel {
 @property({
  type: 'number',
  id: true,
  generated: true
 })
 id?: number

 @property({
  type: 'string',
  required: true,
  length: 30,
  postgresql: {
   dataType: 'character varying',
   dataLength: 30
  }
 })
 lastName: string

 @property({
  type: 'string',
  required: true,
  length: 30,
  postgresql: {
   dataType: 'character varying',
   dataLength: 30
  }
 })
 firstName: string

 @property({
  type: 'string',
  length: 11,
  postgresql: {
   dataType: 'character varying',
   dataLength: 11
  }
 })
 dni: string

 @property({
  type: 'string',
  length: 15,
  postgresql: {
   dataType: 'character varying',
   dataLength: 15
  }
 })
 passport: string

 @property({
  type: 'string',
  length: 15,
  postgresql: {
   dataType: 'character varying',
   dataLength: 15
  }
 })
 telephone?: string

 @property({
  type: 'string',
  length: 15,
  postgresql: {
   dataType: 'character varying',
   dataLength: 15
  }
 })
 mobile?: string

 @property({
  type: 'string',
  length: 50,
  postgresql: {
   dataType: 'character varying',
   dataLength: 50
  }
 })
 emailAddress?: string

 @property({
  type: 'string',
  length: 25,
  postgresql: {
   dataType: 'character varying',
   dataLength: 25
  }
 })
 regProfessional?: string

 @property({
  type: 'string',
  required: true
 })
 address: string

 @property({
  type: 'boolean',
  default: false
 })
 isHired: boolean

 @belongsTo(() => User)
 userId: number

 constructor(data?: Partial<Professional>) {
  super(data)
 }
}

export interface ProfessionalRelations {
 // describe navigational properties here
}

export type ProfessionalWithRelations = Professional & ProfessionalRelations
