import { storage } from '../config.json'
import { unlinkSync } from 'fs'
import { resolve as resolvePath } from 'path'
import * as multer from 'multer'
import { Request } from '@loopback/rest'
import { Response } from '@loopback/rest'

export interface FileService {
    imageStorage(req: Request, res: Response): multer.StorageEngine
    generateName(file: Express.Multer.File): string
    isAllowedImage(file: Express.Multer.File): boolean
    deleteFile(url: URL): void
}

export class MyFileService implements FileService {
    imageStorage(req: Request, res: Response): multer.StorageEngine {
        const options: multer.DiskStorageOptions = {
            // eslint-disable-next-line
            destination: (req, file, cb) => {
                if (this.isAllowedImage(file))
                    cb(null, resolvePath(`${process.env.LOADING_ROUTE}/images`))
                else throw new Error('INVALID_FORMAT')
            },
            // eslint-disable-next-line
            filename: (req, file, cb) => {
                cb(null, this.generateName(file))
            }
        }
        return multer.diskStorage(options)
    }

    generateName(file: Express.Multer.File): string {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const extension = `.${file.originalname.split('.').pop()}`
        let name = ''
        for (let i = 0; i < 10; i++) {
            name += characters.charAt(
                Math.floor(Math.random() * characters.length)
            )
        }
        return `${name}.${Date.now()}${extension}`
    }

    isAllowedImage(file: Express.Multer.File): boolean {
        let allowed = false
        storage.allowedImages.forEach(element => {
            if (element === file.mimetype) {
                allowed = true
            }
        })
        return allowed
    }

    deleteFile(url: URL): void {
        if (url.origin === process.env.BASE_URL) {
            const filename = url.pathname.split('/').pop()
            const path = `${process.env.LOADING_ROUTE}/images/${filename}`
            unlinkSync(path)
        } else {
            throw new Error('Invalid url')
        }
    }
}
