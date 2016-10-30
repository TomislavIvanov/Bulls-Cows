var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    port = 3000;

// Apply application configuration
require('./apply.app.config.js')(app, express);

// Regirster routes
require('./app.routes.js')(app);

// Add different channels
require('./channels/player.guesses.number')(io);
require('./channels/computer.guesses.number')(io);
require('./channels/online.players.js')(io);
require('./channels/player.vs.player.js')(io);
require('./channels/n.players.vs.computer.js')(io);

http.listen(port, function () {
    'use strict';
    console.log('listening on port:' + port);
});

