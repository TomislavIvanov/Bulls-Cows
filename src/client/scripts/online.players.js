var socket;
var channelName = '/online_players';
var playerNickName = localStorage['playerNickName'];
// requir helpers


function drawNotification(container, player) {
    container.append(
        '<div id="notification_' + player.id + '" class="alert alert-dismissible alert-warning">' +
        player.name + ' want to play' +
        '<input type="button" class="accepButton" value="Accept" />' +
        '<input type="button" class="declineButton" value="Decline" />' +
        '</div>'
    );

    // attach onclick callbacks
    $('#notification_' + player.id + ' > input.accepButton').on('click', function (e) {
        socket.emit('game_accepted', { hostPlayer: { id: player.id }, guestPlayer: { id: socket.id } });
        var gameId = socket.id + '_vs_' + player.id; 
        window.location.href = '/playerVsPlayer/' + gameId;
        $(this).parent().remove();
    });

    $('#notification_' + player.id + ' > input.declineButton').on('click', function (e) {
        $(this).parent().remove();
    });
}

function drawOfferGameLink(container, player) {
    var onClick = "socket.emit('player_offer_game', '" + player.id + "')";
    container.append(
        '<li id="player_' + player.id + '">'
        + '<input type="button" class="btn btn-link" onclick="' + onClick + ';" value="' + (player.name || player.id) + '" />' +
        '</li>'
    );
}

function onNickNameSaved(nickName) {
    $('#currentUser').html('Hello <strong>' + nickName + '</strong> !!!');
    $('#currentUser').removeClass('hidden');
    $('#usersList').parent().removeClass('hidden');
    $('#dialog').remove();

    localStorage['playerNickName'] = nickName;
}


function registerPlayer(nickName) {
    // validate user name
    if (nickName) {
        socket = socket || io(channelName);
        socket.emit('save_nickname', nickName);

        //TODO: Add bluebird 
        onNickNameSaved(nickName)
        socket
            .on('current_online_players', function (players) {
                if (players.length) {
                    $('#msgWaitForPlayers').hide();
                    $('#usersList').html('');

                    [].forEach.call(players, function (player) {
                        drawOfferGameLink($('#usersList'), player);
                    });
                }
            })
            .on('player_offer_game', function (player) {
                drawNotification($("#notificationsPanel"), player);
            })
            .on('redirect_to_multiplayer', function (playerId) {
                var gameId = playerId + '_vs_' + socket.id;
                window.location.href = '/playerVsPlayer/' + gameId;
            })
            .on('player_connected', function (player) {
                $('#msgWaitForPlayers').hide();
                if (player) {
                    drawOfferGameLink($('#usersList'), player);
                }
            })
            .on('player_disconected', function (playerID) {
                if (playerID) {
                    var selector = '#usersList > li#player_' + playerID;
                    $(selector).remove();
                }

                if ($('#usersList > li').length === 0) {
                    $('#msgWaitForPlayers').show();
                }
            });

    } else {
        alert('Pleaser enter nickname');
    }
};

if (playerNickName) {
    $('#currentUser').html('Hello <strong>' + playerNickName + '</strong> !!!');
    $('#currentUser').removeClass('hidden');
    $('#usersList').parent().removeClass('hidden');
    $('#dialog').addClass('hidden');
    registerPlayer(playerNickName)
} else {
    // Show Dialog for userName
    $('#dialog').removeClass('hidden');
    $(function () {
        $("#dialog").dialog();
    });

    // attach event handlers
    $('#btnSave').on('click', function (e) {
        var nickName = $('#txtNickName').val();
        registerPlayer(nickName);
    });
}


