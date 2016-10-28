var socket;
$('#btnSave').on('click', function (e) {
    var nickName = $('#txtNickName').val();
    // validate user name
    if (nickName) {
        socket = socket || io();
        socket.emit('save_nickname', nickName);

        //TODO: Add bluebird 
        onNickNameSaved(nickName)

        // var onOld = socket.on; 
        // socket.on = function (eventName, callback) {
        //     console.log('On message received. Event: ' + eventName);
        //     onOld(eventName, callback);
        //     return socket;
        // }

        // var emitOld = socket.emit;
        // socket.emit = function (eventName, data) {
        //     console.log('Emit event: ' + eventName + ', Data: ' + data);
        //     emitOld(eventName, data);
        // }

        socket
            .on('online_players', function (players) {
                if (players.length) {
                    $('#msgWaitForPlayers').hide();
                    $('#usersList').html('');
                    [].forEach.call(players, function (player) {
                        // var onClick = "javascript:window.location.href='/playerVsPlayer/" + player.id + "';";
                        var onCLick = "socket.io('player_offer_game'," + player.id + ")";

                        $('#usersList').append(
                            '<li id="player_' + player.id + '">'
                            + '<a href="#" class="btn btn-link" onclick="' + onClick + '" >' + (player.name || player.id) + '</a>' +
                            '</li>'
                        );
                    });
                }
            })
            .on('player_offer_game', function (player) {
                $("#notificationsPanel").append(
                    '<div class="alert alert-dismissible alert-warning">' + 
                        player.name  + 'want to play' +
                                '<input type="button" value="Accept" />' +
                        '<input type="button" value="Decline" />' +
                    '</div>'
                );
            })
            .on('player_connected', function (player) {
                $('#msgWaitForPlayers').hide();
                if (player) {
                    var onClick = "javascript:window.location.href='/playerVsPlayer/" + player.id + "';";
                    $('#usersList').append(
                        '<li id="player_' + player.id + '">'
                        + '<a href="#" class="btn btn-link" onclick="' + onClick + '" >' + (player.name || player.id) + '</a>' +
                        '</li>'
                    );
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

var onNickNameSaved = function (nickName) {
    $('#currentUser').html('Hello <strong>' + nickName + '</strong> !!!');
    $('#currentUser').removeClass('hidden');
    $('#usersList').parent().removeClass('hidden');
    $('#dialog').remove();
}

// Make online players list selectable
$(function () {
    $("#usersList").selectable();
});

// Show Dialog for userName
$(function () {
    $("#dialog").dialog();
});
