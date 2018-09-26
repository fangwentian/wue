// Source：
// <div id="app">
//     <input type="text" v-model="name">
//     <p>hello {{name}} world</p>
//     <p v-if="isShow">if expression</p>
//     <ul>
//         <li v-for="item in items">{{item}}</li>
//     </ul>
// </div>


// Target：
// with(this) {
//     return _c('div', {
//         attrs: {
//             "id": "app"
//         }
//     },
//     [
//         _c('input', {
//             directives: [{
//                 name: "model",
//                 rawName: "v-model",
//                 value: (name),
//                 expression: "name"
//             }],
//             attrs: {
//                 "type": "text"
//             },
//             domProps: {
//                 "value": (name)
//             },
//             on: {
//                 "input": function($event) {
//                     if ($event.target.composing) return;
//                     name = $event.target.value
//                 }
//             }
//         }), 
//         _v(" "), 
//         _c('p', [_v("hello "+_s(name)+" world")]),
//         _v(" "), 
//         (isShow) ? _c('p', [_v("if expression")]) : _e(), 
//         _v(" "), 
//         _c('ul', _l((items),
//             function(item) {
//                 return _c('li', [_v(_s(item))])
//             }
//         ))
//     ])
// }


export default class Codegen {
    constructor({ ast = [] }) {
        this.ast = ast
        this.code = ''
    }

    codegen() {
        if(!Array.isArray(this.ast) || this.ast.length > 1) {
            throw new Error('Expect one root element in template')
        }
        return `return ${this.gen(this.ast)}`
    }

    gen(ast) {
        if(Array.isArray(ast)) {
            return ast.map(a => this.gen(a))
        }
        return this.genNode(ast)
    }

    genNode(node) {
        switch (node.type) {
            case 'tag':
                return this.tag(node)
            case 'text':
                return this.text(node.value);
            case 'interpolation':
                return this.interpolation(node);
            default:
                return ''
        }
    }

    tag(node) {
        let selfAttrs = {}

        selfAttrs.attributes = node.attributes

        selfAttrs.directives = Object.entries(node.directives).map(([key, value]) => {
            return {
                name: key.slice(2),
                rawName: key,
                value: `(${value})`,
                expression: value
            }
        })

        let res = `_c.call(this, '${node.tag}', ${JSON.stringify(selfAttrs)}, [${this.gen(node.children)}])`

        if(node.hasOwnProperty('for') && Object.keys(node.for).length > 0) {
            res = `_l.call(this, '${node.for}', function(${node.alias}) {return ${res}}.bind(this))`
        }

        if(node.hasOwnProperty('if') && Object.keys(node.if).length > 0) {
            res = `(_s.call(this, '${node.if}')) ? ${res} : ${this.text("")}`
        }

        return res;
    }

    text(value) {
        return `_c.call(this, 'text', { attributes: {}, directives: {} }, [], { value: '${value}' })`
    }

    // 'i am {{name}}, {{years}} old' => 
    // ["i am ", "{{name}}", ", ", "{{years}}", " old"] =>
    // ""i am "+_s(name)+", "+_s(years)+" old""
    interpolation(node) {
        let temp = node.value.split(/({{.*?}})/g)
        let str = temp.map((v) => {
            if(/{{.*}}/.test(v)) {
                return `_s.call(this, '${v.replace(/{{|}}/g, '')}')`
            }
            return `'${v}'`
        }).join('+')

        return `_c.call(this, 'text', { attributes: {}, directives: {} }, [], { value: ${str} })`
    }

}







