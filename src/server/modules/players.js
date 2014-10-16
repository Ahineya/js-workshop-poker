var _ = require('lodash');
/***
 * Players module
 * @returns {{add: _add, getPlayers: _getPlayers, getById: _getPlayerById, assignHand: _assignHand}}
 */
module.exports = function() {

    /**
     * {
            name: "test",
            socket: socket,
            id: socket.id,
            coins: 100
        }
     * @type {Array}
     */
    var players = [];

    function _getPlayers() {
        return players;
    }

    function _add( player ) {
        players.push( player );
    }

    function _getPlayerById( id ) {
        return _.find(players, {"id":id});
    }

    function _assignHand(id, hand) {
        for (var i=0; i<players.length; i++) {
            if (players[i].id === id) {
                players[i].hand = hand;
                return true;
            }
        }
        return false;
    }

    function _count() {
        return players.length;
    }

    function _ante(amount) {
        players = players.map(function(item) {
            item.coins-=amount;
            return item;
        });
        return amount * players.length;
    }

    function _forEach(f) {
        return players.forEach(f);
    }

    function _bet(playerIndex, amount) {
        players[playerIndex].coins -= amount;
    }

    return {
        add: _add,
        getPlayers: _getPlayers,
        getById: _getPlayerById,
        assignHand: _assignHand,
        count: _count,
        ante: _ante,
        forEach: _forEach,
        bet: _bet
    }
};