// Source：
// <div id="app">
//     <input type="text" v-model="name">
//     <p>{{name}}</p>
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
//         _c('p', [_v(_s(name))]),
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
    constructor(ast) {
        this.ast = ast
        this.code = ''
    }

    codegen() {
        if(!Array.isArray(this.ast) || this.ast.length > 0) {
            throw new Error('Expect one root element in template')
        }
        this.gen(this.ast)
    }

    gen(ast) {
        if(Array.isArray(ast)) {
            return ast.map(a = > return gen(a))
        }
        return genNode(ast)
    }

    genNode(node) {
        switch (node.type) {
            case 'tag':
                return this.tag(node)
            case 'text':
                return this.text(node);
            case 'interpolation':
                return this.interpolation(node);
            default:
                return ''
        }
    }

    tag() {
        
    }

    text() {

    }

    interpolation() {

    }

}







