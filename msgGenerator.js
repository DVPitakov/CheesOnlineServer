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
extends.stepMessage = stepMessage;
extends.colorMessage = colorMessage;
extends.pawTransMessage = pawTransMessage;
extends.gameEndMessage = gameEndMessage;
extends.howAreYouMessage = howAreYouMessage;