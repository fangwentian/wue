import { Compiler } from '../../index'

const source = document.querySelector('#app').outerHTML

const compiler = new Compiler({
    template: source
})

let { renderFn } = compiler.compile()

compiler.$mount(renderFn)()
