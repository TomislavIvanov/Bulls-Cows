var multiPlayerUsers = {};

module.exports = function (io) {
    io.of('/player_vs_player').on('connection', function (player) {
        multiPlayerUsers[player.id] = { id: player.id, isReady: false };
        
        var currentGameId;
        player
            .on('join_game', function onJoinGame(gameId) {
                // Create room with the host player id. The player who offer multiplayer game is the host
                currentGameId = gameId;
                console.log('Player: ' + player.id + " join game: " + gameId);
                player.join(currentGameId);
            })
            .on('ready', function onPlayerReady() {
                multiPlayerUsers[player.id].isReady = true;
                var allPlayersAreReady = Object.keys(multiPlayerUsers).some(function (playerID) {
                    return !multiPlayerUsers[playerID].isReady;
                });

                if (allPlayersAreReady) {
                    player.broadcast.to(currentGameId).emit('message', 'game_allowed');
                }
            })
            .on('opponent_win', function onLose() {
                player.broadcast.to(currentGameId).emit('win_game');
                Object.keys(multiPlayerUsers).forEach(function (playerID) {
                    multiPlayerUsers[playerID].isReady = false;
                });
            })
            .on('match_result', function onMatchResultReceived(result) {
                player.broadcast.to(currentGameId).emit('match_result', result);
            })
            .on('player_result', function onMatchResultReceived(result) {
                player.broadcast.to(currentGameId).emit('match_result', { num: result, playerName: player.id });
            })
            .on('submit_number', function onNumberSubmited(info) {
                player.broadcast.to(currentGameId).emit('suggested_number', info);
            })
            .on('disconnect', function () {
                console.log('Player leaves multiplayer game');
                // Remove from list when disconnected       
                delete multiPlayerUsers[player.id];
                // notify all players except sender
                //player.broadcast.emit('player_disconected', player.id);
            });
    });
}