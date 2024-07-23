export default class Formula {
    /**
     * @type {string} 
     */
    #name
    /**
     * @type {function} 
     */
    #defination = () => {
        throw `formula [${this.name}] defination need implements.`
    }

    constructor(name, defination) {
        this.#name = name
        this.#defination = defination || this.#defination
    }

    /**
     * get formula name
     * @returns {string}
     */
    get name() {
        return this.#name
    }

    /**
     * 
     * @param  {...any} args 
     * @returns {number}
     */
    calc(args) {
        return this.#defination.apply(this, args)
    }
}

/**
 * 
 * @param {Formula} formula 
 * @param {Array} args 
 */
export function resolving(context, formula, args) {
    return () => formula.calc(args.map(i => {
        if (context.has(i)) return context.result(i)

        if (isNaN(Number(i))) throw `invalid argument: ${i}`

        return i
    }))
}

/**
 * Formula factory
 * @param {string} name 
 * @param {function} defination 
 * @returns {Formula}
 */
export function factory(name, defination) {
    return new Formula(name, defination)
}

export const formulas = {
    'ADD': factory('ADD', (a, b) => a + b),
    'SUB': factory('SUB', (a, b) => a - b),
    'MUL': factory('MUL', (a, b) => a * b),
    'DIV': factory('DIV', (a, b) => a / b),
    'SUM': factory('SUM', (...a) => a.reduce((sum, i) => sum + i)),
    'C': factory('C', a => a),
}

/**
 * 
 * @returns {{statements: Map<string, function>, result: function} | Map<string, function>}
 */
export function createContext() {
    const context = {
        statements: new Map(),
        get(name) {
            return this.statements.get(name)
        },
        set(name, value) {
            return this.statements.set(name, value)
        },
        has(name) {
            return this.statements.has(name)
        },
        put({ name, formula, args }) {
            // console.log(`put statement: ${formula.name}(${args.join(', ')})`)

            this.set(name, resolving(this, formula, args))
        },
        get last() {
            return [...this.statements.entries()].pop()?.pop()
        },
        result(name = null) {
            let resolve = this.has(name) ? this.get(name) : this.last

            if (typeof resolve !== 'function')
                throw 'context.result: statment not exists.'

            return resolve()
        },
    }

    return context
}