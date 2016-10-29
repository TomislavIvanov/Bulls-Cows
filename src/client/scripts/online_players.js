var socket;
$('#btnSave').on('click', function (e) {
    var nickName = $('#txtNickName').val();
    // validate user name
    if (nickName) {
        socket = socket || io();
        socket.emit('save_nickname', nickName);

        //TODO: Add bluebird 
        onNickNameSaved(nickName)
        socket
            .on('online_players', function (players) {
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
            .on('redirect_to_multiplayer', function (playerID) {
                window.location.href='/playerVsPlayer/' + playerID;
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
});

var drawNotification = function (container, player) {
    container.append(
        '<div id="notification_' + player.id + '" class="alert alert-dismissible alert-warning">' +
        player.name + ' want to play' +
        '<input type="button" class="accepButton" value="Accept" />' +
        '<input type="button" class="declineButton" value="Decline" />' +
        '</div>'
    );

    // attach onclick callbacks
    $('#notification_' + player.id + ' > input.accepButton').on('click', function (e) {
        socket.emit('game_accepted', { source: { id: player.id }, target: { id: socket.id } });
        window.location.href='/playerVsPlayer/' + player.id;        
        $(this).parent().remove();
    });

    $('#notification_' + player.id + ' > input.declineButton').on('click', function (e) {
        $(this).parent().remove();
    });
}

var drawOfferGameLink = function (container, player) {
    var onClick = "socket.emit('player_offer_game', '" + player.id + "')";
    container.append(
        '<li id="player_' + player.id + '">'
        + '<input type="button" class="btn btn-link" onclick="' + onClick + ';" value="' + (player.name || player.id) + '" />'+
        '</li>'
    );
}

var onNickNameSaved = function (nickName) {
    $('#currentUser').html('Hello <strong>' + nickName + '</strong> !!!');
    $('#currentUser').removeClass('hidden');
    $('#usersList').parent().removeClass('hidden');
    $('#dialog').remove();

    localStorage['playerNickName'] = nickName;
}

// Make online players list selectable
$(function () {
    $("#usersList").selectable();
});

// Show Dialog for userName
$(function () {
    $("#dialog").dialog();
});
