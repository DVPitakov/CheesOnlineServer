class Disconnector {
	constructor(games, interval = 10000) {
		this.games = games;
		this.interval = interval;
		this.isRun = false;
	}
	start() {
		this.isRun = true;
		_loop();	
	}
	stop() {
		this.isRun = false;
	
	}
	_loop() {
		if(this.isRun) {
			setTimeout(this.interval, _go().bind(this));
		}
	}
	_go() {
		this.games.forEach(game=>{
			if(game.started()) {
				if(game.isActive()) {
					game.disactive();
				}
				else {
					game.disconnect();
				}
			}
		});
		_loop().bind(this);
	}
}
exports.Disconnector = Disconnector;
