import { Lexer } from '../../index'

const source = document.querySelector('#app').outerHTML

const tokens = new Lexer({
    source
}).lexer()

console.log(tokens)