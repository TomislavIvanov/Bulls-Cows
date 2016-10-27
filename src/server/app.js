var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    parser = require('body-parser'),
    path = require('path'),
    port = 3000;

app.use(parser.json());
app.use(parser.urlencoded());

// add main routes
require('./routes.js')(app, express);
var games = require('./game/games.js');

var playersList = {};

var updatePlayersList = function (io) {
    Object.keys(playersList).forEach(function (playerID, index, ids) {
        var otherPlayers = ids
            .filter(function (currentID) { return currentID !== playerID })
            .map(function (currentID) {
                return { id: currentID, name: playersList[currentID].name || currentID };
            });

        io.to(playerID).emit('online players', otherPlayers);
    })
}


// Add addional route
app.get('/playerVsPlayer/:playerID', function (req, res) {
    var player = playersList[req.params.playerID];

    // if(player) {
        //console.log('You wanna play with' + playersList[req.params.playerID].name);
        // res.sendFile(path.resolve(__dirname + '/../client/player_vs_player.html'));
        res.sendFile('player_vs_player.html', { root: path.resolve(__dirname, '../client') });
    // } else {
    //     console.log('No such player');
    // }
});


//TODO: change players list to array. Array is object so "in" operator will do the same thing like index oberator

// TODO: add option to reuse connections 
var io = require('socket.io')(http);

// io.set('authorization', function(handshake, accept){
//     var user = handshake._query;
//     if(playersList[user.t])
//         accept('User already connected', false);
//     else
//         accept(null, true);
// });


io.on('connection', function (player) {
    console.log('Player is connected ID:' + player.id);
    // add to current connected users list
    playersList[player.id] = { name: player.id };
    // remove from list when disconnected       
    player.on('disconnect', function () {
        console.log('Player is disconnected : ' + player.id);
        delete playersList[player.id];

        updatePlayersList(io);
    });

    /* --------------  Online players  -------------------- */

    player.on('set player name', function (userName) {
        playersList[player.id].name = userName;
        // playersList[player.id].name = userName;
        updatePlayersList(io);
    });

    // TODO: some optimizations to be implemented like sending only one user not the whole list
    // for each new connected user send the whole list of all online users to each other
    // updatePlayersList(io);

    /* --------------  Computer guesses player number  -------------------- */
    player.on('start_game', function (fieldInfo) {
        games.singlePlayer.playerVsPC.start();
    });

    player.on('player_response', function (playerHints) {
        var computerNumber = games.singlePlayer.pcVsPlayer.guessNumber(playerHints);
        player.emit('computer_number', computerNumber);
    });

    /* --------------  Player guesses computer number  -------------------- */
    player.on('start_game2', function () {
        games.singlePlayer.pcVsPlayer.start();
        var computerNumber = games.singlePlayer.pcVsPlayer.guessNumber();
        player.emit('computer_number', computerNumber);
    });

    player.on('match_number', function (number) {
        console.log("Player number: " + number);
        var numInfo = games.singlePlayer.playerVsPC.matchNumber(number);
        numInfo.actualNumber = number;
        player.emit('number_information', numInfo);
    });

    /* ---------------------------------- */
    player.on('end game', function () {
        console.log('game over');
    });

    // player.on('disconnect', function () {
    //     // delete playersList[player.id];
    //     console.log('player disconnected');
    //     setTimeout(function () { 
    //         console.log('Delete player t:' + player.id);
    //         delete playersList[player.id];
    //     }, 5000)
    // });
});

http.listen(port, function () {
    'use strict';
    console.log('listening on *:' + port);
});

 