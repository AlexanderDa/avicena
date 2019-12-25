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
import { Professional } from '../models'
import { ProfessionalRepository } from '../repositories'
import { ProfessionalSpect } from './specs/professional.spect'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings, UserProfile } from '@loopback/security'
import { AuditTable, AuditService } from '../services/audit.service'
import { AuditBindings, AccountBindings, FileBindings } from '../keys'
import { AccountService } from '../services/account.service'
import FileSpects from './specs/file.spect'
import { FileService } from '../services/file.service'

export class ProfessionalController {
    constructor(
        @repository(ProfessionalRepository)
        public professionalRepository: ProfessionalRepository,
        @inject(FileBindings.FILE_SERVICE)
        public fileService: FileService,
        @inject(AccountBindings.ACCOUNT_SERVICE)
        public acountService: AccountService,
        @inject(AuditBindings.AUDIT_SERVICE)
        public auditService: AuditService
    ) {}

    @post('/api/professional', new ProfessionalSpect().created())
    @authenticate('jwt')
    async create(
        @requestBody(new ProfessionalSpect().create())
        professional: Omit<Professional, 'id'>
    ): Promise<Professional> {
        return this.professionalRepository.create(professional)
    }

    @post('/api/professional/{id}/avatar', new FileSpects().created())
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
                    const professional: Professional = await this.professionalRepository.findById(
                        id
                    )
                    let image = ''
                    // eslint-disable-next-line
                    const files: any = req.files
                    // eslint-disable-next-line
                    files.forEach(async (element: any) => {
                        const oldImage: URL | undefined = professional.image
                            ? new URL(professional.image)
                            : undefined
                        image = `${process.env.BASE_URL}/file/image/${element.filename}`
                        await this.professionalRepository.updateById(
                            professional.id,
                            {
                                image: image
                            }
                        )
                        if (oldImage) this.fileService.deleteFile(oldImage)
                    })

                    resolve({
                        url: image
                    })
                }
            })
        })
    }

    @get('/api/professionals/count', new ProfessionalSpect().count())
    @authenticate('jwt')
    async count(
        @param.query.object('where', getWhereSchemaFor(Professional))
        where?: Where<Professional>
    ): Promise<Count> {
        return this.professionalRepository.count(where)
    }

    @get('/api/professionals', new ProfessionalSpect().found())
    @authenticate('jwt')
    async find(
        @param.query.object('filter', getFilterSchemaFor(Professional))
        filter?: Filter<Professional>
    ): Promise<Professional[]> {
        return this.professionalRepository.find(filter)
    }

    @patch('/api/professional', new ProfessionalSpect().count())
    @authenticate('jwt')
    async updateAll(
        @requestBody(new ProfessionalSpect().partial())
        professional: Professional,
        @param.query.object('where', getWhereSchemaFor(Professional))
        where?: Where<Professional>
    ): Promise<Count> {
        return this.professionalRepository.updateAll(professional, where)
    }

    @get('/api/professional/{id}', new ProfessionalSpect().created())
    @authenticate('jwt')
    async findById(
        @param.path.number('id') id: number,
        @param.query.object('filter', getFilterSchemaFor(Professional))
        filter?: Filter<Professional>
    ): Promise<Professional> {
        return this.professionalRepository.findById(id, filter)
    }

    @get('/api/professional/user/{id}', new ProfessionalSpect().created())
    @authenticate('jwt')
    async findByUser(
        @param.path.number('id') id: number
    ): Promise<Professional> {
        const result = await this.professionalRepository.findOne({
            where: { userId: id }
        })

        return new Professional(result || undefined)
    }

    @patch(
        '/api/professional/{id}',
        new ProfessionalSpect().simple('Professional PATCH success')
    )
    @authenticate('jwt')
    async updateById(
        @param.path.number('id') id: number,
        @requestBody(new ProfessionalSpect().partial())
        professional: Professional
    ): Promise<void> {
        await this.professionalRepository.updateById(id, professional)
    }

    @put(
        '/api/professional/{id}',
        new ProfessionalSpect().simple('Professional PUT success')
    )
    @authenticate('jwt')
    async replaceById(
        @param.path.number('id') id: number,
        @requestBody() professional: Professional
    ): Promise<void> {
        await this.professionalRepository.replaceById(id, professional)
    }

    @del(
        '/api/professional/{id}',
        new ProfessionalSpect().simple('Professional DELETE success')
    )
    @authenticate('jwt')
    async deleteById(
        @inject(SecurityBindings.USER) profile: UserProfile,
        @param.path.number('id') id: number
    ): Promise<void> {
        try {
            await this.professionalRepository.deleteById(id)
            await this.auditService.auditDeleted(
                await this.acountService.convertToUser(profile),
                AuditTable.PROFESSIONAL,
                id
            )
        } catch (err) {
            if (err.code === '23503')
                throw new HttpErrors.Conflict('REFERENCED')
            else throw err
        }
    }
}
