// 展开属性
const _c = (name, selfAttrs = {}, children = [], extra = {}) => {
    return { name, ...selfAttrs, children, ...extra }
}

// for 指令遍历节点
const _l = (listkey, callback) => {
    return _s(listkey).map((v) => callback(v))
}

// 取值方法
const _s = (key) => {
    return this.$get(key)
}

export { _c, _l, _s }