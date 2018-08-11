import Token from './token'
import State from './state'

const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qname = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qname}`)
const startTagClose = /^(\/?)>/
const attribute = /^([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const whitespace = /^\s+/
// TODO doctype, comment

export default class Lexer {
    constructor({ source = '', options = {} }) {
        this.source = source;
        this.rest = source;
        this.options = options;
        this.tokens = [];
        this.state = [];
    }

    lexer() {
        let token = this.advance();
        while (token && token.type !== 'eof') {
            this.tokens.push(token);
            token = this.advance();
        }
        this.tokens.push(new Token('eof'));
        return this.tokens;
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

        return token;
    }

    skip(length) {
        this.rest = this.rest.slice(length);
    }

    eof() {
        if (this.rest.length > 0) return false;
        return new Token('eof');
    }

    whitespace() {
        const res = whitespace.exec(this.rest)

        if(res) {
            this.skip(res[0].length);
            return new Token('whitespace', res[0]);
        }
        return false;
    }

    startTagOpen() {
        const res = startTagOpen.exec(this.rest);

        if(res) {
            this.state.push('startTagOpen');
            this.skip(res[0].length);
            return new Token('startTagOpen', res[0]);
        }
        return false;
    }

    attribute() {
        if(!this.state.is('startTagOpen')) return false;

        const res = attribute.exec(this.rest);

        if(res) {
            this.skip(res[0].length);
            const name = res[1];
            const value = res[3] || res[4] || res[5];
            return new Token('attribute', { name, value })
        }
        return false;
    }

    startTagClose() {
        
    }

    endTag() {

    }

    text() {

    }














}