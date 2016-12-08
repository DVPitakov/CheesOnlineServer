class Step {
    constructor(posOld, posNew, storona = 3, figura = 0, eaten = 0) {
        this._posOld = posOld;
        this._posNew = posNew;
        this._storona = storona;
        this._figura = figura;
        this._eaten = eaten;
        this.isWhite = 0;
    }
};
class MyVec {
    constructor() {
        this.buf = [];
        this.last = -1;    
    }
    push(el) {
        this.last++;
        this.buf[this.last] = el;
    }

    getLast() {
        return this.buf[this.last];
    }

    pop() {
        let res = this.buf[this.last];
        this.last--;
        return res;
    }

    lastNum() {
        return this.last;
    }

    pos(tg) {
        let i = 0;
        for(; i <= this.last && this.buf[i] != tg; i++);
        if (i > this.last) return -1;
        return i;
    }

    copy() {
        let out = new MyVec();
        out.last = this.last;
	console.log(this.buf);
        out.buf = this.buf.map(el=>{return el});
        out.size = this.size;
        return out;
    }
};
exports.Step = Step;
exports.MyVec = MyVec;
