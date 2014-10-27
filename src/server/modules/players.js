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

    function _currentTurn(playerIndex, currentTurn) {
        players[playerIndex].currentTurn = currentTurn;
    }
    /* jshint ignore:start */

    function _replaceCards(id, cards, replacement) {
        for (var i=0; i<players.length; i++) {
            if (players[i].id === id) {

                cards = cards.map(function(card) {

                    var res = card.match(/(.*)(.$)/);
                    return {
                        value: res[1],
                        suite: res[2]
                    }

                });

                cards.forEach( function(card) {
                    players[i].hand.splice(_.findIndex(players[i].hand, card), 1);
                });

                players[i].hand = _.union(players[i].hand, replacement);

                return true;
            }
        }
        return false;
    }

    /* jshint ignore:end */


    return {
        add: _add,
        getPlayers: _getPlayers,
        getById: _getPlayerById,
        assignHand: _assignHand,
        replaceCards: _replaceCards,
        count: _count,
        ante: _ante,
        forEach: _forEach,
        bet: _bet,
        currentTurn: _currentTurn
    }
};