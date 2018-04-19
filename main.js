var http = require('http');
var xelement = require('xelement');
var url = require('url');
var Game = require('./game.js').Game;
var Disconnector = require('./disconnector.js').Disconnector;

var games = new Map();
var openGames = [];

var lastId = 0;

http.createServer(function (req, res) {
  console.log("new client!!!");
  let client_url = url.parse(req.url, true);
  let game_id = client_url.query.game_id;
  let user_id = client_url.query.user_id;
  let user_msg = client_url.query.user_msg;
  console.log(game_id);
  console.log(user_id);
  
  
  if (game_id && user_id && game_id.length > 0 && user_id.length > 0) {
    let result = doGameLogic(game_id, user_id, user_msg);
    console.log(result);
    res.write(result);
  }
  else {
    console.log("game not started");
    let generated_user_id = "A" + Math.random();
    let game_id;
    let game;
    if(openGames.length > 0) {
         console.log("free game exists");
         game = openGames.pop();
         game_id = game.game_id;
         game.addUser(generated_user_id);
         games[game_id] = game;
         game.run(); 
    }
    else {
        console.log("free game was created");
        game_id = "B" + Math.random();
        game = new Game(game_id);
        game.addUser(generated_user_id);
        openGames.push(game);
    }
    console.log(xelement.ParseJson([{action: "userKey", user_id: generated_user_id, game_id: game_id}]).toXmlString());
    res.write(xelement.ParseJson([{action: "userKey", user_id: generated_user_id, game_id: game_id}]).toXmlString());
  }
  res.end(); //end the response
})
.listen(8080); //the server object listens on port 8080


function doGameLogic(game_id, user_id, user_msg) {
    console.log("in do section");
    var game = games[game_id];
    if(!game) return xelement.ParseJson([{action: "nothing"}]).toXmlString();
    console.log("game exists");
    var color = game.users_colors[user_id];
    console.log("COLOR: " + color);
    var msg = JSON.parse(user_msg);
    game.userActive[color] = true;
    let result = xelement.ParseJson([{action: "nothing"}]).toXmlString();
    console.log("MSG_ACTION: " + msg.action.toString());
    if(msg.action.toString() == "step") {game.nextStep(msg, color);}
    else if(msg.action.toString() == "pawTrans") {
	    game.pawTrans(msg, color);
    }
    else if(msg.action.toString() == "gameEnd") {
	    game.gameEnd(msg, color);
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
    else if(msg.action.toString() == "upgrade") {
        result = game.getUpgrade(color);
        console.log(result);
    }
    return result;
 };

