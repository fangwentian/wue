import { Lexer, Parser, Codegen } from '../../index'

const source = document.querySelector('#app').outerHTML

const tokens = new Lexer({
    source
}).lexer()

console.log(tokens);

const ast = new Parser({
    tokens
}).parse()

console.log(ast);

const code = new Codegen({
    ast
}).codegen();

console.log(code)