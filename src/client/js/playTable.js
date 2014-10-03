(function (globals) {
    Polymer('play-table', {
        account: {},
        start: function () {
        },
        created: function() {
        },
        ready: function() {
            this.cancelUnbindAll();
            socket.on(globals.EVENTS.START_GAME, this.onStartGame.bind(this));
            socket.on(globals.EVENTS.YOUR_DATA, this.onYourData.bind(this));
            socket.on(globals.EVENTS.YOUR_TURN, this.onYourTurn.bind(this));
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
            this.myCards = data.players.filter(function (item) {
                return item.id == this.account.id;
            }, this)[0];
            this.generateCardStack(this.myCards.hand.map(function (card) {
                return card.value + card.suite;
            }));
            this.generatePlayTableWithActions(data);
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
        },

        generatePlayTableWithActions: function (cards) {
            for (var i = 0; i < 5; i++) {
                var hiddenCard = document.createElement('div');
                hiddenCard.classList.add('card');
                hiddenCard.classList.add('cover');
                this.$.leftPlayerHand.appendChild(hiddenCard);
                this.$.rightPlayerHand.appendChild(hiddenCard.cloneNode(true));
            }
            if (cards.dealer !== this.account.id) {
                this.$.modalMask.classList.add('visible');
            }
        },
        onYourTurn: function (data) {
            while (this.$.playerOption.options.length > 0) {
                this.$.playerOption.remove(0);
            }
            while (this.$.playerBet.options.length > 0) {
                this.$.playerBet.remove(0);
            }
            var first = true;
            for (var i = 0; i < data.turnOptions.length; i++) {
                this.$.playerOption.add(new Option(data.turnOptions[i]), first, first);
                first = false;
            }
            first = true;
            for (var j = 0; j < BETS.length; j++) {
                this.$.playerBet.add(new Option(BETS[j]), first, first);
                first = false;
            }
            this.$.modalMask.classList.remove('visible');
            this.$.playerMenu.classList.add('visible');
        },
        onBetClick: function () {
            socket.emit(EVENTS.I_TURN, {
                turn: this.$.playerOption.value,
                bet: parseInt(this.$.playerBet.value)
            });
            this.$.modalMask.classList.add('visible');
            this.$.playerMenu.classList.remove('visible');
        }

    });
})(window);
