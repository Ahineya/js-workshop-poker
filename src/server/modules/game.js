var Players = require('./players.js');
var Deck = require('./deck.js');
var _ = require('lodash');
var constants = require('../../common/constants.js');

module.exports = function() {
    var players = new Players();
    var deck;
    var bank = 0;
    var gameState = {};

    gameState.stage = constants.STAGES.FIRST_ROUND;

    var turn = 1;

    var dealer;
    var currentPlayerIndex;
    var currentPlayer;

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

        currentPlayerIndex = 0;//_.random(players.length-1);
        currentPlayer = players.getPlayers()[currentPlayerIndex];

        _.extend(gameState, {
            players: getSerialazablePlayers(players),
            bank: bank,
            turn: turn,
            currentPlayerId: currentPlayer.id
        });

        players.forEach(function(player) {
            player.socket.emit(
                constants.EVENTS.SERVER.START_GAME,
                _.extend({}, gameState, {
                    players: cutGameStateForPlayer(_.cloneDeep(gameState), player.id)
                })
            );

            player.socket.on(
                constants.EVENTS.CLIENT.I_TURN,
                _processTurn
            )

        });

        gameState.stage = constants.STAGES.FIRST_ROUND;

        currentPlayer.socket.emit(constants.EVENTS.SERVER.YOUR_TURN, {
            turnOptions: constants.CARD_TURNS_MAP[gameState.stage]
        });

    }

    function _processTurn(playerTurnData) {
        if (_.contains(constants.TURNS, playerTurnData.turn)) {
            var turnOptions;
            if (currentPlayerIndex >= players.getPlayers().length -1 ) {
                if (gameState.stage == constants.STAGES.FIRST_ROUND) {
                    gameState.stage = constants.STAGES.REPLACEMENT;
                }
                else if (gameState.stage == constants.STAGES.REPLACEMENT) {
                    gameState.stage = constants.STAGES.SHOWDOWN;
                }
                turnOptions = constants.CARD_TURNS_MAP[gameState.stage];
                currentPlayerIndex = -1;
            } else {
                turnOptions = constants.CARD_TURNS_MAP[playerTurnData.turn];
            }
            currentPlayerIndex++;
            if (currentPlayerIndex == players.getPlayers().length) {
                currentPlayerIndex = 0;
            }

            currentPlayer = players.getPlayers()[currentPlayerIndex];
            currentPlayer.socket.emit(constants.EVENTS.SERVER.YOUR_TURN, {
                turnOptions: turnOptions
            });
        }
    }

    function _ante() {
        bank = players.ante(1);
    }

    function _getBank() {
        return bank;
    }

    function _getCurrentStage() {
        return gameState.stage;
    }

    return {
        addPlayers: _addPlayers,
        players: players,
        start: _start,
        getBank: _getBank,
        getCurrentStage: _getCurrentStage,
        processTurn: _processTurn,
        currentPlayerIndex: currentPlayerIndex
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