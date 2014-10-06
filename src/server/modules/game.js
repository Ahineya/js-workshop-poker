var Players = require('./players.js');
var Deck = require('./deck.js');
var _ = require('lodash');

module.exports = function() {
    var players = new Players();
    var deck;
    var bank = 0;
    var gameState = {};

    var STAGES = {
        INIT: "init",
        SALES: "sales",
        CARDS_CHANGE: "cards_change",
        TURN_END: "turn_end"
    };

    var stage = STAGES.INIT;

    var turn = 1;

    var dealer;

    function _addPlayers(playersArr) {
        playersArr.forEach(function(player) {
            players.add(player);
        });
    }

    function _start() {
        deck = new Deck();
        deck.shuffle();

        _ante();

        players.forEach(function(player) {
            player.hand = deck.give(5);
        });

        dealer = players.getPlayers()[_.random(players.length-1)];

        gameState = {
            players: getSerialazablePlayers(players),
            bank: bank,
            turn: turn,
            dealer: dealer.id
        };

        players.forEach(function(player) {
            player.socket.emit(
                'gameStart',
                _.extend({}, gameState, {
                    players: cutGameStateForPlayer(_.cloneDeep(gameState), player.id)
                })
            )
        });

        stage = STAGES.SALES;

        dealer.socket.emit('yourTurn', {
            turnOptions: ['call', 'fold', 'raise']
        });

    }

    function _ante() {
        bank = players.ante(1);
    }

    function _getBank() {
        return bank;
    }

    function _getCurrentStage() {
        return stage;
    }

    return {
        addPlayers: _addPlayers,
        players: players,
        start: _start,
        getBank: _getBank,
        getCurrentStage: _getCurrentStage
    }

};

function getSerialazablePlayers(players) {
    return (players
        .getPlayers()
        .map(function(item){
            return {
                name: item.name,
                id: item.id,
                coins: item.coins,
                hand: item.hand
            }
        }))
}

function cutGameStateForPlayer(gameState, playerId) {
    return gameState.players.map(function(player) {
        if (player.id !== playerId) {
            player.hand = [];
        }
        return player;
    });
}