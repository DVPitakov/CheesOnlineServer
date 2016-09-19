var WebSocketServer = new require('ws');
var games = {};
games[0] = new Game();
var lastId = 0;

function Game() {
  this.users = [null,null];
}

var webSocketServer = new WebSocketServer.Server({port: 8081});
webSocketServer.on('connection', function(ws) {
  var stepMessage = {
	action: "step",
	oldPos: 0,
 	newPos: 0
  };
  var colorMessage = {
        action: "color",
        userColor: 0
  };
  var pawTransMessage = {
	action: "pawTrans",
        figure: 0,
        pos: 0
  };
  var gameEndMessage = {
        action: "gameEnd",
	couse: 0,
	data: 0
  };
  var color = 0;
  var gameId = lastId;
  if (games[gameId].users[0]) {
	console.log("action is colorMessage")
	games[gameId].users[1] = ws;
        colorMessage.userColor = 0;
	games[lastId].users[0].send(JSON.stringify(colorMessage));
	console.log(JSON.stringify(colorMessage));
        colorMessage.userColor = 1;
	games[lastId].users[1].send(JSON.stringify(colorMessage));
	console.log(JSON.stringify(colorMessage));
	color = 1;
	lastId += 1;
	games[lastId] = new Game();
  }
  else {
	games[gameId].users[0] = ws;
	color = 0;
  }  

  
  ws.on('message', function(userMsg) {
    var msg = JSON.parse(userMsg);
    if(msg.action) {
	console.log("H" + msg.action + "H");
	console.log((msg.action + "") == "step");
    	if(msg.action.toString() == "step") {
		console.log("action is step");
    		stepMessage.oldPos = msg.oldPos;
    		stepMessage.newPos = msg.newPos;
    		games[gameId].users[1 - color].send(JSON.stringify(stepMessage));
   	 }
   	 else if(msg.action.toString() == "pawTrans") {
		console.log("action is pawTrans");
		pawTransMessage.figure = msg.figure;
		pawTransMessage.pos = msg.pos;
		games[gameId].users[1 - color].send(JSON.stringify(pawTransMessage));
   	 }
	 else if(msg.action.toString() == "gameEnd") {
		console.log("action is gameEnd");
		gameEndMessage.couse = msg.couse;
		gameEndMessage.data = msg.data;
		games[gameId].users[1 - color].send(JSON.stringify(gameEndMessage));
	 }
    }
  });
  ws.on('close', function() {})
});