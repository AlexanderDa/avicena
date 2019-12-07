import { UserRepository } from '../repositories/user.repository'
import { User } from '../models/user.model'
import { repository } from '@loopback/repository'
import { AuditRepository } from '../repositories'
import { Audit } from '../models'

namespace AuditAction {
    export const CREATE = 'crear'
    export const UPDATE = 'actualizar'
    export const DELETE = 'eliminar'
}

export namespace AuditTable {
    export const USER = 'usuario'
    export const PERIOD = 'periodo'
    export const HONORARY = 'honorario'
}

export interface AuditService<U> {
    auditCreated(user: U, tableName: string, elementId: number): Promise<void>
    auditUpdated(
        user: U,
        tableName: string,
        elementId: number,
        log?: string
    ): Promise<void>
    auditDeleted(user: U, tableName: string, elementId: number): Promise<void>
}

export class MyAuditService implements AuditService<User> {
    constructor(
        @repository(UserRepository) public userRepository: UserRepository,
        @repository(AuditRepository) public auditRepository: AuditRepository
    ) {}

    async auditCreated(
        user: User,
        tableName: string,
        elementId: number
    ): Promise<void> {
        const audit: Audit = new Audit({
            createdBy: user.id,
            tableName: tableName,
            action: AuditAction.CREATE,
            elementId: elementId
        })
        await this.auditRepository.save(audit)
    }

    async auditUpdated(
        user: User,
        tableName: string,
        elementId: number,
        log?: string
    ): Promise<void> {
        const audit: Audit = new Audit({
            createdBy: user.id,
            tableName: tableName,
            action: AuditAction.UPDATE,
            elementId: elementId,
            log: log
        })
        await this.auditRepository.save(audit)
    }

    async auditDeleted(
        user: User,
        tableName: string,
        elementId: number
    ): Promise<void> {
        const audit: Audit = new Audit({
            createdBy: user.id,
            tableName: tableName,
            action: AuditAction.UPDATE,
            elementId: elementId
        })
        await this.auditRepository.save(audit)
    }
}
