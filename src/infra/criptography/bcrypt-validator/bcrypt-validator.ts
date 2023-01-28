/* eslint-disable @typescript-eslint/no-var-requires */
export let bcrypt: any
try {
    bcrypt = require('bcrypt')
} catch (error) {
    bcrypt = require('bcryptjs')
}
