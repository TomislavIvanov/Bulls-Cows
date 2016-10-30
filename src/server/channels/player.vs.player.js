// Store all current multiplayers games
// Every game from the list will contains list of two players
// Store list of players and not just player 1 and player 2. Option for more than 2 players
const playersCountPerMultiplayerGame = 2;
var gamesList = {};

module.exports = function (io) {
    var channelName = '/player_vs_player';
    io.of(channelName).on('connection', function onPlayerConnection(player) {
        // Holds current joint player game
        var currentJoinedGameId;
        player
            .on('join_game', function onJoinGame(gameInfo) {
                var gameId = gameInfo.gameId;
                var playerName = gameInfo.playerName;
                if (gameId) {
                    console.log('Player: ' + player.id + " join game: " + gameId);
                    // Player join or create the game.
                    player.join(gameId);

                    // Add game to the games list if this is the first player.
                    gamesList[gameId] = gamesList[gameId] || {};
                    var playersList = gamesList[gameId];
                    playersList[player.id] = { name: playerName || player.id, isReady: false };
                    currentJoinedGameId = gameId;

                    var playersIds = Object.keys(playersList); 
                    // If both players are joined send players nicknames
                    if (playersIds.length === playersCountPerMultiplayerGame) {
                        playersIds.forEach(function (playerId) {
                            var playerName = playersList[playerId].name;
                            if (player.id === playerId) {
                                player.broadcast.to(currentJoinedGameId).emit('opponent_nickname', playerName);
                            } else {
                                player.emit('opponent_nickname', playerName);
                            }

                        })

                    }
                } else {
                    console.log('Invalid game ID ' + gameId);
                }
            })
            // Fires when player saves his number on his side and is ready for a game
            .on('ready', function onPlayerReady() {
                var playersList = gamesList[currentJoinedGameId];
                playersList[player.id].isReady = true;
                var bothPlayersAreReady = !Object.keys(playersList).some(function (playerID) {
                    return !playersList[playerID].isReady;
                });

                if (bothPlayersAreReady) {
                    io.of(channelName).to(currentJoinedGameId).emit('game_allowed');
                }
            })
            .on('opponent_win', function onLose() {
                var playersList = gamesList[currentJoinedGameId];
                player.broadcast.to(currentJoinedGameId).emit('win_game');

                Object.keys(playersList).forEach(function (playerID) {
                    playersList[playerID].isReady = false;
                });
            })
            // Just for communication between the players
            .on('match_result', function onMatchResultReceived(result) {
                player.broadcast.to(currentJoinedGameId).emit.emit('match_result', result);
            })
            // TODO: rename
            .on('player_result', function onMatchResultReceived(result) {
                player.broadcast.to(currentJoinedGameId).emit('match_result', { num: result, playerName: player.id });
            })
            // Send to player suggested number to opponent 
            .on('submit_number', function onNumberSubmited(info) {
                //io.of(channelName).broadcast.to(currentJoinedGameId).emit('suggested_number', info);
                player.broadcast.to(currentJoinedGameId).emit('suggested_number', info);
            })
            .on('disconnect', function onDisconnect() {
                console.log('Player leaves multiplayer game');

                var currentGame = gamesList[currentJoinedGameId];
                // Check if current game id is set and if such game exist
                if (currentJoinedGameId && currentGame) {
                    // leave game (socket.io room)
                    player.leave(currentJoinedGameId);

                    // delete player from current game players list
                    delete currentGame[player.id];

                    var currentGamePlayersIds = Object.keys(currentGame);
                    if (currentGamePlayersIds.length === 0) {
                        // TODO: maybe is better if we cancel the game if some of the players is disconnected
                        // delete game when both players are disconnected
                        delete gamesList[currentJoinedGameId];
                    }
                }


            });
    });
}