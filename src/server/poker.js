var express = require('express');
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
var FacebookStrategy = require('passport-facebook').Strategy;

mongoose.connect(config.mongodb);

var User = mongoose.model('User', {
    oauthID: Number,
    name: String,
    created: Date,
    coins: Number
});

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

passport.use(new FacebookStrategy({
        clientID: config.oauth.facebook.clientID,
        clientSecret: config.oauth.facebook.clientSecret,
        callbackURL: config.oauth.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ oauthID: profile.id }, function(err, user) {
            if(err) { console.log(err); }
            if (!err && user != null) {
                done(null, user);
            } else {
                user = new User({
                    oauthID: profile.id,
                    name: profile.displayName,
                    created: Date.now(),
                    coins: 1000
                });
                user.save(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("saving user ...");
                        done(null, user);
                    }
                });
            }
        });
    }
));

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
    saveUninitialized: true
}));

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

app.get('/auth', function(req, res) {
    res.render('auth');
});

app.get('/account', ensureAuthenticated, function(req, res){
    User.findById(req.session.passport.user, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('account', { user: user});
        }
    });
});

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