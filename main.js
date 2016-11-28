var WebSocketServer = new require('ws');
var Game = require('./game.js').Game;
var Disconnector = require('./disconnector.js').Disconnector;
var games = [];
var lastId = 0;
games[0] = new Game();


var webSocketServer = new WebSocketServer.Server({port: process.env.PORT || 8081});
var disconnector = new Disconnector(games);
webSocketServer.on('connection', function(ws) {
  var color = 0;
  var gameId = lastId;
  var whiteUser = null
  if (whiteUser) {
	game = new Game(whiteUser,ws);
	lastId += 1;
	games[lastId] = game;
	color = 1;
  }
  else {
	whiteUser = ws;
	color = 0;
  }  

  ws.on('message', function(userMsg) {
	var msg = JSON.parse(userMsg);
	games[gameId].users[color].isAlive = true;
    	if(null != msg && null != msg.action) {
    		if(msg.action.toString() == "step") {
			game.newStep(msg, color);
   	 	}
   	 	else if(msg.action.toString() == "pawTrans") {
			game.pawTrans(msg, color);
   	 	}
	 	else if(msg.action.toString() == "gameEnd") {
			game.gameEnd(msg, color);
	 	}
	 	else if(msg.action.toString() == "howAreYou") {
			game.howAreYou(color);
	 	}
	 	else if(msg.action.toString() == "nichia") {
			game.nichia(color);
	 	}
		else if(msg.action.toString() == "sayYes") {
			game.sayYes(color);
	 	}
		else if(msg.action.toString() == "sayNot") {
			game.sayNot(color);
	 	}
    	}
  });
  ws.on('close', function() {});
});
