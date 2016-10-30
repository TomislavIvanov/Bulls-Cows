var playerGuessesNumberGame = require('../games/index.js').singlePlayer.playerGuessesNumber;

module.exports = function (io) {
    io.of('/n_players_vs_computer').on('connection', function onConnection(player) {
        var game;

        player
            .on('start_game', function () {
                game = new playerGuessesNumberGame();
                game.start();
            })
            .on('match_number', function (number) {
                if (game) {
                    var numInfo = game.matchNumber(number);
                    numInfo.actualNumber = number;
                    player.emit('number_information', numInfo);
                }
            });
    });
}