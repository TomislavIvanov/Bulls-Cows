var coreLogic = require('../core.logic.js');

/**
 * Constructor
 */
function PlayerGuessesNumberGame() {
    this.generatedNumber = undefined;
}

/**
 * Set new random number as computer choice 
 */
PlayerGuessesNumberGame.prototype.start = function () {
    // generate random number with specified digits counts
    this.generatedNumber = coreLogic.generateNumber();
    console.log("Computer generated number: " + this.generatedNumber);
}

/**
 * Match opponent number to computer choosen number by Bull&Cows game rules
 * @param {number} guessNumber - opponent guess number
 */
PlayerGuessesNumberGame.prototype.matchNumber = function (guessNumber) {
    return coreLogic.matchNumber(this.generatedNumber, guessNumber)
}

module.exports = PlayerGuessesNumberGame;