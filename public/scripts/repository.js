/**
 * @typedef {"Model"} Model 
 */
export default class Repository {

    #model

    #keyProvider = () => null

    /**
     * @type {Map<string, Model>}
     */
    #storage = new Map()

    _immutable = false

    /**
     * @param {Class<Model>} model model type
     * @param {(record: Model) => string} primaryKey primary key provider
     * @param {Model[]} records list of model
     */
    constructor(model, records = [], keyProvider = null) {
        this.#model = model
        this.#keyProvider = keyProvider || this.#keyProvider
        this.saveAll(records)
    }

    /**
     * @returns {Model[]}
     */
    all() {
        return Array.from(this.#storage.values())
    }

    /**
     * @param {string} key primary key
     * @returns {Model}
     */
    find(key) {
        return this.#storage.get(key)
    }

    /**
     * @param {string} key 
     * @param {(key: string) => Model} provider 
     * @returns {Model}
     */
    findOrCreate(key, provider) {
        const record = provider(key)
        this.save(record)

        return record
    }

    fetch(fetcher) {
        for (const record of this.all()) {
            if (fetcher(record)) return record
        }
    }

    /**
     * @param {Model} record 
     */
    save(record) {
        this.#storage.set(this.#primaryKey(record), record)
    }

    /**
     * @param {Model[]} records 
     */
    saveAll(records) {
        for (const record of records) {
            this.save(record)
        }
    }

    /**
     * @param {string} key 
     * @returns {boolean}
     */
    destroy(key) {
        return this.#storage.delete(key)
    }

    /**
     * @returns {Class<Model>}
     */
    get model() {
        return this.#model
    }

    /**
     * 
     */
    #primaryKey(record) {
        const key = this.#keyProvider(record) || record[record.primaryKey]

        if (!key) throw 'Could not get primary key.'

        return key
    }
}

export class ImmutableRepository extends Repository {
    _immutable = true
}