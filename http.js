var http = require('http');
var server = http.createServer(function (request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end("Server are working");
});
server.listen(2000);
export server = "server"