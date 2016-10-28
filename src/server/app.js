var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    parser = require('body-parser'),
    path = require('path'),
    exphbs = require('express-handlebars'),
    io = require('socket.io')(http),
    compression = require('compression'),
    games = require('./game/games.js'),
    playersList = {},
    port = 3000;

// gzip compression
app.use(compression());

// Set handlebars as view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname + '/../client/views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname + '/../client/views'));

// Set static resources
app.use(express.static('./src/client/'));
app.use('/bower_components', express.static('./bower_components'));

// Set main routes
app.get('/', function (req, res) {
    res.render('home', { body: 'gosho' });
}).get('/online_players', function (req, res) {
    res.render('online-players', { body: 'gosho' });
}).get('/player_guesses_number', function (req, res) {
    res.render('player-guesses-number', { body: 'gosho' });
}).get('/computer_guesses_number', function (req, res) {
    res.render('computer-guesses-number', { body: 'gosho' });
}).get('/playerVsPlayer/:playerID', function (req, res) {
    ////res.render('player-vs-player', { otherPlayer: playersList[req.params.playerID].name });
})

// Add sockets.io events callbacks
io.on('connection', function (player) {
    console.log('New player is connected (ID: ' + player.id + ')');
    console.log('Online players:' + Object.keys(playersList).length);

    // Add player to the list
    playersList[player.id] = { name: player.id };

    player.on('disconnect', function () {
        console.log('Player is disconnected (ID: ' + player.id + ')');
        // Remove from list when disconnected       
        delete playersList[player.id];
        // notify all clients except sender
        player.broadcast.emit('player_disconected', player.id);
    });

    /* --------------  Online players  -------------------- */
    player.on('save_nickname', function (nickName) {
        var ids = Object.keys(playersList);
        var playersCount = ids.length;
        if (playersCount > 0) {
            player.broadcast.emit('player_connected', { id: player.id, name: nickName || 'N/A' });
            var onlinePlayers = ids
                .filter(function (currentID) { return currentID !== player.id })
                .map(function (currentID) {
                    return { id: currentID, name: playersList[currentID].name || currentID };
                });

            // TODO: add option to send response for each successfull message
            // player.emit('message-received', nickName);
            player.emit('online_players', onlinePlayers)
        }

        playersList[player.id].name = nickName;
    });

    player.on('player_offer_game', function (playerId) {
        console.log('Player offer game ID:' + playerId);
        io.to(playerId).emit('player_offer_game', { id: playerId, name: playersList[playerId].name });
    });

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
});

http.listen(port, function () {
    'use strict';
    console.log('listening on *:' + port);
});

