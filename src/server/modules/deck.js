module.exports = function() {
    var deck = [];

    init();

    function init() {

    }

    function _getDeck() {
        return deck;
    }

    return {
        getDeck: _getDeck
    };
};