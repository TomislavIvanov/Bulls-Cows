var GamePanel = (function () {
    var inputNumberSelector = '.txtNumber';
    var logTableSelector = '.numberInformationLog';
    var winGameLabelSelector = '.winGameMsgLbl';
    var btnSubmitSelector = '.btnSubmitNum';

    var bullMatchClass = 'warning';
    var cowMatchClass = 'info';
    var btnNextPlayer = '.btnNextPlayer';

    /**
    * @constructor
    */
    function GamePanel(element) {
        this.element = element;
        this.lastServerHint = { bulls: 0, cows: 0 };
        this.onSubmitNumberCallback = undefined;
    }

    GamePanel.prototype.getLastServerHint = function () {
        return this.lastServerHint;
    };

    GamePanel.prototype.show = function () {
        this.element.removeClass('hidden');
    };

    GamePanel.prototype.hide = function () {
        this.element.addClass('hidden');
    };

    GamePanel.prototype.showWinMessage = function () {
        this.element.find(winGameLabelSelector).removeClass('hidden');
    };

    GamePanel.prototype.showTxtNumber = function () {
        this.element.find(inputNumberSelector).removeClass('hidden');
    };

    GamePanel.prototype.hideTxtNumber = function () {
        this.element.find(inputNumberSelector).addClass('hidden');
    };

    GamePanel.prototype.enterNumber = function (value) {
        this.element.find(inputNumberSelector).val(value);
    };

    GamePanel.prototype.submitNumber = function () {
        //this.element.find(inputNumberSelector).click();
        this.onSubmitNumberCallback();
    };

    GamePanel.prototype.showLog = function () {
        this.element.find(logTableSelector).removeClass('hidden');
    }

    GamePanel.prototype.hideLog = function () {
        this.element.find(logTableSelector).addClass('hidden');
    }

    GamePanel.prototype.addRowToLog = function (number, bulls, cows) {
        console.log('Bulls ' + bulls + ", Cows " + cows);
        this.lastServerHint = { bulls: bulls, cows: cows };
        var rowsCount = this.element.find(logTableSelector).find('tr').length;
        var bullsClass = bulls > 0 ? 'warning' : '';
        var cowsClass = cows > 0 ? 'info' : '';

        this.element.find(logTableSelector).append(
            '<tr>' +
            '<td>' + rowsCount + '</td>' +
            '<td>' + number + '</td>' +
            '<td class="' + bullsClass + '">' + bulls + '</td>' +
            '<td class="' + cowsClass + '">' + cows + '</td>' +
            '</tr>');
    };

    GamePanel.prototype.showBtnNext = function () {
        this.element.find(btnNextPlayer).removeClass('hidden');
    };

    GamePanel.prototype.hideBtnNext = function () {
        this.element.find(btnNextPlayer).addClass('hidden');
    };

    GamePanel.prototype.hideBtnSubmit = function () {
        this.element.find(btnSubmitSelector).addClass('hidden');
    };

    GamePanel.prototype.showBtnSubmit = function () {
        this.element.find(btnSubmitSelector).removeClass('hidden');
    };

    // event handlers
    GamePanel.prototype.attachOnSubmitNumberHandler = function (callback) {
        this.onSubmitNumberCallback = (function (e) {
            $('#errorMsgLbl').addClass('hidden');
            var number = this.element.find(inputNumberSelector).val();

            // validate number
            if (isNaN(number)) {
                $('#errorMsgLbl').removeClass('hidden');
                return;
            }

            if (number < 999) {
                $('#errorMsgLbl').removeClass('hidden');
                return;
            }

            callback(number);
            this.showLog();
        }).bind(this);

        this.element.find(btnSubmitSelector).on('click', this.onSubmitNumberCallback);
    };

    GamePanel.prototype.attachOnNextPlayerClickHandler = function (callback) {
        this.element.find(btnNextPlayer).on('click', (function () {
            this.hide();
            callback();
        }).bind(this));
    };

    return GamePanel;
})();