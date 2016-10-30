var computerGuessesNumberGame = require('../games/index.js').singlePlayer.computerGuessesNumber;

module.exports = function (io) {
    io.of('/computer_guesses_number').on('connection', function onConnection(player) {
        var game;

        player
            .on('start_game', function () {
                game = new computerGuessesNumberGame();
                game.start();
                var computerNumber = game.guessNumber();
                player.emit('computer_number', computerNumber);
            })
            .on('match_number', function (number) {
                console.log("Player number: " + number);
                var numInfo = game.matchNumber(number);
                numInfo.actualNumber = number;
                player.emit('number_information', numInfo);
            })
            .on('player_response', function (playerHints) {
                if (game) {
                    var computerNumber = game.guessNumber(playerHints);
                    player.emit('computer_number', computerNumber);
                }
            });
    });
}