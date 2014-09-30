var Game = require('../../src/server/modules/game.js');
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

});