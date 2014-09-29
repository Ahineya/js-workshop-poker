var _ = require('lodash');

module.exports = function() {
    var deck = [];
    var values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
    var suites = ['S', 'T', 'D', 'H'];

    init();

    function init() {
        deck = values.reduce(function(curr, item) {
            var temp = [];
            suites.forEach(function(suite) {
                temp.push({'value': item, 'suite': suite});
            });

            return curr.concat(temp);
        }, []);
    }

    function _getDeck() {
        return deck;
    }

    function _shuffle() {
        deck = _.shuffle(deck);
    }

    return {
        getDeck: _getDeck,
        shuffle: _shuffle
    };
};