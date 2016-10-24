var playerVsCom = require('./game/player_vs_pc.js');
var comVsPlayer = require('./game/pc_vs_player.js');

module.exports = function (app, http) {
    /*  Base routes */
    app.get('/', function (req, res) {
        console.log("/");
        res.sendFile(__dirname + '/index.html');
    }).get('/player_vs_computer', function (req, res) {
        console.log("/player_vs_computer");
        res.sendFile(__dirname + '/player_vs_computer.html');
    }).get('/computer_vs_player', function (req, res) {
        console.log("/computer_vs_player");
        res.sendFile(__dirname + '/computer_vs_player.html');
    });

    var io = require('socket.io')(http);

    io.on('connection', function (socket) {
        console.log('player connected');

        socket.on('start_game', function (fieldInfo) {
            playerVsCom.start(4);
        });

        socket.on('player_response', function (playerHints) {
            var computerNumber = comVsPlayer.guessNumber(playerHints);
            socket.emit('computer_number', computerNumber);
        });

        socket.on('start_game2', function () {
            comVsPlayer.start();
            var computerNumber = comVsPlayer.guessNumber();
            socket.emit('computer_number', computerNumber);
        });

        socket.on('match_number', function (number) {
            console.log("Player number: " + number);
            var numInfo = playerVsCom.matchNumber(number);
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
};