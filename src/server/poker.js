var express = require('express');
var app = express();

var Deck = require('./modules/deck.js');
var deck = new Deck();

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

io.on('connection', function(socket) {
    console.log("Connected: ", socket.id);

    socket.on('test', function() {
        console.log('Sockets are working');
    });

    socket.on('getHand', function(){
        console.log('here');
        socket.emit('getHand', deck.getDeck().slice(0,5));
    });

});

server.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});