import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
    client: null as unknown as MongoClient,

    async open (url: string): Promise<void> {
        this.client = await MongoClient.connect(url)
    },

    async close (): Promise<void> {
        await this.client.close()
    },

    async getCollection (name: string): Promise<Collection> {
        const result = await this.client.db().collection(name)
        return result
    },

    mapper (value: any) {
        const result: any = {}
        for (const element of Object.entries({ ...value })) {
            if (element[0] === '_id') {
                result.id = String(value?._id)
                continue
            }
            result[element[0]] = element[1]
        }
        return result
    }
}
