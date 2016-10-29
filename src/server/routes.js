var path = require('path');

module.exports = function (app, express) {
    // Set static resources
    app.use(express.static('./src/client/'));
    app.use('/bower_components', express.static('./bower_components'));

    // Set main routes
    app.get('/', function (req, res) {
        res.render('home', { body: 'gosho' });
    }).get('/online_players', function (req, res) {
        res.render('online-players', { body: 'gosho' });
    }).get('/player_guesses_number', function (req, res) {
        res.render('player-guesses-number', { body: 'gosho' });
    }).get('/computer_guesses_number', function (req, res) {
        res.render('computer-guesses-number', { body: 'gosho' });
    }).get('/playerVsPlayer/:playerID', function (req, res) {
        var requestedPlayer = playersList[req.params.playerID];
        if (requestedPlayer) {
            res.render('player-vs-player', { otherPlayer: requestedPlayer.name });
        }
    })
}