// SOURCE:
// <div id="app">
//     <input type="text" v-model="name">
//     <p>{{name}}</p>
// </div>

// TARGET:
// with(this) {
//     return _c('div', { attrs: { "id": "app" } }, [_c('input', {
//         directives: [{ name: "model", rawName: "v-model", value: (name), expression: "name" }],
//         attrs: { "type": "text" },
//         domProps: { "value": (name) },
//         on: {
//             "input": function($event) {
//                 if ($event.target.composing) return;
//                 name = $event.target.value
//             }
//         }
//     }), _v(" "), _c('p', [_v(_s(name))])])
// }