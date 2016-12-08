var WebSocketServer = new require('ws');
var games = [];
games[0] = new Game();
var lastId = 0;
function stepMessage(data) {
 	return {
		action: "step",
		oldPos: data.oldPos || 0,
 		newPos: data.newPos || 0
	}
}

function colorMessage(data) {
	return {
        	action: "color",
        	userColor: data.userColor || 0
	}
}

function pawTransMessage(data) {
	return {
		action: "pawTrans",
        	figure: data.figure || 0,
        	pos: data.pos || 0
	}
}

function gameEndMessage(data) {
	return {
        	action: "gameEnd",
		couse: data.couse || 0,
		data: data.data || 0
	}
}
  
function howAreYouMessage(data) {
	return {
        	action: "howAreYou",
		health: data.health || "fine"
	}
}

function Game() {
  this.users = [null, null];
}

setInterval(function() {
	games.forEach(function(el){
		if (null != el.users && null != el.users[0] && null != el.users[0].isAlive && null != el.users[1] && null != el.users[1].isAlive) {
			for(var i = 0; i < 2; i++) {
				if (null != el.users && null != el.users[i] && el.users[i].isAlive) {
					el.users[i].isAlive = false;
				}
				else {
					try {
						el.users[i].send(JSON.stringify(gameEndMessage({couse: 45})));
						el.users[i].close();
					}
					catch(err) {
					}
					try {
						el.users[1 - i].send(JSON.stringify(gameEndMessage({couse: 25})));
						el.users[1 - i].close();
					}
					catch(err) {
					}
					el.users = [null, null];
				}
			}
		}
	})
}, 10000);

var webSocketServer = new WebSocketServer.Server({port: process.env.PORT || 8081});
webSocketServer.on('connection', function(ws) {
  var color = 0;
  var gameId = lastId;
  if (games[gameId].users[0]) {
	console.log("action is colorMessage")
	games[gameId].users[1] = ws;
	games[lastId].users[0].send(JSON.stringify(colorMessage({userColor: 0})));
	console.log(JSON.stringify(colorMessage({userColor: 0})));
	games[lastId].users[1].send(JSON.stringify(colorMessage({userColor: 1})));
	console.log(JSON.stringify(colorMessage({userColor: 1})));
	color = 1;
	lastId += 1;
	games[lastId] = new Game();
  }
  else {
	games[gameId].users[0] = ws;
	color = 0;
  }  

  ws.on('message', function(userMsg) {
    try {
	var msg = JSON.parse(userMsg);
	games[gameId].users[color].isAlive = true;
    if(null != msg && null != msg.action) {
	console.log("H" + msg.action + "H");
	console.log((msg.action + "") == "step");
    	if(msg.action.toString() == "step") {
		console.log("action is step");
    		stepMessage.oldPos = msg.oldPos;
    		stepMessage.newPos = msg.newPos;
    		games[gameId].users[1 - color].send(JSON.stringify(stepMessage(msg)));
   	 }
   	 else if(msg.action.toString() == "pawTrans") {
		console.log("action is pawTrans");
		games[gameId].users[1 - color].send(JSON.stringify(pawTransMessage(msg)));
   	 }
	 else if(msg.action.toString() == "gameEnd") {
		console.log("action is gameEnd");
		games[gameId].users[1 - color].send(JSON.stringify(gameEndMessage(msg)));
		try {
			games[gameId].users[1 - color].close();
		}
		catch(e) {
			console.log("hopa1");
		}
		try {
			games[gameId].users[color].close();
		}
		catch(e) {
			console.log("hopa2");
		}
		games[gameId] = [null,null];
	 }
	 else if(msg.action.toString() == "howAreYou") {
		games[gameId].users[color].send(JSON.stringify(howAreYouMessage(msg)));
	 }
	 else if(msg.action.toString() == "nichia") {
		games[gameId].users[1 - color].send(JSON.stringify({action: "nichia"}));
	 }
	else if(msg.action.toString() == "sayYes") {
		games[gameId].users[1 - color].send(JSON.stringify({action: "sayYes"}));
	 }
	else if(msg.action.toString() == "sayNot") {
		games[gameId].users[1 - color].send(JSON.stringify({action: "sayNot"}));
	 }
    }
 }
    catch(err) {
	console.log("wrong message");
    }
  });
  ws.on('close', function() {});
});