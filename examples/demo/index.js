import { Wue } from '../../index'

new Wue({
    el: '#app',
    data() {
        return {
            name: 'fangwentian',
            isShow: true,
            items: ['one', 'two', 'three']
        }
    }
}).$mount()