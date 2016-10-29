var gameCore = require('./core.js');
var settings = require('./settings.js');

// Current generated number
var currentNumber;

var players = [];

module.exports = {
    start: function (playerID) {
        if(players.length === 2) {
            //throw excepption
            return;
        }

        players.push(playerID);
    },
    matchNumber: function (playerNum, guessNumber) {
        return core.matchNumber(playersNums[otherPlayerID], guessNumber, settings.digitsCount)
    }
}; 