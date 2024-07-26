import Repository, { ImmutableRepository } from "./repository.js"

export default class Formula {

    #name = 'none'
    #defination = (...args) => args.pop()
    /**
     * calculatable arguments
     * @type {Array<number|Formula>}
     */
    #arguments = []

    get primaryKey() {
        return 'name'
    }

    get name() {
        return this.#name
    }

    get calculatable() {
        return true
    }

    /**
     * 
     */
    constructor(name, defination = null, _arguments = []) {
        this.#name = name || this.#name
        this.#defination = defination || this.#defination
        this.#arguments = _arguments || []
    }

    /**
     * @returns {Array<number|Formula>} calculatable arguments
     */
    get arguments() {
        return this.#arguments
    }

    /**
     * @param {Array<number|Formula>} args calculatable arguments
     */
    use(args) {
        for (const a of args) {
            if (!a.calculatable && isNaN(Number(a)))
                throw `Invalid argument: ${a} for f_[${this.#name}]`
        }

        return new Formula(this.#name, this.#defination, args)
    }

    /**
     * @returns {number}
     */
    calculate() {
        console.log(`[Forumla.calculate], formula: ${this.name}, arguments:`, this.#arguments)
        return this.#defination.apply(this, this.#arguments.map(a => a.calculatable ? a.calculate() : a))
    }
}

class Factory {

    formula(name) {
        switch (name) {
            case '+':
                return this.createADDFormula()
            case '-':
                return this.createSUBFormula()
            case '*':
                return this.createMULFormula()
            case '/':
                return this.createDIVFormula()
            case '=':
                return this.createEqualsFormula()
        }
    }

    createADDFormula() {
        return new Formula('+', (a, b) => {
            if (isNaN(a) || isNaN(b)) throw `Invalid argments form ADD: ${a}, ${b}`

            return a + b
        })
    }

    createSUBFormula() {
        return new Formula('-', (a, b) => {
            if (isNaN(a) || isNaN(b)) throw `Invalid argments form SUB: ${a}, ${b}`

            return a - b
        })
    }

    createMULFormula() {
        return new Formula('*', (a, b) => {
            if (isNaN(a) || isNaN(b)) throw `Invalid argments form MUL: ${a}, ${b}`

            return a * b
        })
    }

    createDIVFormula() {
        return new Formula('/', (a, b) => {
            if (isNaN(a) || isNaN(b)) throw `Invalid argments form DIV: ${a}, ${b}`

            return a / b
        })
    }

    createEqualsFormula() {
        return new Formula('=')
    }

}

/**
 * 
 */
export function createContext() {
    const factory = new Factory()
    const basics = new ImmutableRepository(Formula, [
        factory.formula('+'),
        factory.formula('-'),
        factory.formula('*'),
        factory.formula('/'),
        factory.formula('='),
    ])
    const context = {
        formulas: new Repository(Formula, basics.all()),
        order: [],
        put(name, calculation_name, ..._arguments) {
            const calculation = this.formulas.find(calculation_name)
            if (!calculation) throw `Formula not found: ${calculation_name}`

            const calculatable_arguments = _arguments.map(a => this.formulas.find(a) || a)

            const provider = () => new Formula(name, null, [calculation.use(calculatable_arguments)])
            const formula = this.formulas.findOrCreate(name, provider)

            this.order.push(name)

            return formula
        },
        remove(name) {
            this.formulas.destroy(name)
            this.order = this.order.filter(i => i !== name)
        },
        reorder(sorted = []) {
            this.order.sort((a, b) => {
                const _a = sorted.indexOf(a)
                if (_a === -1) return 0

                const _b = sorted.indexOf(b)
                if (_b === -1) return 0

                return _a - _b
            })
        },
        last() {
            return this.formulas.all().pop()
        },
        result(name = null) {
            let formula = this.formulas.find(name) || this.last()

            if (!formula.calculatable)
                throw 'context.result: statment not exists.'

            return formula.calculate()
        },
    }

    return context
}