module.exports = {
    singlePlayer: {
        pcVsPlayer: require('./pc.vs.player.js'),
        playerVsPC: require('./player.vs.pc.js')
    },
    multiPlayer: {
        nPlayersVsPC: null,
        playerVsPlayer: require('./player.vs.player.js'),
    }
}