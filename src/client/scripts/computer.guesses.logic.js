
/**
 * Create new game - computer guesses player number
 */
function ComputerGuessesNumberGame() {
    this.numbersSet = [];
    this.currentNumber = undefined;;
}

/**
 * Set new random number as computer choice 
 */
ComputerGuessesNumberGame.prototype.start = function () {
    var numbers = [];
    var generatedNumber;

    for (var i = 1; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            for (var k = 0; k < 10; k++) {
                for (var h = 0; h < 10; h++) {
                    if (i !== j && i !== k && i !== h && j !== k && j !== h && k !== h) {
                        generatedNumber = 1000 * i + 100 * j + 10 * k + h;
                        this.numbersSet.push(generatedNumber);
                    }
                }
            }
        }
    }
}

/**
 * Based on opponent hints decrease current numbers set and choose new random number form the set
 * @param {object} opponentsHints - cows and bulls count in last computer suggested number
 * @return {number} returns new random choice from the numbers set 
 */
ComputerGuessesNumberGame.prototype.guessNumber = function (opponentsHints) {
    var tempSet = [];
    if (opponentsHints) {
        var cows = opponentsHints.cows * 1;
        var bulls = opponentsHints.bulls * 1;
        var newSet = [];
        for (var i = 0; i < this.numbersSet.length; i++) {
            var matchResult = coreLogic.matchNumber(this.currentNumber, this.numbersSet[i]);
            if (matchResult.cows === cows && matchResult.bulls === bulls) {
                tempSet.push(this.numbersSet[i]);
            }
        }

        this.numbersSet = tempSet;
        tempSet = [];
    }

    var randomIndex = coreLogic.generateRandomNumberInRange(0, this.numbersSet.length - 1);
    this.currentNumber = this.numbersSet[randomIndex];

    return this.currentNumber;
}
