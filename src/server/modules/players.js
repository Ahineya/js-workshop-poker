var _ = require('lodash');

module.exports = function() {

    var players = [];

    function _getPlayers() {
        return players;
    }

    function _add( player ) {
        players.push( player );
    }

    function _getPlayerById( id ) {
        return _.find(players, function(player) {
            return player.id = id;
        });
    }

    return {
        add: _add,
        getPlayers: _getPlayers,
        getById: _getPlayerById
    }
};