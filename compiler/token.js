export class Token {
    constructor(type, value, extra) {
        this.type = type;
        
        if (value) {
            this.value = value;
        }

        if (extra) {
            Object.assign(this, extra);
        }
    }
}