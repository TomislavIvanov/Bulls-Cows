var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    parser = require('body-parser');

app.use(parser.json());
app.use(parser.urlencoded());
app.use(express.static(__dirname + '/'));

// add main routes
var routes = require('./routes.js');
routes.add(app, express);

var games = require('./game/games.js');

http.listen(3000, function () {
    'use strict';
    console.log('listening on *:3000');
});

var io = require('socket.io')(http);
io.on('connection', function (socket) {
    console.log('Player is connected');

    socket.on('start_game', function (fieldInfo) {
        games.singlePlayer.playerVsPC.start();
    });

    socket.on('player_response', function (playerHints) {
        var computerNumber = games.singlePlayer.pcVsPlayer.guessNumber(playerHints);
        socket.emit('computer_number', computerNumber);
    });

    socket.on('start_game2', function () {
        games.singlePlayer.pcVsPlayer.start();
        var computerNumber = games.singlePlayer.pcVsPlayer.guessNumber();
        socket.emit('computer_number', computerNumber);
    });

    socket.on('match_number', function (number) {
        console.log("Player number: " + number);
        var numInfo = games.singlePlayer.playerVsPC.matchNumber(number);
        numInfo.actualNumber = number;
        socket.emit('number_information', numInfo);
    });

    socket.on('end game', function () {
        console.log('game over');
    });

    socket.on('disconnect', function () {
        console.log('player disconnected');
    });
});
