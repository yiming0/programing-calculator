import { formulas, createContext } from "./formula.js"

const context = createContext()

const statements = [
    { name: 'sum', formula: formulas.SUM, args: [1, 2, 'c2+1', '(c2+1)*3'] },
    { name: 'c2', formula: formulas.C, args: [2] },
    { name: 'c2+1', formula: formulas.ADD, args: ['c2', 1] },
    { name: '(c2+1)*3', formula: formulas.MUL, args: ['c2+1', 3] },

    { name: 'attack', formula: formulas.C, args: [2228] },
    { name: 'critical-rate', formula: formulas.C, args: [0.913] },
    { name: 'critical-damage-multiple', formula: formulas.C, args: [2.07] },

    { name: 'normal-damage', formula: formulas.MUL, args: ['attack', 1] },
    { name: 'critical-damage', formula: formulas.MUL, args: ['attack', 'critical-damage-multiple'] },

    { name: '1 - critical-rate', formula: formulas.SUB, args: [1, 'critical-rate'] },
    { name: 'expected-normal-damage', formula: formulas.MUL, args: ['normal-damage', '1 - critical-rate'] },
    { name: 'expected-critical-damage', formula: formulas.MUL, args: ['critical-damage', 'critical-rate'] },

    { name: 'expected-damage', formula: formulas.ADD, args: ['expected-normal-damage', 'expected-critical-damage'] },
]


for (const item of statements) {
    context.put(item)
}

console.log('last statement result:', context.result())

for (const name of context.statements.keys()) {
    console.log(`* ${name}: ${context.result(name)}`)
}
