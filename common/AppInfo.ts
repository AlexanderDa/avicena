const pkg = require('../../package.json')

export interface AppInfo {
    author: string
    name: string
    description: string
    version: string
}

export const appInfo: AppInfo = {
    author: pkg.author,
    name: pkg.name,
    description: pkg.description,
    version: pkg.version
}
