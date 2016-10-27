var socket = undefined;
$('#btnSave').on('click', function (e) {

    var userName = $('#txtUserName').val();
    // validate user name
    if (userName) {
        socket = socket || io();

        socket.emit('set player name', userName);

        $('#currentUser').html('Hello <strong>' + userName + '</strong> !!!');
        $('#currentUser').removeClass('hidden');
        $('#usersList').parent().removeClass('hidden');
        $('#dialog').remove();

        socket.on('online players', function (players) {
            if (players.length) {
                $('#usersList').html('');
                [].forEach.call(players, function (player) {
                    var onClick = "javascript:window.location.href='/playerVsPlayer/" + player.id + "';";
                    
                    $('#usersList').append(
                        '<li id="player_' + player.id + '">'
                        + '<a href="#" class="btn btn-link" onclick="' + onClick + '" >' + (player.name || player.id) + '</a>' +
                        '</li>'
                    );
                });
            }
        });
    }
});

// Show Dialog for userName
$(function () {
    $("#dialog").dialog();
});