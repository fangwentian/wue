import Lexer from './lexer'
import Parser from './parser'
import Codegen from './codegen'

export { Lexer, Parser, Codegen }

export default class Complie {
    constructor({ template }) {
        this.template = template
    }

    compile() {
        const tokens = new Lexer({
            source
        }).lexer()

        const ast = new Parser({
            tokens
        }).parse()

        const renderFnString = new Codegen({
            ast
        }).codegen()

        return {
            renderFn: new Function(
                '_c', '_v', '_e',
                `${renderFnString}`
            )
        }
    }
}