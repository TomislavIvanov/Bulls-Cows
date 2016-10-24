var currentNumber;
var digits = 4;

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

function generateRandomNumberInRange(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

//// [1,2,4,5,,6,7,8]
//// [0,1,2,3,54,5,6]
//// [0, 1,2,4,5,6,67,7]
//// [0,1,2,123,123,123,]


// var NumbersGenerator = (function () {
//     var max;
//     var min; 

//     function NumbersGenerator(minVal, maxVal) {
//         min = minVal;
//         max = maxVal;
//     }

//     NumbersGenerator.prototype.nextNumber = function() {
//         if(min < max) {
//             return ++min;
//         }
//     },
//     NumbersGenerator.prototype.isFinished: function() {
//         return mix === max;
//     }   

//     return NumbersGenerator; 
// })();


var numbersSet = [];
var tempSet = [];


var PlayerVsComputer = {
    start: function (digitsCount) {
        digits = digitsCount;

        // generate random number with specified digits counts
        currentNumber = generateNumber(digits);
        console.log("Generated number: " + currentNumber);
    },
    matchNumber: function (playerNumber) {
        // Convert numbers to string to be able to use index operator
        var currentNumberAsString = currentNumber.toString();
        var playerNumberAsString = playerNumber.toString();

        var cows = 0;
        var bulls = 0;
        for (var i = 0; i < digits; i++) {
            for (var j = 0; j < digits; j++) {
                if (playerNumberAsString[i] === currentNumberAsString[j]) {
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
};




module.exports = {
    PlayerVsComputer: PlayerVsComputer,
    ComputerVsPlayer: ComputerVsPlayer
};