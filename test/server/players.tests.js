var Players = require('../../src/server/modules/players.js');
var chai = require('chai');
var _ = require('lodash');

var assert = chai.assert;

describe('Players tests', function() {

    var players;

    var socket = {
        id: "test-socket-id"
    };

    var rawPlayer = {
        name: "test",
        socket: socket,
        id: socket.id
    };

    beforeEach(function() {
        players = new Players();
    });

    it('should create empty players object', function() {
        assert.equal(players.getPlayers().length, 0, 'there are no added players');
    });

    it('should add new player', function() {

        players.add(rawPlayer);

        assert.equal(players.getPlayers().length, 1, 'there are one added player')

    });

    it('should get player by id', function() {

        players.add(rawPlayer);

        assert(_.isEqual(players.getById(socket.id), rawPlayer), 'got correct player');
    });

});