import { createContext } from "./formula.js"

const context = createContext()

context.put('attack', '=', 2228)
context.put('critical-rate', '=', 0.913)
context.put('critical-damage-multiple', '=', 2.07)

context.put('normal-damage', '*', 'attack', 1)
context.put('critical-damage', '*', 'attack', 'critical-damage-multiple')

context.put('1 - critical-rate', '-', 1, 'critical-rate')
context.put('expected-normal-damage', '*', 'normal-damage', '1 - critical-rate')
context.put('expected-critical-damage', '*', 'critical-damage', 'critical-rate')

context.put('expected-damage', '+', 'expected-normal-damage', 'expected-critical-damage')

console.log('* context: ', context.formulas.all())
console.log('* result', context.result())
