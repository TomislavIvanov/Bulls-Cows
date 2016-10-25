var path = require('path');

module.exports.add = function (app, express) {
    app.use(express.static('./src/client/'));
    app.use('/', express.static('./src/client/index.html'));
    app.use('/player_vs_computer', express.static('./src/client/player_vs_computer.html'));
    app.use('/computer_vs_player', express.static('./src/client/computer_vs_player.html'));
}