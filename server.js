var http = require('http');

console.log('server starting');

var host = "localhost", port = 1337;

var server = http.createServer(function (req, res) {
    console.log("Request received");
    res.writeHead(200, { "Content-type": "text/plain" });
    res.write("Hello World");
    res.end();
});

server.listen(port, host, 511, function () {
    console.log("Listening " + host + ":" + port);
});
//# sourceMappingURL=server.js.map
