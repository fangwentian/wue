export default class Parser {
    constructor({ tokens = [] } = {}) {
        this.tokens = tokens
        this.index = 0
    }

    peek() {
        return this.tokens[this.index]
    }

    consume() {
        this.index++
    }

    skip(type = 'whitespace') {
        while(this.peek().type === type) {
            this.index++
        }
    }

    parse() {
        return this.statements()
    }

    /* 
     * 解析多个并列dom, 如 <span>hello</span><span>world</span>
     */
    statements() {
        let root = []
        while (this.peek().type !== 'eof' && this.peek().type !== 'endTag') {
            const statement = this.statement()
            if (statement) root.push(statement)
        }
        return root
    }

    /* 
     * 解析一层dom，如 <span>hello</span>
     * attribute, startTagClose, endTag 都在tag方法里处理了，不会经过这里
     */
    statement() {
        const token = this.peek();
        switch (token.type) {
            case 'startTagOpen':
                return this.tag()
            case 'whitespace':
            case 'text':
                return this.text()
            default:
                break
        }
    }

    tag() {
        let { type, value, tag, isSelfCloseTag } = this.peek();
        const node = {
            type,
            value,
            tag,
            isSelfCloseTag,
            attributes: {},
            children: []
        }

        // skip startTagOpen
        this.consume()
        this.skip('whitespace')

        // set attributes
        while (this.peek().type === 'attribute') {
            let { value: { name: attrName, value: attrValue } } = this.peek()
            node.attributes[attrName] = attrValue
            this.consume()
            this.skip('whitespace')
        }

        this.skip('whitespace')

        // next should be startTagClose
        if (this.peek().type !== 'startTagClose') {
            throw ('Expect a startTagClose token')
        }

        let _isSelfCloseTag = isSelfCloseTag || this.peek().isSelfCloseTag;

        // skip startTagClose
        this.consume()

        // is current node self close
        if(_isSelfCloseTag) return node

        node.children = this.statements();

        // next should be endTag
        if(this.peek().tag !== node.tag) {
            throw ('Unexpected close tag')
        }

        this.consume()
        return node
    }

    text() {
        let str = ''

        while(['text', 'whitespace'].includes(this.peek().type)) {
            str += this.peek().value
            this.consume()
        }

        return {
            type: 'text',
            value: str
        }
    }

}