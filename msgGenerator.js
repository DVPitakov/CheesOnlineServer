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
exports.stepMessage = stepMessage;
exports.colorMessage = colorMessage;
exports.pawTransMessage = pawTransMessage;
exports.gameEndMessage = gameEndMessage;
exports.howAreYouMessage = howAreYouMessage;
