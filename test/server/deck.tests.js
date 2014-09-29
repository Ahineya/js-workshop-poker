var Deck = require('../../src/server/modules/deck.js');
var chai = require('chai');

describe('Deck tests', function() {

    var deck;

    beforeEach(function() {
        deck = new Deck();
    });

    it('should build new deck', function() {
        chai.assert.equal(deck.getDeck().length, 52, 'deck contains 52 cards after init');
    });

});