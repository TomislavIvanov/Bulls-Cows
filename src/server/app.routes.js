module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('home');
    }).get('/online_players', function (req, res) {
        res.render('online-players');
    }).get('/player_guesses_number', function (req, res) {
        res.render('player-guesses-number');
    }).get('/computer_guesses_number', function (req, res) {
        res.render('computer-guesses-number');
    }).get('/playerVsPlayer/:gameId', function (req, res) {
        console.log('generated game id: ' + req.params.gameId);
        res.render('player-vs-player', { gameId: req.params.gameId });
    })
}