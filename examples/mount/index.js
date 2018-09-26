import { Compiler } from '../../index'

const source = document.querySelector('#app').outerHTML

const compiler = new Compiler({
    template: source
})

let { renderFn } = compiler.compile()

let instance = {
    data: {
        name: 'fangwentian',
        isShow: true,
        items: ['one', 'two', 'three']
    },
    $get(key) {
        return this.data[key]
    }
}

let vdom = compiler.$mount(instance, renderFn)()

console.log(vdom)
