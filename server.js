var http = require('http');

var socketio = require('socket.io');

function handler(req, res) {
    res.writeHead(200);
    res.end();
}

var server = http.createServer(handler);
var io = socketio.listen(server);

server.listen(3000);

var players;
init();

function init() {
    console.log('initializing server');
    players = [];
    setEventHandlers();
}

function setEventHandlers() {
    io.sockets.on('connection', onSocketConnection);
}

function onSocketConnection(client) {
    console.log('Player connected: ' + client.id);
    client.on('disconnect', onClientDisconnect);
    client.on('new', onNewPlayer);
    client.on('moved', onMovePlayer);
}

function onClientDisconnect() {
    console.log("Player disconnected: " + this.id);
}
;

function onNewPlayer(data) {
    console.log('dat new new');
    players.push(new Player(data.x, data.y, data.id));

    this.broadcast.emit("new player", { id: data.id, x: data.x, y: data.y });

    for (var i = 0; i < players.length; i++) {
        if (players[i].id != data.id)
            this.emit("new player", { id: players[i].id, x: players[i].x, y: players[i].y });
    }
}
;

function onMovePlayer(data) {
    console.log('player moved');
    var p = playerById(data.id);
    p.x = data.x;
    p.y = data.y;
    this.broadcast.emit('player moved', { id: this.id, x: data.x, y: data.y });
}
;

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    }
    ;

    return false;
}

var Player = (function () {
    function Player(startX, startY, _id) {
        console.log('new player created at (' + startX + ',' + startY + ') with ID: ' + _id);
        this.x = startX;
        this.y = startY;
        this.id = _id;
    }
    Player.prototype.getX = function () {
        return this.x;
    };
    Player.prototype.setX = function (newX) {
        this.x = newX;
    };

    Player.prototype.getY = function () {
        return this.y;
    };
    Player.prototype.setY = function (newY) {
        this.y = newY;
    };

    Player.prototype.getId = function () {
        return this.id;
    };
    return Player;
})();
//# sourceMappingURL=server.js.map
