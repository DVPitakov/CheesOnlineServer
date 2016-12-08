stepMessage = require('./msgGenerator.js').stepMessage;
colorMessage =  require('./msgGenerator.js').colorMessage;
pawTransMessage = require('./msgGenerator.js').pawTransMessage;
gameEndMessage = require('./msgGenerator.js').gameEndMessage;
howAreYouMessage = require('./msgGenerator.js').howAreYouMessage;
BoardLogic = require('./rools').BoardLogic;
class Game {
	constructor() {
		console.log('Here');
		this.board = new BoardLogic();
		this.users = [0, 0];
		this.userActive = [true, true];
		this.isStarted = false;
		this.cur = 0;
	}
	addUser(ws) {
		this.users[this.cur] = ws;
		this.cur += 1;		
	}
	isActive() {
		return (this.userActive[0] && this.userActive[1]);
	}
	run() {
		this.users[0].send(JSON.stringify(colorMessage({userColor: 0})));
		this.users[1].send(JSON.stringify(colorMessage({userColor: 1})));
		this.isStareted = true;
	}
	started() {
		return this.isStarted;
	}
	disactive() {
		this.userActive[0] = false;
		this.userActive[1] = false;
	}
	disconnect() {
		if(this.userActive[0]) {
			this.users[0].send(gameEndMessage({couse: 45}));
		}
		else if (this.userActive[1]) {
			this.users[1].send(gameEndMessage({couse: 45}));
		}
		this.users[0].close();
		this.users[1].close();
		this.users[0] = null;
		this.users[1] = null;
	}
	nextStep(data, color) {
		if (data != null && data.oldPos != null && data.newPos != null) {
			let res = this.board.moveFig(data.oldPos, data.newPos);
			if (res == 0 || res == 4) {
    				this.users[1 - color].send(JSON.stringify(stepMessage(data)));
			}
		}
	}
	gameEnd(data, color) {
		this.users[1 - color].send(JSON.stringify(gameEndMessage(data)));
		this.users[1-color].close();
		this.users[color].close();
	}
	pawTrans(data, color) {
		this.users[1 - color].send(JSON.stringify(pawTransMessage(data)));
	}
	howAreYou(data, color) {
		this.users[color].send(JSON.stringify(howAreYouMessage(data)));
	}
	nichia(data, color) {
		this.users[1 - color].send(JSON.stringify({action: "nichia"}));
	}
	sayYes(color){
		this.users[1 - color].send(JSON.stringify({action: "sayYes"}));
	}
	sayNot(color){
		this.users[1 - color].send(JSON.stringify({action: "sayNot"}));
	}
	 
}
exports.Game = Game;