(function() {
    console.log("Boilerplate works");

    window.socket = io();

    socket.emit('getHand');

    socket.on('getHand', function(hand) {
        console.log(hand);
    });

})();