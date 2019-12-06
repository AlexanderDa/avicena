import { Entity, model, property } from '@loopback/repository'

@model()
export class Role extends Entity {
 @property({
  type: 'number',
  id: true,
  generated: true
 })
 id?: number

 @property({
  type: 'string',
  required: false,
  length: 25,
  postgresql: {
   dataType: 'character varying',
   dataLength: 25,
   nullable: 'NO'
  }
 })
 name?: string

 constructor(data?: Partial<Role>) {
  super(data)
 }
}

export interface RoleRelations {
 // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations
