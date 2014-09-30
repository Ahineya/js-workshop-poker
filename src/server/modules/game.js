var Players = require('./players.js');

module.exports = function() {
    var players = new Players();

    function _addPlayers(playersArr) {
        playersArr.forEach(function(player) {
            players.add(player);
        });
    }

    return {
        addPlayers: _addPlayers,
        players: players
    }

};