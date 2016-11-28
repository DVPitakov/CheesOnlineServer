stepMessage = require('./msgGenerator.js').stepMessage;
colorMessage =  require('./msgGenerator.js').colorMessage;
pawTransMessage = require('./msgGenerator.js').pawTransMessage;
gameEndMessage = require('./msgGenerator.js').gameEndMessage;
howAreYouMessage = require('./msgGenerator.js').howAreYouMessage;
class Game {
	constructor(whiteUser, blackUser) {
		this.users = [whiteUser, blackUser];
		this.userActive = [true, true];
		this.users[0].send(JSON.stringify(colorMessage({userColor: 0})));
		this.users[1].send(JSON.stringify(colorMessage({userColor: 1})));
	}
	isActive() {
		return (this.userActive[0] && this.userActive[1]);
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
    		this.users[1 - color].send(JSON.stringify(stepMessage(data)));
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
		this.users[color].send(JSON.stringify(howAreYouMessage(msg)));
	}
	hichia(data, color) {
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