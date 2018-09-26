import Token from './token'
import State from './state'

const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qname = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qname}`)
const startTagClose = /^(\/?)>/
const attribute = /^([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const endTag = new RegExp(`^<\\/${qname}[^>]*>`)
const whitespace = /^\s+/
const text = /^[^\x00]/
const selfCloseTag = ['br', 'input', 'img', 'hr']
// TODO doctype, comment

export default class Lexer {
    constructor({ source = '', options = {} } = {}) {
        this.source = source
        this.rest = source
        this.options = options
        this.tokens = []
        this.state = new State()
    }

    lexer() {
        if (this.options.trim) {
            this.rest = this.rest.trim()
        }
        let token = this.advance()
        while (token && token.type !== 'eof') {
            this.tokens.push(token)
            token = this.advance()
        }
        this.tokens.push(new Token('eof'))
        console.log(this.tokens)
        return this.tokens
    }

    advance() {
        const token =
            this.eof() ||
            this.whitespace() ||
            this.startTagOpen() ||
            this.attribute() ||
            this.startTagClose() ||
            this.endTag() ||
            this.text()

        return token
    }

    skip(length) {
        this.rest = this.rest.slice(length)
    }

    eof() {
        if (this.rest.length > 0) return false
        return new Token('eof')
    }

    whitespace() {
        const res = whitespace.exec(this.rest)

        if (res) {
            this.skip(res[0].length)
            return new Token('whitespace', res[0])
        }
        return false
    }

    // startTagOpen的isSelfCloseTag由标签判断，input，br的这些自闭和标签可以直接写成<br>, 通过startTagClose判断不了
    startTagOpen() {
        const res = startTagOpen.exec(this.rest)

        if (res) {
            this.state.push('startTagOpen')
            this.skip(res[0].length)
            return new Token('startTagOpen', res[0], { tag: res[1], isSelfCloseTag: selfCloseTag.includes(res[1]) })
        }
        return false
    }

    attribute() {
        if (!this.state.is('startTagOpen')) return false

        const res = attribute.exec(this.rest)

        if (res) {
            this.skip(res[0].length)
            const name = res[1]
            const value = res[3] || res[4] || res[5]
            return new Token('attribute', { name, value })
        }
        return false
    }

    // startTagClose的isSelfCloseTag由结束符判断，/> 或者 >
    startTagClose() {
        if (!this.state.is('startTagOpen')) return false

        const res = startTagClose.exec(this.rest)

        if (res) {
            this.state.pop()
            this.skip(res[0].length)
            return new Token('startTagClose', res[0], { isSelfCloseTag: Boolean(res[1])})
        }
        return false
    }

    endTag() {
        const res = endTag.exec(this.rest)

        if (res) {
            this.skip(res[0].length)
            return new Token('endTag', res[0], { tag: res[1] })
        }
        return false
    }

    text() {
        if (this.state.is('startTagOpen')) return false

        const res = text.exec(this.rest)

        if (res) {
            this.skip(res[0].length)
            return new Token('text', res[0])
        }
        return false
    }
}