var core = require('./core.js');
var settings = require('./settings.js');

var numbersSet = [];
var tempSet = [];
var currentNumber;

module.exports = {
    start: function () {
        var numbers = [];
        var generatedNumber;

        //TODO: create option for N loops
        for (var i = 1; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                for (var k = 0; k < 10; k++) {
                    for (var h = 0; h < 10; h++) {
                        if (i !== j && i !== k && i !== h && j !== k && j !== h && k !== h) {
                            generatedNumber = 1000 * i + 100 * j + 10 * k + h;
                            numbersSet.push(generatedNumber);
                        }
                    }
                }
            }
        }
    },
    guessNumber: function (playerHints) {
        if (playerHints) {
            var cows = playerHints.cows * 1;
            var bulls = playerHints.bulls * 1;
            var newSet = [];
            for (var i = 0; i < numbersSet.length; i++) {
                var matchResult = core.matchNumber(currentNumber, numbersSet[i], settings.digitsCount);
                if (matchResult.cows === cows && matchResult.bulls === bulls) {
                    tempSet.push(numbersSet[i]);
                }
            }

            numbersSet = tempSet;
            tempSet = [];
        }

        var randomIndex = core.generateRandomNumberInRange(0, numbersSet.length - 1);
        currentNumber = numbersSet[randomIndex];

        return currentNumber;
    }
}