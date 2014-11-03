document.addEventListener('polymer-ready', function () {
    describe('Play table tests', function () {
        var playTable, socketWaitForGameStartStub, cards, account, gameData;
        beforeEach(function () {
            socketWaitForGameStartStub = pockerSandbox.stub(socket, 'on');
            playTable = new PlayTable();
        });

        it('should wait for start of game', function () {
            expect(socketWaitForGameStartStub.firstCall.args[0]).toEqual(EVENTS.SERVER.START_GAME);
        });

        it('should wait for getting my hand of game', function () {
            expect(socketWaitForGameStartStub.secondCall.args[0]).toEqual(EVENTS.SERVER.YOUR_DATA);
        });

        it('should wait for turn in game', function () {
            expect(socketWaitForGameStartStub.thirdCall.args[0]).toEqual(EVENTS.SERVER.YOUR_TURN);
        });

        it('should get correct card styling', function () {
            for (var i = 0; i < CARDS.length; i++) {
                var card = CARDS[i];
                var value = card.substr(0, card.length - 1);
                var suit = card.substr(card.length - 1, 1);
                var cardElement = document.createElement('div');
                cardElement.classList.add('card');
                cardElement.classList.add('rank' + card);
                cardElement.innerHTML = value + ' <br/> &' + CARD_SUITS[suit] + ';';
                var actualElement = playTable.$.playerHand.getPlayCardElement(card);
                expect(actualElement.innerHTML).toEqual(cardElement.innerHTML);
                expect(actualElement.classList.toString()).toEqual(cardElement.classList.toString());
            }
        });

        it('should generate correct playStack', function () {
            var getPlayCardElementStub = pockerSandbox.stub(playTable.$.playerHand, 'getPlayCardElement').returns(document.
                createElement('div'));
            playTable.$.playerHand.generateCardStack([
                {},
                {},
                {}
            ]);
            expect(getPlayCardElementStub.callCount).toEqual(3);
        });

        it('should save credentials when data is sent', function () {
            var accountCredentials = {};
            playTable.onYourData(accountCredentials);
            expect(playTable.account).toBe(accountCredentials);
        });

        it('should generate play stack, when it comes to player', function () {
            var generateCardStackStub = pockerSandbox.stub(playTable.$.playerHand, 'generateCardStack');
            playTable.account = account;
            playTable.onStartGame(cards);
            expect(generateCardStackStub.firstCall.args[0]).toEqual(['9D', '7D', '2S', 'AS', 'AC']);
        });

        it('should generate other players hands', function () {
            var playerHand = document.createElement('div');
            for (var i = 0; i < 5; i++) {
                var hiddenCard = document.createElement('div');
                hiddenCard.classList.add('card');
                hiddenCard.classList.add('cover');
                playerHand.appendChild(hiddenCard);
            }
            playTable.generatePlayTableWithActions(cards);
            expect(playTable.$.leftPlayerHand.innerHTML).toEqual(playerHand.innerHTML);
            expect(playTable.$.rightPlayerHand.innerHTML).toEqual(playerHand.innerHTML);
        });

        it('should lock table if player do not turn', function () {
            playTable.account = account;
            playTable.generatePlayTableWithActions(cards);
            expect(playTable.$.modalMask.classList.contains('visible')).toEqual(true);
        });

        it('should activate turn options when player receives turn', function () {
            var yourTurnData = {
                turnOptions: [TURNS.CALL, TURNS.RAISE, TURNS.PASS],
                playersTurn: [
                    {
                        id: '-tUTqde4QBlMEjZ_AAAB',
                        turn: TURNS.BET,
                        value: 5
                    },
                    {
                        id: 'XfOZvcmKGjJCLAKdAAAC',
                        turn: TURNS.PASS,
                        value: null
                    }
                ],
                lastBet: 10
            };
            var optionSelector = document.createElement('select');
            var first = true;
            for (var i = 0; i < yourTurnData.turnOptions.length; i++) {
                optionSelector.add(new Option(yourTurnData.turnOptions[i]), first, first);
                first = false;
            }
            var betSelector = document.createElement('select');
            first = true;
            for (var j = 0; j < BETS.length; j++) {
                if (BETS[j] >= parseInt(yourTurnData.lastBet)) {
                    betSelector.add(new Option(BETS[j]), first, first);
                    first = false;
                }
            }
            playTable.onYourTurn(yourTurnData);
            expect(playTable.$.playerOption.innerHTML).toEqual(optionSelector.innerHTML);
            expect(playTable.$.playerBet.innerHTML).toEqual(betSelector.innerHTML);
        });


        it('should send player turn with params to server', function () {
            var socketSendTurnStub = pockerSandbox.stub(socket, 'emit');
            var yourTurnData = {
                turnOptions: [TURNS.CALL, TURNS.RAISE, TURNS.PASS],
                playersTurn: [
                    {
                        id: '-tUTqde4QBlMEjZ_AAAB',
                        turn: TURNS.BET,
                        value: 5
                    },
                    {
                        id: 'XfOZvcmKGjJCLAKdAAAC',
                        turn: TURNS.PASS,
                        value: 10
                    }
                ]
            };
            playTable.onYourTurn(yourTurnData);
            playTable.$.playerOption.value = TURNS.RAISE;
            playTable.$.playerBet.value = BETS[3];
            eventFire(playTable.$.playerBetButton, 'click');
            expect(socketSendTurnStub.firstCall.args[0]).toEqual(EVENTS.CLIENT.I_TURN);
            expect(socketSendTurnStub.firstCall.args[1]).toEqual({
                turn: TURNS.RAISE,
                bet: BETS[3]
            });
        });


        it('will show game info when it comes from server', function () {
            playTable.onGameInfo(gameData);
            var bets = gameData.bets;
            for (var i = 0; i < gameData.players.length; i++) {
                var player = gameData.players[i];
                var currentTurn = player.currentTurn || '';
                var gameInfo = player.name + '\'s last bet:' + bets[i]  + '(' + currentTurn + ')';
                expect(playTable.$.lastPlayersInfo.children[i].innerHTML).toEqual(gameInfo);
            }
            expect(playTable.$.gameBank.innerHTML).toEqual('' + gameData.bank);
        });

        it('ahould block player if he folds down', function () {
            pockerSandbox.stub(socket, 'emit');
            var yourTurnData = {
                turnOptions: [TURNS.CALL, TURNS.FOLD],
                playersTurn: [
                    {
                        id: '-tUTqde4QBlMEjZ_AAAB',
                        turn: TURNS.BET,
                        value: 5
                    },
                    {
                        id: 'XfOZvcmKGjJCLAKdAAAC',
                        turn: TURNS.PASS,
                        value: null
                    }
                ]
            };
            playTable.onYourTurn(yourTurnData);
            playTable.$.playerOption.value = TURNS.FOLD;
            eventFire(playTable.$.playerBetButton, 'click');
            expect(playTable.$.foldMask.classList.contains('visible')).toEqual(true);
        });


        gameData = {
            'stage': 'first_round',
            'players': [
                {
                    'name': 'Олег Гомозов',
                    'id': 'yivlw3hHxBLXgy0hAAAA',
                    'coins': 499,
                    'hand': [],
                    currentTurn: 'bet'
                },
                {
                    'name': 'Олег Гомозов',
                    'id': 'tZEjE0DxtQB6mJ0aAAAB',
                    'coins': 499,
                    'hand': [
                        {'value': '10', 'suite': 'C'},
                        {'value': '6', 'suite': 'H'},
                        {'value': '9', 'suite': 'S'},
                        {'value': '7', 'suite': 'H'},
                        {'value': 'Q', 'suite': 'S'}
                    ],
                    currentTurn: 'fold'
                },
                {
                    'name': 'Олег Гомозов',
                    'id': 'eVc7MilH6kdCFfOJAAAC',
                    'coins': 499,
                    'hand': [],
                    currentTurn: 'raise'
                }
            ],
            'bank': 1503,
            'turn': 1,
            'currentPlayerId': 'yivlw3hHxBLXgy0hAAAA',
            'bets': [501, 501, 501]
        };
        account = {
            name: 'scjpCfmCsvzUbt3tAAAi',
            id: 'scjpCfmCsvzUbt3tAAAi',
            coins: 100
        };
        cards = {
            bank: 500,
            turn: 2,
            dealer: '-tUTqde4QBlMEjZ_AAAB',
            bets: [1,1,1],
            players: [
                {
                    'name': 'Pasha',
                    'id': 'scjpCfmCsvzUbt3tAAAi',
                    'coins': 99,
                    'hand': [
                        {'value': '9', 'suite': 'D'},
                        {'value': '7', 'suite': 'D'},
                        {'value': '2', 'suite': 'S'},
                        {'value': 'A', 'suite': 'S'},
                        {'value': 'A', 'suite': 'C'}
                    ]
                },
                {
                    'name': 'Oleg',
                    'id': '-tUTqde4QBlMEjZ_AAAB',
                    'coins': 99,
                    'hand': []
                },
                {
                    'name': 'Andrey',
                    'id': 'XfOZvcmKGjJCLAKdAAAC',
                    'coins': 99,
                    'hand': []
                }
            ]
        };

    });

});