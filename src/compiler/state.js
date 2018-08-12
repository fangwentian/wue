export default class State {
    constructor() {
        this.state = []
    }

    push(name) {
        this.state.push(name)
    }

    pop(name) {
        if(name === undefined || this.is(name)) {
            this.state.pop()
        }
    }

    is(name) {
        return this.state[this.state.length - 1] === name;
    }
}