import crypto from 'crypto'

export const randomCode = async () => {

    return crypto.randomBytes(2).toString('hex')
}
