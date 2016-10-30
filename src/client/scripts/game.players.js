function GamePlayer(name, panel) {
    this.name = name;
    this.panel = panel;
}

var Bot = function () {
    var submitNumberTimeout = 5000;
    var computerLogic = new ComputerGuessesNumberGame();
    
    function Bot(name, panel) {
        GamePlayer.call(this, name, panel);
    }

    Bot.prototype.start = function () {
        computerLogic.start();
    };

    Bot.prototype.giveSuggestion = function (opponentsHints) {
        var newNumber = computerLogic.guessNumber(opponentsHints);
        
        this.panel.find('.txtNumber').val(newNumber);
        setTimeout(function () {
            this.panel.find('.btnSubmitNum').trigger( "click" );
        }, submitNumberTimeout);
    };

    return Bot;
}

var Human = function () {
    function Human(name, panel) {
        GamePlayer.call(this, name, panel);
    }

    Human.prototype.start = function () {

    };

    Human.prototype.giveSuggestion = function () {

    };

    return Human;
}