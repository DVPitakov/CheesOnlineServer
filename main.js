var WebSocketServer = new require('ws');
var Game = require('./game.js').Game;
var Disconnector = require('./disconnector.js').Disconnector;
var games = [];
var lastId = 0;
var webSocketServer = new WebSocketServer.Server({port: process.env.PORT || 8081});
var disconnector = new Disconnector(games, 10000);
webSocketServer.on('connection', function(ws) {
	console.log(JSON.stringify(ws.upgradeReq.connection.remotePort));
  console.log('here');
  var color = 0;
  var gameId = lastId;
  var game = games[gameId];
  if (games[gameId] != null) {
	game.addUser(ws);
	game.run();
	color = 1;
	lastId += 1;
  }
  else {
	game = new Game();
	games[gameId] = game;
	game.addUser(ws);
	console.log('begin');
	color = 0;
  }  

  ws.on('message', function(userMsg) {
	var msg = JSON.parse(userMsg);
	game.userActive[color]  = true;
    	if(null != msg && null != msg.action) {
    		if(msg.action.toString() == "step") {
			game.nextStep(msg, color);
   	 	}
   	 	else if(msg.action.toString() == "pawTrans") {
			game.pawTrans(msg, color);
   	 	}
	 	else if(msg.action.toString() == "gameEnd") {
			game.gameEnd(msg, color);
	 	}
	 	else if(msg.action.toString() == "howAreYou") {
			game.howAreYou(msg, color);
	 	}
	 	else if(msg.action.toString() == "nichia") {
			game.nichia(msg, color);
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
