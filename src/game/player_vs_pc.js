var core = require('./core.js');
var settings = require('./settings.js');

// Current generated number
var currentNumber;

module.exports = {
    start: function () {
        // generate random number with specified digits counts
        currentNumber = core.generateNumber(settings.digitsCount);
        console.log("Generated number: " + currentNumber);
    },
    matchNumber: function (guessNumber) {
        return core.matchNumber(currentNumber, guessNumber, settings.digitsCount)
    }
    // matchNumber: function (playerNumber) {
    //     // Convert numbers to string to be able to use index operator
    //     var currentNumberAsString = currentNumber.toString();
    //     var playerNumberAsString = playerNumber.toString();

    //     var cows = 0;
    //     var bulls = 0;
    //     for (var i = 0; i < digits; i++) { 
    //         for (var j = 0; j < digits; j++) {
    //             if (playerNumberAsString[i] === currentNumberAsString[j]) {
    //                 if (j === i) {
    //                     bulls++;
    //                 } else {
    //                     cows++
    //                 }
    //             }
    //         }
    //     }

    //     return {
    //         bulls: bulls,
    //         cows: cows
    //     }
    // }
};