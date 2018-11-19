const func = function() {}

export default function callHook(context, hook) {
    const hookFunc = context[hook] || func

    hookFunc.call(context, context.data)
}