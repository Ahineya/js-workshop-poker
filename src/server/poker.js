var express = require('express');
var app = express();
var passport = require('passport');

var Deck = require('./modules/deck.js');
var deck = new Deck();

var Players = require('./modules/players.js');
var players = new Players();

var Game = require('./modules/game.js');

deck.shuffle();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../../public'));
app.set('views', __dirname + '/../../public');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

//We need to use router here
app.get('/', function(req, res){
    res.render('index');
});

app.get('/auth/facebook',
    passport.authenticate('facebook'),
    function(req, res){
    }
);
app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/account');
    }
);

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
        console.log('game started');
        console.log('current stage is: ' + game.getCurrentStage());
    }

    socket.on('test', function() {
        console.log('Sockets are working');
    });

});

server.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});