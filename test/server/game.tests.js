var Game = require('../../src/server/modules/game.js');
var deck = new require('../../src/server/modules/deck.js');
var chai = require('chai');
var _ = require('lodash');

var assert = chai.assert;

describe('Game tests', function() {

    var game;

    var socket = {
        id: "test-socket-id"
    };

    var players = [
        {
            name: "test1",
            socket: socket,
            id: socket.id,
            coins: 100
        },
        {
            name: "test2",
            socket: socket,
            id: socket.id,
            coins: 100
        },
        {
            name: "test3",
            socket: socket,
            id: socket.id,
            coins: 100
        }
    ]

    beforeEach(function() {
        game = new Game();
    });

    it('should add players to game', function() {
        game.addPlayers(players);
        assert.equal(game.players.count(), players.length, 'correct number of players added')
    });

    it('should have start method', function() {
        assert(typeof game.start === "function");
    });

    it('should have correct bank value after start ante', function() {
        game.addPlayers(players);
        game.start();

        assert.equal(game.getBank(), players.length, 'there are correct amount of coins in bank after ante');

    });



});