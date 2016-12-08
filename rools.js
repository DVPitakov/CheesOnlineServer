var Step = require('./myvec.js').Step;
var MyVec = require('./myvec.js').MyVec;

const LADIA = 1;
const KON = 2;
const SLON = 3;
const FERZ = 4;
const KOROL = 5;
const PESHKA = 6;

const startMas =
    [
        1,2,3,4,5,3,2,1,
        6,6,6,6,6,6,6,6,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        6,6,6,6,6,6,6,6,
        1,2,3,4,5,3,2,1
    ];

const startSto = 
    [
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,
        1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1
    ];

class BoardLogic {
    constructor() {
        this.curColor = 0;
        this.sto = startSto.map(el=>{return el})
        this.mas = startMas.map(el=>{return el});
        this.target = 64;
        this.history = new MyVec();
        this.hodil = [];
        for(let i; i < 64; i++) {
            this.hodil.push(0);
        }
    }
    isEmpty(_pos) {return this.mas[_pos] == 0;}
    isRival(pos1, pos2) {return this.sto[pos1] != this.sto[pos2];}
    kingPos(kingColor) {
        for (var i = 0; i < 64; i++) {
            if ((this.mas[i] == KOROL) && (this.sto[i] == kingColor)) {
                return i;
            }
        }
    }

    backStep() {
        let st = this.history.pop();
        this.mas[st._posOld] = this.mas[st._posNew];
        if(st._eaten) {
            this.mas[st._posNew] = st._eaten;
            this.sto[st._posOld] = st._storona;
            this.sto[st._posNew] = 1 - st._storona;
        }
        else {
            this.mas[st._posNew] = 0;
        }
        this.curColor = st._storona;

    }

    moveFig(pos1, pos2, b) {
        if (this.target != 64  || (this.sto[pos1] != this.curColor)) {
            return 3;
        }
        if ((this.mas[pos1] == 0)) return 1;
        let avaliable = this.steps(pos1);
        if (avaliable.pos(pos2) == -1) { return 3;}
        this.history.push(new Step(pos1, pos2, this.sto[pos1], this.mas[pos1], this.mas[pos2]));
        if ((this.mas[pos1] == PESHKA) && (this.mas[pos2] == 0) && (pos2 - pos1 != 8) && (pos1 - pos2 !=8) && (pos2 - pos1 != 16) && (pos1 - pos2 !=16)) {
            let len;
            if (this.sto[pos1]) len = + 8; else len = - 8;
            if (this.mas[pos2 + len] == PESHKA) {
                this.mas[pos2 + len] = 0;
                this.sto[pos2 + len] = 0;
            }

        }
        if ((this.mas[pos1] == PESHKA) && (((pos2 / 8 == 0) &&  (this.curColor))|| ((pos2 / 8 == 7) && (!this.curColor)))) {
        }
        if ((this.mas[pos1] == KOROL) && ((pos2 - pos1) == 2)) {

            this.hodil[pos1 + 3] = 1;
            this.mas[pos2] = this.mas[pos1];
            this.mas[pos1] = 0;
            this.mas[pos1 + 1] = this.mas[pos1 + 3];
            this.mas[pos1 + 3] = 0;
        }
        else {
            if ((this.mas[pos1] == KOROL) && ((pos1 - pos2) == 2)) {
                this.hodil[pos1 - 4] = 1;
                this.mas[pos2] = this.mas[pos1];
                this.mas[pos1] = 0;
                this.mas[pos1 - 1] = this.mas[pos1 - 4];
                this.mas[pos1 - 4] = 0;
            }
            else {
                this.mas[pos2] = this.mas[pos1];
                this.sto[pos2] = this.sto[pos1];
            }
            this.hodil[pos1] = 1;
            this.hodil[pos2] = 1;
            this.mas[pos1] = 0;
        }
        if (this.podUdarom(this.kingPos(this.curColor))) {
            this.backStep();
            return 2;
        }

        if (b && (this.mas[pos2] == PESHKA) && (((pos2 / 8) == 0) || ((pos2 / 8) == 7))) {
            this.target = pos2;
            return 4;
        }

        if (b && thisIsVictory()) {
            return 25;
        }
        this.curColor = 1 - this.curColor;
        return 0;
    }
    
    podUdarom(pos1) {
        let x0 = pos1 % 8;
        let y0 = pos1 / 8;
        let x1 = x0;
        let y1 = y0 << 3;
        let pos = pos1;
        let cend = pos - 9 * ((x0 > y0)?y0:x0);
        let cbuf;

        for (cbuf = pos - 9; cbuf >= cend && this.mas[cbuf] == 0; cbuf -= 9);
        if (cbuf >= cend && ((this.mas[cbuf]) == SLON || (this.mas[cbuf]) == FERZ) && this.isRival(pos,cbuf)) return true;

        cend = pos + 9 * ((x0 > y0)?(7-x0):(7-y0));
        for (cbuf = pos + 9; cbuf <= cend && this.mas[cbuf] == 0; cbuf += 9);
        if (cbuf <= cend && (((this.mas[cbuf]) == SLON) || (this.mas[cbuf]) == FERZ) && this.isRival(pos,cbuf)) return true;

        cend = pos + 7 * ((x0 < (7 - y0))?x0:(7 - y0));
        for (cbuf = pos + 7; cbuf <= cend && this.mas[cbuf] == 0; cbuf += 7);
        if (cbuf <= cend && (((this.mas[cbuf]) == SLON) || (this.mas[cbuf]) == FERZ) && this.isRival(pos,cbuf)) return true;

        cend = pos - 7 * ((7 - x0 < y0)?(7 - x0):y0);
        for (cbuf = pos - 7; cbuf >= cend && this.mas[cbuf] == 0; cbuf -= 7);
        if (cbuf >= cend && ((this.mas[cbuf] == SLON) || (this.mas[cbuf]) == FERZ) &&  this.isRival(pos,cbuf)) return true;
        x1 = x0;
        y1 = y0 << 3;
        x1--;
        while(x1 >= 0 && (this.mas[x1 + y1] == 0)) x1--;
        if (x1 >= 0 && ((this.mas[x1 + y1]) == LADIA || (this.mas[x1 + y1]) == FERZ) && this.isRival(pos,x1 + y1)) return true;

        x1 = x0 + 1;
        while(x1 < 8 && (this.mas[x1 + y1] == 0)) x1++;
        if (x1 < 8 && ((this.mas[x1 + y1]) == LADIA || (this.mas[x1 + y1]) == FERZ) && this.isRival(pos,x1 + y1)) return true;

        x1 = x0;
        y1 -= 8;
        while(y1 >= 0 && (this.mas[x1 + y1] == 0)) y1 -= 8;
        if (y1 >= 0  && ((this.mas[x1 + y1]) == LADIA || (this.mas[x1 + y1]) == FERZ) && this.isRival(pos,x1 + y1)) return true;

        y1 = y0 << 3;
        y1 += 8;
        while(y1 < 64 && (this.mas[x1 + y1] == 0))
            y1 += 8;
        if (y1 < 64 && ((this.mas[x1 + y1]) == LADIA || (this.mas[x1 + y1]) == FERZ) && this.isRival(pos,x1 + y1)) return true;

        x1 = x0;
        y1 = y0 << 3;
        if (x1 < 7 && y1 >= 16 && ((this.mas[x1 + y1 - 15]) == 2) && this.isRival(pos,x1 + y1 - 15)) return true;
        if (x1 > 0 && y1 >= 16 && ((this.mas[x1 + y1 - 17]) == 2) && this.isRival(pos,x1 + y1 - 17)) return true;
        if (x1 < 6 && y1 >= 8 &&  ((this.mas[x1 + y1 - 6]) == 2) && this.isRival(pos,x1 + y1 - 6)) return true;
        if (x1 > 1 && y1 >= 8 &&  ((this.mas[x1 + y1 - 10]) == 2) && this.isRival(pos,x1 + y1 - 10)) return true;

        if (x1 < 7 && y1 < 48 && (((this.mas[x1 + y1 + 17]) == 2) && this.isRival(pos,x1 + y1 + 17))) return true;
        if (x1 > 0 && y1 < 48 && (((this.mas[x1 + y1 + 15]) == 2) && this.isRival(pos,x1 + y1 + 15))) return true;
        if (x1 < 6 && y1 < 56 && (((this.mas[x1 + y1 + 10]) == 2) && this.isRival(pos,x1 + y1 + 10))) return true;
        if (x1 > 1 && y1 < 56 && (((this.mas[x1 + y1 + 6]) == 2) && this.isRival(pos,x1 + y1 + 6))) return true;

        if (this.sto[pos]) {
            if ((y1 > 8) && (x1 > 0) && ((this.mas[pos - 9]) == PESHKA) && this.isRival(pos, pos - 9)) return true;
            if ((y1 > 8) && (x1 < 7) && ((this.mas[pos - 7]) == PESHKA) && this.isRival(pos, pos - 7)) return true;
            if (this.mas[pos] == PESHKA) {
                if (y1 == 32 && this.history.lastNum() != -1) {
                    let st = this.history.getLast();
                    if ((st._figura == PESHKA) && ( st._posNew - st._posOld  == -16 && st._posNew == pos))
                    {
                        if (x0 > 0 && this.mas[pos - 1] == PESHKA && this.isRival(pos,pos - 1)) return true;
                        if (x0 < 7 && this.mas[pos + 1] == PESHKA && this.isRival(pos,pos + 1)) return true;

                    }
                }
            }
        }
        else {
            if ((y1 < 48) && (x1 > 0) && (( this.mas[x1 + y1 + 7])) == PESHKA && this.isRival(pos,x1 + y1 + 7)) return true;
            if ((y1 < 48) && (x1 < 7) && (( this.mas[x1 + y1 + 9])) == PESHKA && this.isRival(pos,x1 + y1 + 9)) return true;
            if (this.mas[pos] == PESHKA) {
                if (y1 == 24 && this.history.lastNum() != -1) {
                    let st = this.history.getLast();
                    if ((st._figura == PESHKA) && ( st._posNew - st._posOld  == 16 && st._posNew == pos))
                    {
                        if (x0 > 0 && this.mas[pos - 1] == PESHKA && this.isRival(pos,pos - 1)) {return true;}
                        if (x0 < 7 && this.mas[pos + 1] == PESHKA && this.isRival(pos,pos + 1)) {return true;}

                    }
                }
            }
        }


        if (x1 > 0) {
            if (( this.mas[pos - 1] == 5) && this.isRival(pos,pos - 1)) return true;
            if (y1 > 0 && (( this.mas[pos - 9]) == 5) && this.isRival(pos,pos - 9)) return true;
            if (y1 < 56 && (( this.mas[pos + 7]) == 5) &&  this.isRival(pos,pos + 7))return true;
        }
        if (x1 < 7) {
            if (( this.mas[pos + 1] == 5) && this.isRival(pos,pos + 1)) return true;
            if (y1 > 0 && (( this.mas[pos - 7]) == 5) && this.isRival(pos,pos - 7)) return true;
            if (y1 < 56 && (( this.mas[pos + 9]) == 5) && this.isRival(pos,pos + 9)) return true;
        }
        if (y1 > 0 && ((( this.mas[pos - 8]) == 5) && this.isRival(pos,pos - 8))) return true;
        if (y1 < 56 && ((( this.mas[pos + 8]) == 5) &&this.isRival(pos,pos + 8))) return true;

        return false;
    }

    steps(pos) {
        let out = new MyVec();
        let x1, y1;
        let x0 = pos % 8;
        let y0 = pos / 8;
        x1 = x0;
        y1 = y0 << 3;
        if(this.mas[pos] ==  LADIA) {
            x1--;
            while(x1 >= 0 && (this.mas[x1 + y1] == 0)) {out.push(x1 + y1); x1--;}
            if (x1 >= 0 && (this.mas[x1 + y1] != 0) && this.isRival(pos, x1 + y1)) { out.push(x1 + y1); }
            x1 = x0 + 1;
            while(x1 < 8 && (this.mas[x1 + y1] == 0)) {out.push(x1 + y1); x1++;}
            if (x1 < 8 && (this.mas[x1 + y1] != 0) && this.isRival(pos, x1 + y1)) { out.push(x1 + y1); }
            x1 = x0;
            y1 -= 8;
            while(y1 >= 0 && (this.mas[x1 + y1] == 0)) {out.push(x1 + y1); y1 -= 8;}
            if (y1 >= 0 && (this.mas[x1 + y1] != 0) && this.isRival(pos, x1 + y1)) { out.push(x1 + y1); }
            y1 = y0 << 3;
            y1 += 8;
            while(y1 < 64 && (this.mas[x1 + y1] == 0)) {out.push(x1 + y1); y1 += 8;}
            if (y1 < 64 && (this.mas[x1 + y1] != 0) && this.isRival(pos, x1 + y1)) out.push(x1 + y1);
        }
        else if(this.mas[pos] == KON) {
            if (x1 < 7 && y1 >= 16 && (this.isEmpty(x1 + y1 - 15) || this.isRival(pos, x1 + y1 - 15))) out.push(x1 + y1 - 15);
            if (x1 > 0 && y1 >= 16 && (this.isEmpty(x1 + y1 - 17) || this.isRival(pos, x1 + y1 - 17))) out.push(x1 + y1 - 17);
            if (x1 < 6 && y1 >= 8 && (this.isEmpty(x1 + y1 - 6) || this.isRival(pos, x1 + y1 - 6))) out.push(x1 + y1 - 6);
            if (x1 > 1 && y1 >= 8 && (this.isEmpty(x1 + y1 - 10) || this.isRival(pos, x1 + y1 - 10))) out.push(x1 + y1 - 10);
            if (x1 < 7 && y1 < 48 && (this.isEmpty(x1 + y1 + 17) || this.isRival(pos, x1 + y1 + 17))) out.push(x1 + y1 + 17);
            if (x1 > 0 && y1 < 48 && (this.isEmpty(x1 + y1 + 15) || this.isRival(pos, x1 + y1 + 15))) out.push(x1 + y1 + 15);
            if (x1 < 6 && y1 < 56 && (this.isEmpty(x1 + y1 + 10) || this.isRival(pos, x1 + y1 + 10))) out.push(x1 + y1 + 10);
            if (x1 > 1 && y1 < 56 && (this.isEmpty(x1 + y1 + 6) || this.isRival(pos, x1 + y1 + 6))) out.push(x1 + y1 + 6);
        }
        else if(this.mas[pos] == SLON) {
            let cend = pos - 9 * ((x0 > y0)?y0:x0);
            let cbuf;
            for (cbuf = pos - 9; cbuf >= cend && this.mas[cbuf] == 0; cbuf -= 9) out.push(cbuf);
            if (cbuf >= cend && this.mas[cbuf] != 0 && this.isRival(pos, cbuf)) out.push(cbuf);
            cend = pos + 9 * ((x0 > y0)?(7-x0):(7-y0));
            for (cbuf = pos + 9; cbuf <= cend && this.mas[cbuf] == 0; cbuf += 9) out.push(cbuf);
            if (cbuf <= cend && this.mas[cbuf] != 0 && (this.isRival(pos, cbuf))) out.push(cbuf);
            cend = pos + 7 * ((x0 < (7 - y0))?x0:(7 - y0));
            for (cbuf = pos + 7; cbuf <= cend && this.mas[cbuf] == 0; cbuf += 7) out.push(cbuf);
            if (cbuf <= cend && this.mas[cbuf] != 0 && (this.isRival(pos, cbuf))) out.push(cbuf);
            cend = pos - 7 * ((7 - x0 < y0)?(7 - x0):y0);
            for (cbuf = pos - 7; cbuf >= cend && this.mas[cbuf] == 0; cbuf -= 7) out.push(cbuf);
            if (cbuf >= cend && this.mas[cbuf] != 0 && (this.isRival(pos, cbuf))) out.push(cbuf);
        }
        else if(this.mas[pos] == FERZ) {
            let cend = pos - 9 * ((x0 > y0)?y0:x0);
            let cbuf;
            for (cbuf = pos - 9; cbuf >= cend && this.mas[cbuf] == 0; cbuf -= 9) out.push(cbuf);
            if (cbuf >= cend && this.mas[cbuf] != 0 && (this.isRival(pos, cbuf))) out.push(cbuf);
            cend = pos + 9 * ((x0 > y0)?(7-x0):(7-y0));
            for (cbuf = pos + 9; cbuf <= cend && this.mas[cbuf] == 0; cbuf += 9) out.push(cbuf);
            if (cbuf <= cend && this.mas[cbuf] != 0 && (this.isRival(pos, cbuf))) out.push(cbuf);
            cend = pos + 7 * ((x0 < (7 - y0))?x0:(7 - y0));
            for (cbuf = pos + 7; cbuf <= cend && this.mas[cbuf] == 0; cbuf += 7) out.push(cbuf);
            if (cbuf <= cend && this.mas[cbuf] != 0 && (this.isRival(pos, cbuf))) out.push(cbuf);
            cend = pos - 7 * ((7 - x0 < y0)?(7 - x0):y0);
            for (cbuf = pos - 7; cbuf >= cend && this.mas[cbuf] == 0; cbuf -= 7) out.push(cbuf);
            if (cbuf >= cend && this.mas[cbuf] != 0 && (this.isRival(pos, cbuf))) out.push(cbuf);
            x1--;
            while(x1 >= 0 && (this.mas[x1 + y1] == 0)) {out.push(x1 + y1); x1--;}
            if (x1 >= 0 && (this.mas[x1 + y1] != 0) && this.isRival(pos, x1 + y1)) { out.push(x1 + y1); }
            x1 = x0 + 1;
            while(x1 < 8 && (this.mas[x1 + y1] == 0)) {out.push(x1 + y1); x1++;}
            if (x1 < 8 && (this.mas[x1 + y1] != 0) && this.isRival(pos, x1 + y1)) { out.push(x1 + y1); }
            x1 = x0;
            y1 -= 8;
            while(y1 >= 0 && (this.mas[x1 + y1] == 0)) {out.push(x1 + y1); y1 -= 8;}
            if (y1 >= 0 && (this.mas[x1 + y1] != 0) && this.isRival(pos, x1 + y1)) { out.push(x1 + y1); }
            y1 = y0 << 3;
            y1 += 8;
            while(y1 < 64 && (this.mas[x1 + y1] == 0)) {out.push(x1 + y1); y1 += 8;}
            if (y1 < 64 && (this.mas[x1 + y1] != 0) && this.isRival(pos, x1 + y1)) { out.push(x1 + y1); }
        }
        else if(this.mas[pos] == KOROL) {
            if((this.hodil[pos] == 0) && this.hodil[pos + 3] == 0
                    && this.mas[pos + 1] == 0 && this.mas[pos + 2] == 0
                    && !this.podUdarom(pos) && !this.podUdarom(pos - 1) && !this.podUdarom(pos + 2)) {
                out.push(pos + 2);
            }
            if((this.hodil[pos] == 0) && this.hodil[pos - 4] == 0
                    && this.mas[pos - 1] == 0 && this.mas[pos - 2] == 0 && this.mas[pos - 3] == 0
                    && !this.podUdarom(pos) && !this.podUdarom(pos - 1) && !this.podUdarom(pos - 2))
                out.push(pos - 2);
            if (x1 > 0) {
                if ((this.mas[pos - 1] == 0) || this.isRival(pos, pos - 1)) out.push(pos - 1);
                if (y1 > 0 && ((this.mas[pos - 9] == 0) || (this.isRival(pos, pos - 9)))) out.push(pos - 9);
                if (y1 < 56 && ((this.mas[pos + 7] == 0) || (this.isRival(pos, pos + 7)))) out.push(pos + 7);
            }
            if (x1 < 7) {
                if (((this.mas[pos + 1] == 0) || this.isRival(pos, pos + 1))) out.push(pos + 1);
                if (y1 > 0 && ((this.mas[pos - 7] == 0) || this.isRival(pos, pos - 7))) out.push(pos - 7);
                if (y1 < 56 && ((this.mas[pos + 9] == 0) || this.isRival(pos, pos + 9))) out.push(pos + 9);
            }
            if (y1 > 0 && (this.mas[pos - 8] == 0 || this.isRival(pos, pos - 8))) out.push(pos - 8);
            if (y1 < 56 && (this.mas[pos + 8] == 0 || this.isRival(pos, pos + 8))) out.push(pos + 8);
        }
        else if(this.mas[pos] == PESHKA) {
            if (this.sto[x1 + y1] == 1) {
                if (y1 == 48 && this.mas[pos - 8] == 0 && this.mas[pos - 16] == 0) out.push(pos - 16);
                if ((y1 > 7) && this.mas[x1 + y1 - 8] == 0) out.push(x1 + y1 - 8);
                if ((y1 > 7) && (x1 < 7) && this.mas[x1 + y1 - 7] != 0 && !(this.sto[x1 + y1 - 7])) out.push(x1 + y1 - 7);
                if ((y1 > 7) && (x1 > 0) && this.mas[x1 + y1 - 9] != 0 && !(this.sto[x1 + y1 - 9])) out.push(x1 + y1 - 9);
                if (y1 == 24 && this.history.lastNum() != -1) {
                    let st = this.history.getLast();
                    if ((st._figura == PESHKA) && (st._posNew - st._posOld  == 16)
                            && ((x0 < 7 && st._posNew - pos == 1) || (x0 > 0 && pos -st._posNew == 1))) {
                        out.push(st._posNew - 8);
                    }
                }
            }
            else {
                if (y1 == 8 && this.mas[pos + 8] == 0 && this.mas[pos + 16] == 0) out.push(pos + 16);
                if ((y1 < 56) && this.mas[x1 + y1 + 8] == 0) out.push(x1 + y1 + 8);
                if ((y1 < 56) && (x1 < 7) && this.mas[x1 + y1 + 9] != 0 && (this.sto[x1 + y1 + 9])) out.push(x1 + y1 + 9);
                if ((y1 < 56) && (x1 > 0) && this.mas[x1 + y1 + 7] != 0 && (this.sto[x1 + y1 + 7])) out.push(x1 + y1 + 7);
                if (y1 == 32 && this.history.lastNum() != -1) {
                    let st = this.history.getLast();
                    if ((st._figura == PESHKA) && (st._posOld - st._posNew  == 16)
                            && ((x0 < 7 && st._posNew - pos == 1) || (x0 > 0 && pos -st._posNew == 1))) {
                        out.push(st._posNew + 8);
                    }
                }
            }
        }
        return out;
    }
    
    thisIsVictory() {
        let pos = this.kingPos(1 - this.curColor);
        if (!this.podUdarom(pos)) {
            let i;
            for (i = 0; i < 64; i++) {
                if ((this.sto[i] == this.sto[pos]) && this.mas[i]) {
                    let vecs = this.steps(i);
                    if (i != pos) {
                        while(vecs.lastNum() >= 0) {
                            let  posa = vecs.pop();
                            this.curColor = 1 - this.curColor ;
                            let res = this.moveFig(i, posa, false);
                            if(res != 2) this.backStep();
                            this.curColor = 1 - this.curColor ;
                            if(((res == 0) || (res == 4)) && !this.podUdarom(pos)) {  
                                return false;
                            }
                    }
                }
                else {
                    while(vecs.lastNum() >= 0) {
                        let  posa = vecs.pop();
                        this.curColor = 1 - this.curColor ;
                        let res = this.moveFig(pos, posa, false);
                        let cond = 0;
                        if(res != 2) {
                            let cond = !this.podUdarom(posa);
                            this.backStep();
                        }
                        this.curColor = 1 - this.curColor ;
                        if(cond) {
                            return false;
                        }
                    }
                }
            }
        }
    }
    else {
        let vecs = this.steps(pos);
        while(vecs.lastNum() >= 0) {
            let  posa = vecs.pop();
            this.curColor = 1 - this.curColor;
            let res = this.moveFig(pos, posa, false);
            let cond = 0;
            if(res != 2) {
                cond = !this.podUdarom(posa);
                this.backStep();
            }
            this.curColor = 1 - this.curColor ;
            if ((res == 0) || (res == 4)) {
                if (cond) {
                    return false;
                }
            }
        }
        let i;
        for(i = 0; i < 64; i++) {
            if ((this.sto[i] == this.sto[pos]) && this.mas[i] && (i != pos)) {
                vec = this.steps(i);
                while(vec.lastNum() >= 0) {
                    let  posa = vec.pop();
                    this.curColor = 1 - this.curColor;
                    let res = this.moveFig(i, posa, false);
                    if(res != 2) {
                        this.backStep();
                    }
                    this.curColor = 1 - this.curColor;
                        if ((res == 0) || (res == 4)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

}
exports.BoardLogic = BoardLogic;