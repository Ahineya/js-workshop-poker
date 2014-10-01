(function() {
    console.log("Boilerplate works");

    window.socket = io();

    /*     socket.emit('getHand');

   socket.on('getHand', function(hand) {
        console.log(hand);
    });*/

    socket.on('yourData', function(playerData) {
        console.log('yourData', playerData);
    });

    socket.on('gameStart', function(gameData) {
        console.log('gameStart', gameData);
    });

})();