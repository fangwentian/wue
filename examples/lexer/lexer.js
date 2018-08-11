import { Lexer } from '../../index'

const source = `
    <div id="app">
        <input type="text" v-model="name">
        <p>{{name}}</p>
    </div>
`

const tokens = new Lexer({
    source
}).lexer()

console.log(tokens)