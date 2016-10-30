// Use computer.guesses.logic.js
// Use game.players.js
// TODO add module loader

// add all global variables
// TODO wrap them in App object
var socket = io('/n_players_vs_computer'),
    playersFactory = new GamePlayerFactory(),
    playersList = [],
    successBullsCount = 4,
    currentPlayerIndex = 0;

socket.on('number_information', function (numInfo) {
    var currentPlayer = window.playersList[currentPlayerIndex];
    currentPlayer.panel.addRowToLog(numInfo.actualNumber, numInfo.bulls, numInfo.cows);
    currentPlayer.panel.showLog();
    currentPlayer.panel.enterNumber('');

    if (numInfo.bulls === successBullsCount) {
        currentPlayer.panel.showWinMessage();
        currentPlayer.panel.hideLog();
        currentPlayer.panel.hideBtnNext();
        currentPlayer.panel.hideBtnSubmit();
        currentPlayer.panel.hideTxtNumber();
        return;
    }

    currentPlayer.panel.showBtnNext();
});

$('#btnSavePlayersCount').on('click', function (e) {
    var playersCount = $('#inputPlayersCount').val() * 1;

    if (playersCount) {
        $('#configPlayerGroup').removeClass('hidden');
        $('#inputPlayersCount').prop('disabled', true);
        $(this).addClass('hidden');
        $('#informationLog').removeClass('hidden');
    } else {
        alert('Enter number bigger then zero');
    }

});

$('#btnAddPlayer').on('click', function () {
    var currentPlayerNum = window.playersList.length + 1;
    var currentPlayerType = $('#playerType').val();
    var currentPlayerName = $('#currentPlayerName').val();
    var typeClass = currentPlayerType === 'human' ? 'info' : 'warning';

    $('#informationLog').append(
        '<tr id="player_' + currentPlayerNum + '" >' +
        '<td>' + currentPlayerNum + '</td>' +
        '<td>' + currentPlayerName + '</td>' +
        '<td class="' + typeClass + '">' + currentPlayerType + '</td>' +
        '</tr>'
    );

    $('#currentPlayerName').val('');

    window.playersList.push(playersFactory.createPlayer(currentPlayerName, currentPlayerType));
    var choosenPlayersCount = $('#inputPlayersCount').val() * 1;

    // When last player is added show "Start game" button
    if (window.playersList.length == choosenPlayersCount) {
        $('#btnStartGame').removeClass('hidden');
        $('#configPlayerGroup').addClass('hidden');
        $(this).addClass('hidden');
    }

});

$('#btnStartGame').on('click', function () {
    $('#gameSettingsSection').addClass('hidden');

    window.playersList.forEach(function (currentPlayer, playerIndex) {
        //var playerPanelId = 'player_' + (playerIndex + 1) + '_panel';

        currentPlayer.setPanel(new GamePanel(($("#playerGameTemplate")
            .clone()
            //.attr('id', playerPanelId)
            .insertBefore("#gameSettingsSection")
        )));

        // attach callbacks to each panel
        currentPlayer.panel.attachOnSubmitNumberHandler(function (number) {
            socket.emit('match_number', number);
        });

        currentPlayer.panel.attachOnNextPlayerClickHandler(function () {
            if (currentPlayerIndex === window.playersList.length - 1) {
                window.currentPlayerIndex = 0;
            } else {
                window.currentPlayerIndex++;
            }

            updateHeader(window.playersList[window.currentPlayerIndex].name);

            window.playersList[currentPlayerIndex].panel.show();
            window.playersList[currentPlayerIndex].giveSuggestion();
        });


        currentPlayer.start();
    });

    // Show first player panel
    window.currentPlayerIndex = 0;
    var currentPlayer = window.playersList[window.currentPlayerIndex];
    currentPlayer.panel.show();
    updateHeader(currentPlayer.name);
    currentPlayer.giveSuggestion();

    socket.emit('start_game');
});

function updateHeader(playerName) {
    $('#pageHeader').html('It is <strong>' + playerName + '</strong> turn.');
}
