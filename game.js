var xelement = require('xelement');
stepMessage = require('./msgGenerator.js').stepMessage;
colorMessage =  require('./msgGenerator.js').colorMessage;
pawTransMessage = require('./msgGenerator.js').pawTransMessage;
gameEndMessage = require('./msgGenerator.js').gameEndMessage;
howAreYouMessage = require('./msgGenerator.js').howAreYouMessage;
BoardLogic = require('./rools').BoardLogic;
class Game {
	constructor(game_id) {
		console.log('Here');
        this.game_id = game_id;
		this.board = new BoardLogic();
        this.users_colors = new Map();
		this.users_data_for_send = [[], []];
		this.userActive = [true, true];
		this.isStarted = false;
		this.cur = 0;
	}
	addUser(user_id) {
		this.users_colors[user_id] = this.cur;
		this.cur += 1;
	}
	isActive() {
		return (this.userActive[0] && this.userActive[1]);
	}
	run() {
		this.users_data_for_send[0].push(colorMessage({userColor: 1}));
		this.users_data_for_send[1].push(colorMessage({userColor: 0}));
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
			this.users_data_for_send[0].push(gameEndMessage({couse: 45}));
		}
		else if (this.userActive[1]) {
			this.users_data_for_send[1].push(gameEndMessage({couse: 45}));
		}
	}
	nextStep(data, color) {
		if (data != null && data.oldPos != null && data.newPos != null) {
			let res = this.board.moveFig(data.oldPos, data.newPos);
			if (res == 0 || res == 4) {
    				this.users_data_for_send[1 - color].push(stepMessage(data));
			}
		}
	}
	gameEnd(data, color) {
		this.users_data_for_send[1 - color].push(gameEndMessage(data));
	}
	pawTrans(data, color) {
		this.users_data_for_send[1 - color].push(pawTransMessage(data));
	}
	nichia(data, color) {
		this.users_data_for_send[1 - color].push({action: "nichia"});
	}
	sayYes(color) {
		this.users_data_for_send[1 - color].push({action: "sayYes"});
	}
	sayNot(color) {
		this.users_data_for_send[1 - color].push({action: "sayNot"});
	}
    getUpgrade(color) {
        let buf = this.users_data_for_send[color];
        this.users_data_for_send[color] = [];
        return xelement.ParseJson(buf).toXmlString();
    }
	 
}
exports.Game = Game;
