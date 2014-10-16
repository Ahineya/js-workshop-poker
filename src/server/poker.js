var express = require('express');
var constants = require('../common/constants.js');

var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var morgan = require('morgan');

var Deck = require('./modules/deck.js');
var deck = new Deck();

var Players = require('./modules/players.js');
var players = new Players();

var Game = require('./modules/game.js');

var config = require('./config.js');
var mongoose = require('mongoose');
var passport = require('passport');

var MongoStore = require('connect-mongo')(session);
var passportSocketIo = require("passport.socketio");

mongoose.connect(config.mongodb);
    var mongoStore = new MongoStore({
        db : 'js-workshop-poker',
        mongoose_connection: mongoose.connections[0]
    }, function() {

    var User = require('./modules/User.js');

    passport.serializeUser(function(user, done) {
        console.log('serializeUser: ' + user._id);
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user){
            console.log(user);
            if(!err) done(null, user);
            else done(err, null);
        })
    });

    passport.use( require('./modules/Passport.js').Facebook(config) );

    deck.shuffle();

    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/../../public'));
    app.set('views', __dirname + '/../../public');

    app.use(morgan('combined', {
        skip: function (req, res) { return res.statusCode < 400 }
    }));

    app.use(cookieParser());
    app.use(bodyParser());
    app.use(methodOverride());
    app.use(session({
        secret: 'js-workshop-poker',
        resave: true,
        saveUninitialized: true,
        store: mongoStore
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    var server = require('http').createServer(app);
    var io = require('socket.io')(server);

    require('./routes.js')(app, passport, User);

    function getSerialazablePlayers() {
        return (players
            .getPlayers()
            .map(function(item){
                return {
                    name: item.name,
                    id: item.id,
                    coins: item.coins
                }
            }))
    }

    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key:         'connect.sid',
        secret:      'js-workshop-poker',
        store:       mongoStore,
        success:     onAuthorizeSuccess,
        fail:        onAuthorizeFail
    }));

    function onAuthorizeSuccess(data, accept){
        console.log('successful connection to socket.io');

        accept(null, true);

    }

    function onAuthorizeFail(data, message, error, accept){
        if(error)
            throw new Error(message);
        console.log('failed connection to socket.io:', message);

        accept(null, false);

    }

    io.on('connection', function(socket) {

        console.log("Connected: ", socket.id);
        console.log(socket.request.user.logged_in);

        var player = {
            name: socket.request.user.name,
            id: socket.id,
            coins: socket.request.user.coins
        };

        socket.emit(constants.EVENTS.SERVER.YOUR_DATA, player);

        player.socket = socket;
        players.add(player);


        if(players.count() === 3) {
            var game = new Game();
            game.addPlayers(players.getPlayers());
            game.start();
            console.log('game started!');
            console.log('current stage is: ' + game.getCurrentStage());

            socket.on('test', function() {
                console.log('Sockets are working');

                game = new Game();
                game.addPlayers(players.getPlayers());
                game.start();
                console.log('game started!');
                console.log('current stage is: ' + game.getCurrentStage());

            });

        }

    });

    server.listen(process.env.PORT || 8080, function() {
        console.log('Listening on port %d', server.address().port);
    });
});

