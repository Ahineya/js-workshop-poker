var express = require('express');
var app = express();

var test = require('./modules/test.js');

test.test();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../../public'));
app.set('views', __dirname + '/../../public');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.get('/', function(req, res){
    res.render('index');
});

io.on('connection', function(socket) {
    console.log("Connected: ", socket.id);

    socket.on('test', function() {
        console.log('Sockets are working');
    });

});

server.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});