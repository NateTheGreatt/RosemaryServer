///<reference path="./d.ts/node.d.ts" />
///<reference path="./d.ts/socket.io.d.ts" />
///<reference path="./d.ts/express.d.ts" />

import http = require('http');
import path = require('path');
import util = require('util');
import socketio = require('socket.io');

function handler (req, res) {
  res.writeHead(200);
  res.end();
}

var server = http.createServer(handler);
var io = socketio.listen(server);

server.listen(3000);

//import Player = require('Player');
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
    console.log('Player connected: '+client.id);
    client.on('disconnect', onClientDisconnect);
    client.on('new', onNewPlayer);
    client.on('moved', onMovePlayer);
}

function onClientDisconnect() {
    console.log("Player disconnected: "+this.id);
};

function onNewPlayer(data) {
	console.log('dat new new'); 
  players.push(new Player(data.x,data.y,data.id));

  this.broadcast.emit("new player", {id: data.id, x: data.x, y: data.y});

  /*for(var i=0;i<players.length;i++) {
  	if(players[i].id != this.id)
  		this.emit("new player", {id: players[i].id, x: players[i].getX(), y: players[i].getY()});
  }*/
};

function onMovePlayer(data) {
	console.log('player moved');
  var p = playerById(data.id);
  p.x = data.x;
  p.y = data.y;
  this.broadcast.emit('player moved', {id:this.id,x:data.x,y:data.y});
};

function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id) 
			return players[i];
	};

	return false;
}


class Player {
    x: number;
    y: number;
    id: string;

    constructor(startX, startY, _id) {
    	console.log('new player created at ('+startX+','+startY+') with ID: '+_id);
  	  this.x = startX;
      this.y = startY;
      this.id = _id;
    }

    getX() {return this.x;}
    setX(newX) {this.x = newX;}

    getY() {return this.y;}
    setY(newY) {this.y = newY;}

    getId() {return this.id}
}