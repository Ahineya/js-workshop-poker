var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require('method-override');

var Deck = require('./modules/deck.js');
var deck = new Deck();

var Players = require('./modules/players.js');
var players = new Players();

var Game = require('./modules/game.js');

var config = require('./config.js');
var mongoose = require('mongoose');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
        clientID: config.oauth.facebook.clientID,
        clientSecret: config.oauth.facebook.clientSecret,
        callbackURL: config.oauth.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            return done(null, profile);
        });
    }
));

deck.shuffle();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../../public'));
app.set('views', __dirname + '/../../public');

app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride());
app.use(session({ secret: 'js-workshop-poker' }));

app.use(passport.initialize());
app.use(passport.session());

var server = require('http').createServer(app);
var io = require('socket.io')(server);

//We need to use router here
app.get('/', function(req, res){
    var data = {};
    if (req.isAuthenticated()) {
        data = req.user;
    }
    res.render('index', {user: data});
});



app.get('/account',
    ensureAuthenticated,
    function(req, res) {
        console.log(req.user);
        res.render('account', {user: req.user});
    }
);

app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function(req, res){
    });

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/account');
    });
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/')
}

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

io.on('connection', function(socket) {

    console.log("Connected: ", socket.id);

    var player = {
        name: socket.id,
        id: socket.id,
        coins: 100
    };

    socket.emit('yourData', player);

    player.socket= socket;
    players.add(player);

    socket.emit(
        'playersList',
        getSerialazablePlayers()
    );

    socket.broadcast.emit(
        'playersList',
        getSerialazablePlayers()
    );

    if(players.count() === 3) {
        var game = new Game();
        game.addPlayers(players.getPlayers());
        game.start();
        console.log('game started!');
        console.log('current stage is: ' + game.getCurrentStage());
    }

    socket.on('test', function() {
        console.log('Sockets are working');
    });

});

server.listen(process.env.PORT || 8080, function() {
    console.log('Listening on port %d', server.address().port);
});