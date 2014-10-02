document.addEventListener('polymer-ready', function () {
    describe('Play table tests', function () {
        var playTable, socketWaitForGameStartStub, cards, account;
        beforeEach(function () {
            socketWaitForGameStartStub = pockerSandbox.stub(socket, 'on');
            playTable = new PlayTable();
        });

        it('should wait for start of game', function () {
            expect(socketWaitForGameStartStub.firstCall.args[0]).toEqual(EVENTS.START_GAME);
        });

        it('should wait for getting my hand of game', function () {
            expect(socketWaitForGameStartStub.secondCall.args[0]).toEqual(EVENTS.YOUR_DATA);
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
                var actualElement = playTable.getPlayCardElement(card);
                expect(actualElement.innerHTML).toEqual(cardElement.innerHTML);
                expect(actualElement.classList.toString()).toEqual(cardElement.classList.toString());
            }
        });

        it('should generate correct playStack', function () {
            var getPlayCardElementStub = pockerSandbox.stub(playTable, 'getPlayCardElement').returns(document.
                createElement('div'));
            playTable.generateCardStack([
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
            var generateCardStackStub = pockerSandbox.stub(playTable, 'generateCardStack');
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

        account = {
            name: 'scjpCfmCsvzUbt3tAAAi',
            id: 'scjpCfmCsvzUbt3tAAAi',
            coins: 100
        };
        cards = {
            bank: 500,
            turn: 2,
            dealer: '-tUTqde4QBlMEjZ_AAAB',
            players: [
                {
                    'name': 'scjpCfmCsvzUbt3tAAAi',
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
                    'name': '-tUTqde4QBlMEjZ_AAAB',
                    'id': '-tUTqde4QBlMEjZ_AAAB',
                    'coins': 99,
                    'hand': []
                },
                {
                    'name': 'XfOZvcmKGjJCLAKdAAAC',
                    'id': 'XfOZvcmKGjJCLAKdAAAC',
                    'coins': 99,
                    'hand': []
                }
            ]
        };

    });

});