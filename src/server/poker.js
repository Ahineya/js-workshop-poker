var express = require('express');
var app = express();

var Deck = require('./modules/deck.js');
var deck = new Deck();

var Players = require('./modules/players.js');
var players = new Players();

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

    players.add({
        name: socket.id,
        socket: socket,
        id: socket.id,
        coins: 100
    });

    socket.emit(
        'playersList',
        getSerialazablePlayers()
    );

    socket.broadcast.emit(
        'playersList',
        getSerialazablePlayers()
    );

    socket.on('test', function() {
        console.log('Sockets are working');
    });

    socket.on('getHand', function(){
        socket.emit('getHand', deck.getDeck().slice(0,5));
    });

});

server.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});