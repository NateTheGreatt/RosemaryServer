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


function onNewPlayer(data) {
	console.log('dat new new'); 
  players.push(new Player(data.x,data.y,data.id,data.name));

  this.broadcast.emit("new player", {id: data.id, x: data.x, y: data.y, name: data.name});

  for(var i=0;i<players.length;i++) {
  	if(players[i].id != data.id) { 
  		console.log("I'm sending out")
  		this.emit("new player", {id: players[i].id, x: players[i].x, y: players[i].y, name: players[i].name});
  	}
  }
};

function onMovePlayer(data) {
	//console.log('player moved');
  var p = playerById(data.id);
  p.x = data.x;
  p.y = data.y;
  p.name = data.name
  this.broadcast.emit('player moved', {id:this.id,x:data.x,y:data.y,name:data.name});
};

function onClientDisconnect() {
	console.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
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
    name: string;

    constructor(startX, startY, _id, name) {
    	console.log('new player "'+name+'" created at ('+startX+','+startY+') with ID: '+_id);
  	  this.x = startX;
      this.y = startY;
      this.id = _id;
      this.name = name;
    }

    getX() {return this.x;}
    setX(newX) {this.x = newX;}

    getY() {return this.y;}
    setY(newY) {this.y = newY;}

    getId() {return this.id}
}