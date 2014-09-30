var Players = require('../../src/server/modules/players.js');
var chai = require('chai');
var _ = require('lodash');

var assert = chai.assert;

xdescribe('Players tests', function() {

    var players;

    beforeEach(function() {
        players = new Players();
    });

    it('should create empry players object', function() {
        assert.equals(players.getPlayers().length, 0, 'there are no added players');
    });

    it('should add new player', function() {
        var socket = {
            id: "test socket id"
        };
        players.add({
            name: "loh",
            socket: socket,
            id: socket.id
        });

        assert.equals(players.getPlayers().length, 0, 'there are one added player')

    });

});