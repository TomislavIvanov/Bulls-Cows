var socket = io('/player_vs_player');
var playerNumber;

socket
    .on('game_allowed', function (info) {
        $('#btnSubmitNum').removeClass('hidden');
        $('#inputNumber').removeClass('hidden');
    })
    .on('win_game', function (info) {
        $('#winGameMsgLbl').removeClass('hidden');

        $("#btnStartGame").removeClass('hidden');
        $('#btnSubmitNum').addClass('hidden');
        $('#inputNumber').addClass('hidden');
        $('#informationLog > tbody').html('');
        $('#informationLog').addClass('hidden');

        return;
    })
    .on('match_result', function (info) {
        var rowsCount = $('#informationLog tr').length;
        var bullsClass = info.num.bulls > 0 ? 'warning' : '';
        var cowsClass = info.num.cows > 0 ? 'info' : '';
        $('#informationLog').append(
            '<tr>' +
            '<td>' + rowsCount + '</td>' +
            '<th>' + localStorage['playerNickName'] + '</th>' +
            '<td>' + $('#inputNumber').val() + '</td>' +
            '<td class="' + bullsClass + '">' + info.num.bulls + '</td>' +
            '<td class="' + cowsClass + '">' + info.num.cows + '</td>' +
            '</tr>'
        );

        $('#inputNumber').val('');
    })
    .on('suggested_number', function (info) {
        $('#informationLog').removeClass('hidden');

        var rowsCount = $('#informationLog tr').length;
        $('#informationLog').append(
            '<tr>' +
            '<td>' + rowsCount + '</td>' +
            '<td>' + (info.name || 'N/A') + '</td>' +
            '<td>' + info.number + '</td>' +
            '<td><input class="form-control" id="txtBullsCount" type="number" /></td>' +
            '<td><input class="form-control" id="txtCowsCount" type="number" /></td>' +
            '<td><input class="btn btn-default" id="btnSendResponse" type="button" value="Submit"/></td>' +
            '</tr>'
        );

        // Attach callback to send response button
        $("#btnSendResponse").click(function () {
            var cowsCount = $('#txtCowsCount').val() * 1;
            var bullsCount = $('#txtBullsCount').val() * 1;

            if (bullsCount === 4) {
                $(this).remove();
                $('#txtCowsCount').replaceWith('<span>' + cowsCount + '</span>');
                $('#txtBullsCount').replaceWith('<span>' + bullsCount + '</span>');
                $('#lostGameMsgLbl').removeClass('hidden');

                $("#btnStartGame").removeClass('hidden');
                $('#btnSaveNum').addClass('hidden');
                $('#btnSubmitNum').addClass('hidden');
                $('#inputNumber').addClass('hidden');
                $('#txtNumber').val('');
                $('#informationLog > tbody').html('');
                $('#informationLog').addClass('hidden');
                
                socket.emit('opponent_win');
                return;
            }

            // Send message to server
            socket.emit('player_result', { cows: cowsCount, bulls: bullsCount });
            $(this).remove();
            $('#txtCowsCount').replaceWith('<span>' + cowsCount + '</span>');
            $('#txtBullsCount').replaceWith('<span>' + bullsCount + '</span>');
        });
    });




$('#btnStartGame').click(function () {
    $('#winGameMsgLbl').addClass('hidden');
    $('#lostGameMsgLbl').addClass('hidden');

    // Remove all logs from info table
    $('#informationLog > tbody').html('');
    // Hide info table
    $('#informationLog').addClass('hidden');
    // Hide error/success message
    $('#errorMsgLbl').addClass('hidden');
    $('#successMsgLbl').addClass('hidden');
    // Enable input text
    $('#txtNumber').removeClass('hidden');
    // Show submit number button
    $('#btnSaveNum').removeClass('hidden');
    // Hide start button
    $(this).addClass('hidden');
    $('#txtNumber').val('');
    $('#txtNumber').prop('disabled', false);
});

$('#btnSaveNum').click(function () {
    $('#errorMsgLbl').addClass('hidden');
    var number = $('#txtNumber').val() * 1;
    if (isNaN(number) || number < 999) {
        $('#errorMsgLbl').removeClass('hidden');
        $('#txtNumber').val('');
        return;
    }

    $('#txtNumber').prop('disabled', true);
    //$('<strong>Your number is: </strong').insertBefore($('#txtNumber'));
    $(this).addClass('hidden');
    playerNumber = number;

    socket.emit('ready');
});

$('#btnSubmitNum').click(function () {
    var number = $('#inputNumber').val() * 1;
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

    socket.emit('submit_number', {
        number: number,
        name: localStorage['playerNickName']
    });

    $('#informationLog').removeClass('hidden');
});  	