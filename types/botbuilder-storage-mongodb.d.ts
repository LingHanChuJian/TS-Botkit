export interface StoreItems {
    [key: string]: any
}

export interface MongoDbStorageOptions {
    url: string
    database?: string
    collection?: string
}

export class MongoDbStorage {
    constructor(options: MongoDbStorageOptions)

    read(keys: string[]): Promise<StoreItems>

    write(changes: StoreItems): Promise<void>

    delete(keys: string[]): Promise<void>
}
