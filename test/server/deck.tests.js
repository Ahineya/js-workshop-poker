var Deck = require('../../src/server/modules/deck.js');
var chai = require('chai');
var _ = require('lodash');

var assert = chai.assert;

describe('Deck tests', function() {

    var DECK_LENGTH = 52;
    var CARDS_IN_HAND = 5;

    var deck;

    var rawDeck = getRawDeck();

    beforeEach(function() {
        deck = new Deck();
    });

    it('should build new deck', function() {
        assert.equal(deck.getDeck().length, DECK_LENGTH, 'deck contains ' + DECK_LENGTH + ' cards after init');
        assert(_.isEqual(deck.getDeck(), rawDeck), 'deck equals sorted deck');
    });

    it('should shuffle deck', function() {
        deck.shuffle();
        assert(!_.isEqual(deck.getDeck(), rawDeck, 'shuffled deck not equals sorted deck'));
    });

    it('should give cards in a hand', function() {

        var hand = deck.give( CARDS_IN_HAND );

        assert(hand.length === CARDS_IN_HAND, 'gives correct amount of cards from deck');
        assert(deck.getDeck().length === DECK_LENGTH - CARDS_IN_HAND, 'removes proper count of cards from deck');

    });

});

function getRawDeck() {
    return [
        {"value": "A", "suite": "S"},
        {"value": "A", "suite": "C"},
        {"value": "A", "suite": "D"},
        {"value": "A", "suite": "H"},
        {"value": "2", "suite": "S"},
        {"value": "2", "suite": "C"},
        {"value": "2", "suite": "D"},
        {"value": "2", "suite": "H"},
        {"value": "3", "suite": "S"},
        {"value": "3", "suite": "C"},
        {"value": "3", "suite": "D"},
        {"value": "3", "suite": "H"},
        {"value": "4", "suite": "S"},
        {"value": "4", "suite": "C"},
        {"value": "4", "suite": "D"},
        {"value": "4", "suite": "H"},
        {"value": "5", "suite": "S"},
        {"value": "5", "suite": "C"},
        {"value": "5", "suite": "D"},
        {"value": "5", "suite": "H"},
        {"value": "6", "suite": "S"},
        {"value": "6", "suite": "C"},
        {"value": "6", "suite": "D"},
        {"value": "6", "suite": "H"},
        {"value": "7", "suite": "S"},
        {"value": "7", "suite": "C"},
        {"value": "7", "suite": "D"},
        {"value": "7", "suite": "H"},
        {"value": "8", "suite": "S"},
        {"value": "8", "suite": "C"},
        {"value": "8", "suite": "D"},
        {"value": "8", "suite": "H"},
        {"value": "9", "suite": "S"},
        {"value": "9", "suite": "C"},
        {"value": "9", "suite": "D"},
        {"value": "9", "suite": "H"},
        {"value": "10", "suite": "S"},
        {"value": "10", "suite": "C"},
        {"value": "10", "suite": "D"},
        {"value": "10", "suite": "H"},
        {"value": "J", "suite": "S"},
        {"value": "J", "suite": "C"},
        {"value": "J", "suite": "D"},
        {"value": "J", "suite": "H"},
        {"value": "Q", "suite": "S"},
        {"value": "Q", "suite": "C"},
        {"value": "Q", "suite": "D"},
        {"value": "Q", "suite": "H"},
        {"value": "K", "suite": "S"},
        {"value": "K", "suite": "C"},
        {"value": "K", "suite": "D"},
        {"value": "K", "suite": "H"}
    ];
}