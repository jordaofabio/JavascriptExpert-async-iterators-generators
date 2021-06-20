const assert = require('assert');

const myMap = new Map();

// podem ter qualquer coisa como chave
myMap
    .set(1, 'one')
    .set('Teste', 'two')
    .set(true, () => 'hello')

const myMapWithConstructor = new Map([
    ['1', 'str1'],
    [1, 'num1'],
    [true, 'bool1'],
]);


// console.log('myMap', myMap)
// console.log('myMap.get(1)', myMap.get('one'))

assert.deepStrictEqual(myMap.get(1), 'one');
assert.deepStrictEqual(myMap.get('Teste'), 'two');
assert.deepStrictEqual(myMap.get(true)(), 'hello');

// Em Objects a chave ssó pode ser string ou symbol (number é coergido a string)
const onlyReferenceWorks = { id: 1 }
myMap.set(onlyReferenceWorks, {name: 'Fabio'})
// console.log('myMap', myMap)

assert.deepStrictEqual(myMap.get({ id: 1 }), undefined);
assert.deepStrictEqual(myMap.get(onlyReferenceWorks), {name: 'Fabio'});

// utilitários
// - No Object ssertia Object.keys({a: 1}).length
assert.deepStrictEqual(myMap.size, 4)

// para verificar se um item existe no objeto
// item.key = se nao existe = undefined
// if() = coerçao implicita para boolean e retorna false
// jeito certo em Object é ({ name: 'Fabio' }).hasOwnProperty('name')
assert.ok(myMap.has(onlyReferenceWorks));

// para remover um item do objeto
// delete item.id
// não é performático para o Javascript
assert.ok(myMap.delete(onlyReferenceWorks))

// Não dá para iterar em Objects diretamente
// tem que transformar com Object.entries(item)
assert.deepStrictEqual(JSON.stringify([...myMap]), '[[1,"one"],["Teste","two"],[true,null]]')

// for (const [key, value] of myMap) {
//     console.log({ key, value })
// }

// Object é inseguro, pois dependendo do nome da chave, pode substituir algum comportamento padrão
// ({ }).toString() === '[object Object]
// ({ toString: () => 'Hey' }).toString() === 'Hey'

// qualquer chave pode colidir com as propriedades herdadas do object, como:
// constructor, toString, valueOf e etc.

const actor = {
    name: 'Xuxa da Siva',
    toString: 'Queen: Xuxa da Silva'
}

// não tem restricao de nome de chave
myMap.set(actor)