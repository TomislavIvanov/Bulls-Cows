/**
 * Generate random number by digits count
 * @param {number} digitsCount - digits count of number.
 */
function generateNumber(digitsCount) {
    var generatedDigits = [];
    var randomDigit;
    var start = 0;
    var end = 9;

    var maxMultiplier = Math.pow(10, digitsCount - 1);
    for (var i = 1; i <= maxMultiplier; i *= 10) {
        // The number should not start with 0
        start = i === maxMultiplier ? 1 : 0;

        randomDigit = generateRandomNumberInRange(start, end);
        while (generatedDigits.indexOf(randomDigit) !== -1) {
            randomDigit = generateRandomNumberInRange(start, end);
        }

        generatedDigits.push(randomDigit);
    }

    return generatedDigits.reverse().join('');
}

/**
 * Returns random number in interval [a,b].
 * @param {number} a - start of interval.
 * @param {number} b - end of interval.
 */
function generateRandomNumberInRange(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
 * Compare two numbers and returns how many cows or/and bulls has the guessNumber in targetNumber.
 * @param {number} targetNumber - target number.
 * @param {number} guessNumber - guess number.
 * @param {number} digitsCount - numbers digits count
 */
function matchNumber(targetNumber, guessNumber, digitsCount) {
    // Convert numbers to string to be able to use index operator
    var targetNumberAsString = targetNumber.toString();
    var guessNumberAsString = guessNumber.toString();

    if (targetNumberAsString.length > guessNumberAsString.length ||
        targetNumberAsString.length < guessNumberAsString.length) {
        throw 'The two numbers should have the same digits count';
    }

    var cows = 0;
    var bulls = 0;
    for (var i = 0; i < digitsCount; i++) {
        for (var j = 0; j < digitsCount; j++) {
            if (guessNumberAsString[i] === targetNumberAsString[j]) {
                if (j === i) {
                    bulls++;
                } else {
                    cows++
                }
            }
        }
    }

    return {
        bulls: bulls,
        cows: cows
    }
}

module.exports = {
    generateNumber: generateNumber,
    generateRandomNumberInRange: generateRandomNumberInRange,
    matchNumber: matchNumber
}