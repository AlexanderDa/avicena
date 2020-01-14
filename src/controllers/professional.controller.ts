import * as multer from 'multer'
import { inject } from '@loopback/context'
import { Count } from '@loopback/repository'
import { Filter } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { Where } from '@loopback/repository'
import { post } from '@loopback/rest'
import { HttpErrors } from '@loopback/rest'
import { RestBindings } from '@loopback/rest'
import { Request } from '@loopback/rest'
import { Response } from '@loopback/rest'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'
import { getFilterSchemaFor } from '@loopback/rest'
import { getWhereSchemaFor } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { put } from '@loopback/rest'
import { del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { Personal } from '../models'
import { PersonalRepository } from '../repositories'
import { PersonalSpect } from './specs/personal.spect'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings, UserProfile } from '@loopback/security'
import { AuditTable, AuditService } from '../services/audit.service'
import { AuditBindings, AccountBindings, FileBindings } from '../keys'
import { AccountService } from '../services/account.service'
import FileSpects from './specs/file.spect'
import { FileService } from '../services/file.service'

export class PersonalController {
    constructor(
        @repository(PersonalRepository)
        public personalRepository: PersonalRepository,
        @inject(FileBindings.FILE_SERVICE)
        public fileService: FileService,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/personal', new PersonalSpect().created())
    @authenticate('jwt')
    async create(
        @requestBody(new PersonalSpect().create())
        personal: Omit<Personal, 'id'>
    ): Promise<Personal> {
        return this.personalRepository.create(personal)
    }

    @post('/api/personal/{id}/avatar', new FileSpects().created())
    @authenticate('jwt')
    async createAvatar(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number,
        @requestBody(new FileSpects().create()) req: Request,
        @inject(RestBindings.Http.RESPONSE) res: Response
    ): Promise<object> {
        const storage = this.fileService.imageStorage(req, res)
        const upload = multer({ storage })
        return new Promise<object>((resolve, reject) => {
            // eslint-disable-next-line
            upload.any()(req, res, async err => {
                if (err) reject(err)
                else {
                    const personal: Personal = await this.personalRepository.findById(
                        id
                    )
                    let image = ''
                    // eslint-disable-next-line
                    const files: any = req.files
                    // eslint-disable-next-line
                    files.forEach(async (element: any) => {
                        const oldImage: URL | undefined = personal.image
                            ? new URL(personal.image)
                            : undefined
                        image = `${process.env.BASE_URL}/file/image/${element.filename}`
                        await this.personalRepository.updateById(personal.id, {
                            image: image
                        })
                        if (oldImage) this.fileService.deleteFile(oldImage)
                    })

                    resolve({
                        url: image
                    })
                }
            })
        })
    }

    @get('/api/personals/count', new PersonalSpect().count())
    @authenticate('jwt')
    async count(
        @param.query.object('where', getWhereSchemaFor(Personal))
        where?: Where<Personal>
    ): Promise<Count> {
        return this.personalRepository.count(where)
    }

    @get('/api/personals', new PersonalSpect().found())
    @authenticate('jwt')
    async find(
        @param.query.object('filter', getFilterSchemaFor(Personal))
        filter?: Filter<Personal>
    ): Promise<Personal[]> {
        return this.personalRepository.find(filter)
    }

    @patch('/api/personal', new PersonalSpect().count())
    @authenticate('jwt')
    async updateAll(
        @requestBody(new PersonalSpect().partial())
        personal: Personal,
        @param.query.object('where', getWhereSchemaFor(Personal))
        where?: Where<Personal>
    ): Promise<Count> {
        return this.personalRepository.updateAll(personal, where)
    }

    @get('/api/personal/{id}', new PersonalSpect().created())
    @authenticate('jwt')
    async findById(
        @param.path.number('id') id: number,
        @param.query.object('filter', getFilterSchemaFor(Personal))
        filter?: Filter<Personal>
    ): Promise<Personal> {
        return this.personalRepository.findById(id, filter)
    }

    @get('/api/personal/user/{id}', new PersonalSpect().created())
    @authenticate('jwt')
    async findByUser(@param.path.number('id') id: number): Promise<Personal> {
        const result = await this.personalRepository.findOne({
            where: { userId: id }
        })

        return new Personal(result || undefined)
    }

    @patch(
        '/api/personal/{id}',
        new PersonalSpect().simple('Personal PATCH success')
    )
    @authenticate('jwt')
    async updateById(
        @param.path.number('id') id: number,
        @requestBody(new PersonalSpect().partial())
        personal: Personal
    ): Promise<void> {
        await this.personalRepository.updateById(id, personal)
    }

    @put(
        '/api/personal/{id}',
        new PersonalSpect().simple('Personal PUT success')
    )
    @authenticate('jwt')
    async replaceById(
        @param.path.number('id') id: number,
        @requestBody() personal: Personal
    ): Promise<void> {
        await this.personalRepository.replaceById(id, personal)
    }

    @del(
        '/api/personal/{id}',
        new PersonalSpect().simple('Personal DELETE success')
    )
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.personalRepository.deleteById(id)
            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.PERSONAL,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
