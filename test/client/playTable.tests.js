document.addEventListener('polymer-ready', function () {
    describe("Play table tests", function () {
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
            playTable.generateCardStack([{}, {}, {}]);
            expect(getPlayCardElementStub.callCount).toEqual(3);
        });


    });

});