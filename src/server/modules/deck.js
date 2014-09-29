module.exports = function() {
    var deck = [];

    init();

    function init() {
        deck[51] = 'lala';
    }

    function _getDeck() {
        return deck;
    }

    return {
        getDeck: _getDeck
    };
};