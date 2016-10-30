var onlinePlayers = {};

module.exports = function (io) {
    var channelName = '/online_players';
    io.of(channelName).on('connection', function (player) {
        // get playerSocket id without the namespace preffix
        var playerId = player.id.split('#')[1];
        console.log('New player is connected (ID: ' + playerId + ')');

        // Add player to the list
        onlinePlayers[playerId] = { name: playerId };

        player
            .on('save_nickname', function (nickName) {
                var ids = Object.keys(onlinePlayers);
                var playersCount = ids.length;

                // Current player is the only one
                if (playersCount > 1) {
                    player.broadcast.emit('player_connected', { id: playerId, name: nickName || 'N/A' });
                    var players = ids
                        .filter(function (currentID) { return currentID !== playerId })
                        .map(function (currentID) {
                            return { id: currentID, name: onlinePlayers[currentID].name || currentID };
                        });

                    player.emit('current_online_players', players)
                }

                onlinePlayers[playerId].name = nickName;
            })
            .on('game_accepted', function onGameAccepted(gameDetails) {
                // player.broadcast.emit('redirect_to_multiplayer', gameDetails.hostPlayer.id);
                player.broadcast.emit('redirect_to_multiplayer', gameDetails.guestPlayer.id);
            })
            .on('player_offer_game', function (opponentId) {
                player.broadcast
                    .to(channelName + '#' + opponentId)
                    .emit('player_offer_game', {
                        id: playerId,
                        name: onlinePlayers[playerId].name
                    });
            })
            .on('disconnect', function () {
                console.log('Player is disconnected (ID: ' + playerId + ') Name: ' + onlinePlayers[playerId].name);

                // Remove player from list when disconnected       
                delete onlinePlayers[playerId];

                // notify all clients except sender
                player.broadcast.emit('player_disconected', playerId);
            });
    });
}