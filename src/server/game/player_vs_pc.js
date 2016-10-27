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
}; 