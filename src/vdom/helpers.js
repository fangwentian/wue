// 展开属性
const _c = function (name, selfAttrs = {}, children = [], extra = {}) {
    return { name, ...selfAttrs, children, ...extra }
}

// for 指令遍历节点
const _l = function (listkey, callback) {
    return _s.call(this, listkey).map(function(v) {
        return callback.call(this, v)
    }.bind(this))
}

// 取值方法
const _s = function (key) {
    return this.$get(key)
}

export { _c, _l, _s }