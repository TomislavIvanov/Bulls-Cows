module.exports = {
    singlePlayer: {
        playerGuessesNumber: require('./single.player/player.guesses.number.js'),
        computerGuessesNumber: require('./single.player/computer.guesses.number.js')
    },
    multiPlayer: {
        nPlayersVsPC: require('./multi.player/n.players.vs.computer.js'),
    }
}