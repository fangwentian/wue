import callHook from './utils/callHook'
import { Compiler } from './compiler'
import { _c, _l, _s } from './vdom/helpers'
import hydrate from './vdom/hydrate'

export default class Wue {
    constructor(options) {
        let { el, data = {}, methods = {} } = options

        typeof data === 'function' ? data = data.call(null) : ''

        this.el = el

        this.data = data

        this.template = document.querySelector(el).outerHTML || ''

        this.methods = methods

        callHook(this, 'beforeCreate')

        // TODO reactivity

        callHook(this, 'created')
    }

    $get(key) {
        return this.data[key]
    }

    $mount() {
        const { data, template } = this
        const compolier = new Compiler({ template })
        const { renderFn } = compolier.compile()
        const vdom = renderFn.call(this, _c, _l, _s)
        console.log(vdom)

        callHook(this, 'beforeMount')

        hydrate(this.el, vdom)
        
        callHook(this, 'mounted')
    }
}