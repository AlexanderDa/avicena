import { Entity, model, property } from '@loopback/repository'

@model()
export class MyModel extends Entity {
 @property({
  type: 'number'
 })
 createdBy?: number

 @property({
  type: 'date',
  default: new Date()
 })
 createdAt?: string

 constructor(data?: Partial<MyModel>) {
  super(data)
 }
}

export interface MyModelRelations {
 // describe navigational properties here
}

export type MyModelWithRelations = MyModel & MyModelRelations
