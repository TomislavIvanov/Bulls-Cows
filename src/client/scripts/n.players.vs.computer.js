var socket = io('/n_players_vs_computer'),
    playersList = [],
    currentPlayerIndex = 0;

socket.on('number_information', function (numInfo) {
    var currentPanel = $('#player_' + (currentPlayerIndex + 1) + '_panel');
    var rowsCount = $('#informationLog tr').length;
    var bullsClass = numInfo.bulls > 0 ? 'warning' : '';
    var cowsClass = numInfo.cows > 0 ? 'info' : '';
    currentPanel.find('.numberInformationLog').append(
        '<tr>' +
        '<td>' + rowsCount + '</td>' +
        '<td>' + numInfo.actualNumber + '</td>' +
        '<td class="' + bullsClass + '">' + numInfo.bulls + '</td>' +
        '<td class="' + cowsClass + '">' + numInfo.cows + '</td>' +
        '</tr>'
    );

    currentPanel.find('.numberInformationLog').removeClass('hidden');
    currentPanel.find('.txtNumber').val('');

    if (numInfo.bulls === numInfo.actualNumber.toString().length) {
        currentPanel.find('.winGameMsgLbl').removeClass('hidden');
        currentPanel.find('.numberInformationLog').addClass('hidden')
        currentPanel.find('.btnNextPlayer').addClass('hidden');
        currentPanel.find('button.btnSubmitNum').addClass('hidden');
        currentPanel.find('.txtNumber').addClass('hidden');
        return;
    }

    currentPanel.find('.btnNextPlayer').removeClass('hidden');
});

$('#btnSavePlayersCount').on('click', function (e) {
    $('#configPlayerGroup').removeClass('hidden');
    $('#inputPlayersCount').prop('disabled', true);
    $(this).addClass('hidden');
    $('#informationLog').removeClass('hidden');
});

$('#btnAddPlayer').on('click', function () {
    var currentPlayerNum = playersList.length + 1;
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

    playersList.push({ name: currentPlayerName, type: currentPlayerType });
    var choosenPlayersCount = $('#inputPlayersCount').val() * 1;

    // When last player is added shwo "Start game" button
    if (playersList.length == choosenPlayersCount) {
        $('#btnStartGame').removeClass('hidden');
        $('#configPlayerGroup').addClass('hidden');
        $(this).addClass('hidden');
    }

});

$('#btnStartGame').on('click', function () {
    $('#gameSettingsSection').addClass('hidden');

    playersList.forEach(function (currenPlayer, playerIndex) {
        var playerPanelId = 'player_' + (playerIndex + 1) + '_panel';
        $("#playerGameTemplate")
            .clone()
            .attr('id', playerPanelId)
            //.removeClass('hidden')
            .insertBefore("#gameSettingsSection");

        var currentPanel = $('#' + playerPanelId); 
        // attach callbacks to each panel
        currentPanel.find('button.btnSubmitNum').on('click', function (e) {
            var number = $(this).parent().parent().find('input').val() * 1;
            $('#errorMsgLbl').addClass('hidden');
            // validate number
            if (isNaN(number)) {
                $('#errorMsgLbl').removeClass('hidden');
                return;
            }

            if (number < 999) {
                $('#errorMsgLbl').removeClass('hidden');
                return;
            }

            socket.emit('match_number', number);
            $('#informationLog').removeClass('hidden');
        });

        currentPanel.find('button.btnNextPlayer').on('click', function (e) {
            currentPanel.addClass('hidden');
            if(currentPlayerIndex === playersList.length - 1) {
                currentPlayerIndex = 0;
            } else {
                currentPlayerIndex++;
            }

            $('#pageHeader').html('It is <strong>' + playersList[currentPlayerIndex].name + '</strong> turn.');
            $('#player_' + (currentPlayerIndex + 1) + '_panel').removeClass('hidden'); 
        });
    });

    // Show first player panel
    currentPlayerIndex = 0;
    $('#player_1_panel').removeClass('hidden');
    $('#pageHeader').html('It is <strong>' + playersList[0].name + '</strong> turn.');

    socket.emit('start_game');
});

function startGame() {
    while (true) {
        playersList.forEach(function (currenPlayer) {
            $("#playerGameTemplate").clone().prependTo("#gameSettingsSection");
        });
    }
}