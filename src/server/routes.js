var path = require('path');

module.exports = function (app, express) {
    app.use(express.static('./src/client/'));
    app.use('/', express.static('client/home.html'));
    app.use('/bower_components', express.static('./bower_components'));
    app.use('/player_guesses_number', express.static('./src/client/player_guesses_number.html'));
    app.use('/computer_guesses_number', express.static('./src/client/computer_guesses_number.html'));
    app.use('/online_players', express.static('./src/client/online_players.html'));
}