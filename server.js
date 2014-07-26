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

function onNewPlayer(data) {
    console.log('dat new new');
    players.push(new Player(data.x, data.y, data.id, data.name));

    this.broadcast.emit("new player", { id: data.id, x: data.x, y: data.y, name: data.name });

    for (var i = 0; i < players.length; i++) {
        if (players[i].id != data.id) {
            console.log("I'm sending out");
            this.emit("new player", { id: players[i].id, x: players[i].x, y: players[i].y, name: players[i].name });
        }
    }
}
;

function onMovePlayer(data) {
    var p = playerById(data.id);
    p.x = data.x;
    p.y = data.y;
    p.name = data.name;
    this.broadcast.emit('player moved', { id: this.id, x: data.x, y: data.y, name: data.name });
}
;

function onClientDisconnect() {
    console.log("Player has disconnected: " + this.id);

    var removePlayer = playerById(this.id);

    if (!removePlayer) {
        console.log("Player not found: " + this.id);
        return;
    }
    ;

    players.splice(players.indexOf(removePlayer), 1);

    this.broadcast.emit("remove player", { id: this.id });
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
    function Player(startX, startY, _id, name) {
        console.log('new player "' + name + '" created at (' + startX + ',' + startY + ') with ID: ' + _id);
        this.x = startX;
        this.y = startY;
        this.id = _id;
        this.name = name;
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
