var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    parser = require('body-parser');

app.use(parser.json());
app.use(parser.urlencoded());
app.use(express.static(__dirname + '/'));

require('./src/application.js')(app, http);

http.listen(3000, function () {
    'use strict';
    console.log('listening on *:3000');
});