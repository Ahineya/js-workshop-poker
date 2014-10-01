document.addEventListener('polymer-ready', function () {
    describe('Play table tests', function () {
        var playTable, socketWaitForGameStartStub;
        beforeEach(function () {
            socketWaitForGameStartStub = pockerSandbox.stub(socket, 'on');
            playTable = new PlayTable();
        });

        afterEach(function () {
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
            var account = {
                name: 'scjpCfmCsvzUbt3tAAAi',
                id: 'scjpCfmCsvzUbt3tAAAi',
                coins: 100
            };
            var cards = [
                {
                    'name': 'scjpCfmCsvzUbt3tAAAi',
                    'id': 'scjpCfmCsvzUbt3tAAAi',
                    'coins': 99,
                    'hand': [
                        {'value': '9', 'suite': 'D'},
                        {'value': '7', 'suite': 'D'},
                        {'value': '2', 'suite': 'S'},
                        {'value': 'A', 'suite': 'S'},
                        {'value': 'A', 'suite': 'T'}
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
            ];
            var generateCardStackStub = pockerSandbox.stub(playTable, 'generateCardStack');
            playTable.account = account;
            playTable.onStartGame(cards);
            expect(generateCardStackStub.firstCall.args[0]).toEqual(['9D', '7D', '2S', 'AS', 'AT']);
        });

    });

});