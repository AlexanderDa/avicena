export function randomString(length: number, date?: boolean): string {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$'
    let random = ''
    for (let i = 0; i < length; i++) {
        random += characters.charAt(
            Math.floor(Math.random() * characters.length)
        )
    }
    return date ? `${random}.${Date.now()}` : random
}

export function randomPassword(emailAddress: string): string {
    return `${emailAddress.split('@')[0]}:${randomString(10, false)}`
}
