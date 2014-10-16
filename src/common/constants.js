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
            ROUND_ENDS: 'roundEnds',
            GAME_INFO: 'game_info',
            REPLACEMENT_TURN: 'replacementTurn',
            SHOWDOWN: 'showdown'
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
        FIRST_ROUND: "first_round", //first round
        REPLACEMENT: "Replacements", //replacements
        SECOND_ROUND: "second_round", //second round
        SHOWDOWN: 'Showdown', //third last round
        SUBSTAGE_AFTER_DEALER: "after_dealer"
    };

    var STAGES_ORDER = [STAGES.FIRST_ROUND, STAGES.REPLACEMENT,STAGES.SECOND_ROUND,STAGES.SHOWDOWN];

    var CARD_TURNS_MAP = {};
    CARD_TURNS_MAP[STAGES.FIRST_ROUND] = [TURNS.PASS, TURNS.BET, TURNS.FOLD];
    CARD_TURNS_MAP[STAGES.SECOND_ROUND] = [TURNS.PASS, TURNS.BET, TURNS.FOLD];
    CARD_TURNS_MAP[TURNS.PASS] = [TURNS.PASS, TURNS.BET, TURNS.FOLD];
    CARD_TURNS_MAP[TURNS.RAISE] = [TURNS.CALL, TURNS.RAISE, TURNS.FOLD];
    CARD_TURNS_MAP[TURNS.BET] = [TURNS.FOLD, TURNS.CALL, TURNS.RAISE];
    CARD_TURNS_MAP[TURNS.CALL] = [TURNS.FOLD, TURNS.CALL, TURNS.RAISE];
    CARD_TURNS_MAP[STAGES.SUBSTAGE_AFTER_DEALER] = [TURNS.CALL, TURNS.FOLD];

    var BETS = [1, 5, 10, 50, 100, 500];
    exports.TURNS = TURNS;
    exports.CARD_TURNS_MAP = CARD_TURNS_MAP;
    exports.BETS = BETS;
    exports.CARD_SUITS = CARD_SUITS;
    exports.CARDS = CARDS;
    exports.EVENTS = EVENTS;
    exports.STAGES = STAGES;
    exports.STAGES_ORDER = STAGES_ORDER;

})(typeof exports === 'undefined'? window : exports);