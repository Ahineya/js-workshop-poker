(function (exports) {
    var EVENTS = {
        CLIENT: {
            I_TURN: 'iTurn',
            I_EXCHANGE_CARDS: 'iExchangeCards'
        },
        SERVER: {
            START_GAME: 'gameStart',
            YOUR_DATA: 'yourData',
            YOUR_TURN: 'yourTurn',
            ROUND_ENDS: 'roundEnds'
        }
    };
    var CARDS = [
        '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH', 'AH',
        '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', 'AD',
        '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', 'AC',
        '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS', 'AS'
    ];
    var CARD_SUITS = {
        'H': 'hearts',
        'D': 'diams',
        'S': 'spades',
        'C': 'clubs'
    };
    var TURNS = {
        BET: 'bet',
        CALL: 'call',
        PASS: 'pass',
        FOLD: 'fold',
        RAISE: 'raise'
    };
    var STAGES = {
        FIRST_ROUND: "first_round",
        REPLACEMENT: "Replacements ", //second round
        SHOWDOWN: 'Showdown', //third last round
        CARDS_CHANGE: "cards_change",
        TURN_END: "turn_end"
    };
    var CARD_TURNS_MAP = {};
    CARD_TURNS_MAP[STAGES.FIRST_ROUND] = [TURNS.PASS, TURNS.BET, TURNS.FOLD];
    CARD_TURNS_MAP[TURNS.PASS] = [TURNS.PASS, TURNS.BET];
    CARD_TURNS_MAP[TURNS.BET] = [TURNS.PASS, TURNS.CALL, TURNS.RAISE];
    CARD_TURNS_MAP[STAGES.REPLACEMENT] = [TURNS.CALL, TURNS.FOLD];

    var BETS = [1, 5, 10, 50, 100, 500];
    exports.TURNS = TURNS;
    exports.CARD_TURNS_MAP = CARD_TURNS_MAP;
    exports.BETS = BETS;
    exports.CARD_SUITS = CARD_SUITS;
    exports.CARDS = CARDS;
    exports.EVENTS = EVENTS;
    exports.STAGES = STAGES;

})(typeof exports === 'undefined'? window : exports);