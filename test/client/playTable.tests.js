document.addEventListener('polymer-ready', function () {
    describe("Play table tests", function () {
        var playTable, socketWaitForGameStartStub;
        beforeEach(function () {
            socketWaitForGameStartStub = sinon.stub(socket, 'on');
            playTable = new PlayTable();
        });

        afterEach(function () {
            socketWaitForGameStartStub.restore();
        });

        it('should wait for start of game', function () {
            expect(socketWaitForGameStartStub.firstCall.args[0]).toEqual(EVENTS.START_GAME);
        });

        it('should get correct card styling', function () {
            for (var i = 0; i < CARDS.length; i++) {
                var card = CARDS[i];
                expect(playTable.getPlayCardElement(card)).toEqual(card);
            }
        });


    });

});