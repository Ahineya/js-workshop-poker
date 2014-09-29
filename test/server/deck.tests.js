var Deck = require('../../src/server/modules/deck.js');

describe('Deck tests', function() {

    var deck;

    beforeEach(function() {
        deck = new Deck();

    });

    it('should build new deck', function() {
        chai.assert.equal(deck.length, 52, 'deck contains 52 cards after init');
    });
});