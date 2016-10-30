/* ------------- Gamwe player factory  -----------------------*/
var GamePlayerFactory = (function () {

    function GamePlayerFactory() { }

    /**
     * Create game player object based on player type
     * @param {string} name - player name
     * @param {string} type - player type
     * @param {object} panel - player panel as html element
     * @return {number} returns new game player object 
     */
    GamePlayerFactory.prototype.createPlayer = function (name, type) {
        switch (type) {
            case 'computer':
                this.gamePlayerClass = Bot;
                break;
            case 'human':
            default:
                this.gamePlayerClass = Human;
                break;
        }

        return new this.gamePlayerClass(name);
    }

    return GamePlayerFactory

})();


/* ------------- Base game player class  -----------------------*/

/**
 * Create base game player object
 * @constructor
 */
function GamePlayer(name) {
    this.panel = undefined;
    this.name = name;
}

/**
 * Set player panel
 * @param {object} panel - html div element which containes the whole UI
 */
GamePlayer.prototype.setPanel = function (panel) {
    this.panel = panel
}

/* ------------- Bot player class  -----------------------*/
var Bot = (function () {
    // constants members
    var submitNumberTimeout = 1000;
    
    /**
     * Create base game player object
     * @constructor
     */
    function Bot(name) {
        GamePlayer.call(this, name);
        this.algorithm = new ComputerGuessesNumberGame();
    }

    // Copies all GamePlayer prototype fields/methods to new object and also add some new methods  
    Bot.prototype = Object.create(GamePlayer.prototype, {
        /**
         * Starts computer algorithm for guessing numbers
         */
        start: {
            value: function () {
                this.algorithm.start();
            }
        },

        /**
         * Do some calculations and add in textbox new random number 1
         */
        giveSuggestion: {
            value: function () {
                var newNumber = this.algorithm.guessNumber(this.panel.getLastServerHint());

                this.panel.enterNumber(newNumber);
                setTimeout((function () {
                    this.panel.submitNumber();
                }).bind(this), submitNumberTimeout);
            }
        }
    });

    // Set constructor to just created prototype
    Bot.prototype.constructor = Bot;

    return Bot;
})();

/* ------------- Human player class  -----------------------*/
var Human = (function () {

    /**
    * Create Human game player object and calls base class ctor
    * @constructor
    */
    function Human(name) {
        GamePlayer.call(this, name);
    }

    // Copies all GamePlayer prototype fields/methods to new object and also add some new methods  
    Human.prototype = Object.create(GamePlayer.prototype, {
        /**
        * Waiting for user input
        */
        start: {
            value: function () {
                //do nothing; 
            }
        },

        /**
         * Waiting for user input
         * 
         */
        giveSuggestion: {
            value: function () {
                //wait for keyboard input;
            }
        }
    });

    // Set constructor to just created prototype
    Human.prototype.constructor = Human;

    return Human;
})();