let WrbSocketServer = new require('ws');
class WSManager{
	constructor(port) {
		this.port = port;
		this.ws = new WebSocketServer.Server({port: process.env.PORT || url});
		this.out = new Promise(function(res, rej){
			this.ws.on('message', res(msg));
		})
		.then(json=>{return JSON.parse(json)})
		.then(obj=>{
			
		})
		
	}
}