import { AccountModel } from "../models/account"
import { AddAccountParams } from "../useCases/account/add-account"

export const mockAccountModel = (type = 0): AccountModel => {
    const typeName = type === 0 ? 'any' : 'valid'
    return {
        id: `${typeName}_id`,
        name: `${typeName}_name`,
        email: `${typeName}_email@email.com`,
        password: `${typeName}_password`
    }
}

export const mockAccountParams = (): AddAccountParams => ({
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
})

export const mockName = (): unknown => ({
    name: 'Raphael'
})
