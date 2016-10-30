var compression = require('compression'),
    path = require('path'),
    exphbs = require('express-handlebars');

module.exports = function (app, express) {
    // gzip compression
    app.use(compression());

    // Set handlebars as view engine
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname + '/../client/views/layouts')
    }));
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname + '/../client/views'));

    // Set static resources
    app.use(express.static('./src/client/'));
    app.use('/bower_components', express.static('./bower_components'));

}