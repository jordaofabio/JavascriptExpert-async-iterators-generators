const assert = require('assert');

// --- keys
const uniqueKey = Symbol('userName');
const user = {}

user['userName'] = 'value for normal Objects';
user[uniqueKey] = 'value for symbol';

// console.log('getting normal Objects:', user.userName);
// // sempre único em nível de endereço de memória
// console.log('getting normal Objects:', user[Symbol('userName')]);
// console.log('getting normal Objects:', user[uniqueKey]);

assert.deepStrictEqual(user.userName, 'value for normal Objects');

// // sempre único em nível de endereço de memória
assert.deepStrictEqual(user[Symbol('userName')], undefined);
assert.deepStrictEqual(user[uniqueKey], 'value for symbol');

// é difícil de pegar, mas não é secreto
console.log('symbols', Object.getOwnPropertySymbols(user)[0]);

// byPass - má prática
user[Symbol.for('password')] = 123
assert.deepStrictEqual(user[Symbol.for('password')], 123)
// --- keys


// Well Known Symbols
const obj = {
    // iterators
    [Symbol.iterator]: () => ({
        items: ['c', 'b', 'a'],
        next() {
            return {
                done: this.items.length === 0,
                value: this.items.pop()
            }
        }
    })
}

// for(const item of obj) {
//     console.log('item', item)
// }

assert.deepStrictEqual([...obj], ['a', 'b', 'c']);

const kItems = Symbol('kItems')
class MyDate {
    constructor(...args) {
        this[kItems] = args.map(arg => new Date(...arg));
    }
    [Symbol.toPrimitive](coercionType) {
        if (coercionType !==  'string') throw new TypeError();

        const itens = this[kItems]
                        .map(item =>
                            new Intl
                            .DateTimeFormat('pt-BR', { month: 'long', day: '2-digit', year: 'numeric' })
                            .format(item)
                        )
        return new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(itens)
    }

    *[Symbol.iterator]() {
        for (const item of this[kItems]) {
            yield item;
        }
    }

    async *[Symbol.asyncIterator]() {
        const timeout = ms => new Promise(r => setTimeout(r, ms))
        for (const item of this[kItems]) {
            await timeout(100)
            yield item.toISOString()
        }
    }

    get [Symbol.toStringTag]() {
        return 'WHAT?'
    }
}



const myDate = new MyDate(
    [2020, 11, 25],
    [2021, 04, 17]
)

const expectedDates = [ 
    new Date(2020, 11, 25),
    new Date(2021, 04, 17)
]

// console.log('myDate', myDate)
// console.log('myDate', myDate.toString())

assert.deepStrictEqual(Object.prototype.toString.call(myDate), '[object WHAT?]')
assert.throws(() => myDate + 1, TypeError)

// coerção explícita para chamar o toPrimitive
assert.deepStrictEqual(String(myDate), '25 de dezembro de 2020 e 17 de maio de 2021')


// implementar o iterator!
assert.deepStrictEqual([...myDate], expectedDates);

;(async() => {
    for await(const item of myDate) {
        console.log('asyncIterator', item)
    }
})()

;(async() => {
    const dates = await Promise.all([...myDate])
    console.log('expectedDates', dates)
    assert.deepStrictEqual(dates, expectedDates);
})()