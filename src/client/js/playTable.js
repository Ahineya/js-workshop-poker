(function (globals) {
    Polymer('play-table', {
        account: undefined,
        start: function () {
        },
        created: function() {
        },
        ready: function() {
            this.cancelUnbindAll();
            socket.on(globals.EVENTS.START_GAME, this.onStartGame.bind(this));
            socket.on(globals.EVENTS.YOUR_DATA, this.onYourData.bind(this));
        },
        attached: function () {
        },
        domReady: function() {
        },
        detached: function() {
            this.cancelUnbindAll();
        },
        observe: {
        },
        attributeChanged: function(attrName, oldVal, newVal) {
        },
        onStartGame: function (data) {
            this.myCards = data.filter(function (item) {
                return item.id == this.account.id;
            }, this)[0];
            this.generateCardStack(this.myCards.hand.map(function (card) {
                return card.value + card.suite;
            }));
        },
        onYourData: function (data) {
            this.account =  data;
        },
        getPlayCardElement: function (card) {
            var value = card.substr(0, card.length - 1);
            var suit = card.substr(card.length - 1, 1);
            var cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.classList.add('rank' + card);
            cardElement.innerHTML = value + ' <br/> &' + CARD_SUITS[suit] + ';';
            return cardElement;
        },
        generateCardStack: function (cards) {
            for (var i = 0; i < cards.length; i++) {
                var cardElement = this.getPlayCardElement(cards[i]);
                this.$.playerHand.appendChild(cardElement);
            }
        }
    });
})(window);
