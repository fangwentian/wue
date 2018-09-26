import Lexer from './lexer'
import Parser from './parser'
import Codegen from './codegen'
import { _c, _l, _s } from '../vdom/helpers'

export default class Compiler {
    constructor({ template }) {
        this.template = template
    }

    compile() {
        const tokens = new Lexer({
            source: this.template
        }).lexer()

        const ast = new Parser({
            tokens
        }).parse()

        let renderFnString = new Codegen({
            ast
        }).codegen()

        renderFnString = renderFnString.replace(/\n/g, '\\n')

        return {
            renderFn: new Function(
                '_c', '_l', '_s',
                `${renderFnString}`
            )
        }
    }

    // only for test
    $mount(instance, renderFn) {
        return renderFn.bind(instance, _c, _l, _s)

    }
}

export { Lexer, Parser, Codegen, Compiler }