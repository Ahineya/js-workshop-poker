var Game = require('../../src/server/modules/game.js');
var deck = new require('../../src/server/modules/deck.js');
var constants = require('../../src/common/constants.js');
var chai = require('chai');
var sinon = require('sinon');
var _ = require('lodash');

var assert = chai.assert;

describe('Game tests', function() {

    var game, players;

    var socket;

    var wrapSocketFunction = function (fnName, fn) {
        return fn ? sinon.stub(socket, fnName, fn) : sinon.stub(socket, fnName);
    };

    var getPlayers = function () {
        return [
            {
                name: "test1",
                socket: _.cloneDeep(socket),
                id: socket.id,
                coins: 100
            },
            {
                name: "test2",
                socket: _.cloneDeep(socket),
                id: socket.id,
                coins: 100
            },
            {
                name: "test3",
                socket: _.cloneDeep(socket),
                id: socket.id,
                coins: 100
            }
        ];
    };

    beforeEach(function() {
        socket = {
            id: "testId",
            emit: function () {},
            on: sinon.stub()
        };
        players = getPlayers();
        game = new Game();
    });

    it('should add players to game', function() {

        game.addPlayers(players);
        assert.equal(game.players.count(), players.length, 'correct number of players added')
    });

    it('should have start method', function() {
        assert(typeof game.start === "function");
    });

    it('should get correct state after starting a game', function() {
        game.addPlayers(players);

        assert(game.getCurrentStage() === constants.STAGES.FIRST_ROUND, 'before start game is on INIT stage');

        game.start();

        assert(game.getCurrentStage() === constants.STAGES.FIRST_ROUND, 'after game start there are SALES stage');
    });

    it('should emit socket action in start method', function() {
        wrapSocketFunction('emit');
        players = getPlayers();
        game.addPlayers(players);
        game.start();
        assert(game.players.getPlayers()[0].socket.emit.called, 'there was a socket call');

    });

    it('should have correct bank value after start ante', function() {
        game.addPlayers(players);
        game.start();

        assert.equal(game.getBank(), players.length, 'there are correct amount of coins in bank after ante');

    });

    it('should add socket i_turn listener', function() {
        game.addPlayers(players);
        game.start();

        var allListenersAdded = true;

        game.players.getPlayers().forEach(function(player) {
            if (!player.socket.on.called) {
                allListenersAdded = false;
            }
        });

        assert(allListenersAdded, 'all i_turn listeners have been added');
    });

    it('should send GAME_INFO event if params in turn of current player are correct', function() {
        var turnData = {
            turn: constants.TURNS.BET
        };
        wrapSocketFunction('emit');
        players = getPlayers();
        game.addPlayers(players);
        game.start();
        players.forEach(function(player) {
            player.socket.on.withArgs(constants.EVENTS.CLIENT.I_TURN).callsArgWith(1, [turnData]);
        });
        game.currentPlayerIndex = 0;
        game.processTurn(turnData);
        var currentPlayer = game.players.getPlayers()[1];
        assert(currentPlayer.socket.emit.lastCall.args[0] === constants.EVENTS.SERVER.GAME_INFO,
            'send message to next player to make turn');
    });



});