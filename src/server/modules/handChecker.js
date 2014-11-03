var _ = require('lodash');

module.exports = (function() {

    var values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

    var countedSuites;
    var countedValues;

    function cardsSort(hand) {
        return _.sortBy(hand, function(card) {
            return values.indexOf(card.value);
        });
    }

    function isContainsEqualSuites() {
        return _.contains(countedSuites, 5);
    }

    function isContainsEqualValues(num) {
        return _.contains(countedValues, num);
    }

    function isRoyalFlush(hand) {
        return isStraightFlush(hand) && _.contains(_.pluck(hand, "value"), "A");
    }

    function isStraightFlush(hand) {
        return isStraight(hand) && isFlush();
    }

    function isFourOfAKind() {
        return isContainsEqualValues(4);
    }

    function isFullHouse() {
        return isContainsEqualValues(3) && isContainsEqualValues(2);
    }

    function isFlush() {
        return isContainsEqualSuites();
    }

    function isStraight(hand) {
        return !!~values.join('').indexOf(_.pluck(hand, "value").join(''));
    }

    function isThreeOfAKind() {
        return  isContainsEqualValues(3);
    }

    function isTwoPairs() {
        return isContainsEqualValues(2) && (_.size(countedValues) === 3);
    }

    function isPair() {
        return isContainsEqualValues(2);
    }

    function isNone() {
        return true;
    }

    var combinations = [
        isRoyalFlush,
        isStraightFlush,
        isFourOfAKind,
        isFullHouse,
        isFlush,
        isStraight,
        isThreeOfAKind,
        isTwoPairs,
        isPair,
        isNone
    ];

    var combNames = combinations.map(function(combFunction) {
        return combFunction.name.slice(2);
    });

    function _findCombination(hand) {

        countedSuites = _.countBy(hand, 'suite');
        countedValues = _.countBy(hand, 'value');
        hand = cardsSort(hand);

        return (combinations.reduce(function(currentResult, combFunction) {
            if (_.size(currentResult) === 0) {
                if (combFunction(hand)) {
                    return {
                        combination: combFunction.name.slice(2)
                    }
                }
            }
            return currentResult;
        },{})).combination;
    }

    function _findWinner() {
        var combinations = [].slice.call(arguments);
        var winning = 100;

        combinations.forEach(function(combination) {
            if (combNames.indexOf(combination) < winning) {
                winning = combNames.indexOf(combination);
            }
        });

        return combNames[winning];

    }

    return {
        findCombination: _findCombination,
        findWinner: _findWinner
    }
})();