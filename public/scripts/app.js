import {formulas, createContext} from "./formula.js"

const context = createContext()

const statements = [
    { name: 'c2', formula: formulas.C, args: [2] },
    { name: 'c2+1', formula: formulas.ADD, args: ['c2', 1] },
    { name: '(c2+1)*3', formula: formulas.MUL, args: ['c2+1', 3] },
]


for (const item of statements) {
    context.put(item)
}


console.log('last statement result:', context.result())

const name = 'c2+1'
console.log(`"${name}" result:${context.result(name)}`)