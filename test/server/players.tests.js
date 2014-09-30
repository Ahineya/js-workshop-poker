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
        id: socket.id,
        coins: 100
    };

    var rawHand = [{"value":"K","suite":"H"},{"value":"7","suite":"T"},{"value":"2","suite":"S"},{"value":"K","suite":"S"},{"value":"3","suite":"D"}];

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

    it('should assign a hand to player', function() {
        players.add(rawPlayer);
        players.assignHand(rawPlayer.id, rawHand);
        assert( players.getById(rawPlayer.id).hand instanceof Array, 'player has assigned hand');
    });

    it('should count players', function() {
        players.add(rawPlayer);
        assert.equal(players.count(), 1, 'it has correct count result');
    });

});