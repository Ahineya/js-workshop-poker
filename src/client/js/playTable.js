(function (globals) {
    Polymer('play-table', {
        account: {},
        start: function () {
        },
        created: function() {
        },
        ready: function() {
            this.cancelUnbindAll();
            socket.on(globals.EVENTS.SERVER.START_GAME, this.onStartGame.bind(this));
            socket.on(globals.EVENTS.SERVER.YOUR_DATA, this.onYourData.bind(this));
            socket.on(globals.EVENTS.SERVER.YOUR_TURN, this.onYourTurn.bind(this));
            socket.on(globals.EVENTS.SERVER.REPLACEMENT_TURN, this.onReplacementTurn.bind(this));
            socket.on(globals.EVENTS.SERVER.GAME_INFO, this.onGameInfo.bind(this));
            socket.on(globals.EVENTS.SERVER.SHOWDOWN, this.onShowdown.bind(this));
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
        onGameInfo: function(gameData) {
            var bets = gameData.bets;
            for (var i = 0; i < gameData.players.length; i++) {
                var player = gameData.players[i];
                var gameInfo = player.name + '\'s last bet:' + bets[i];
                this.$.lastPlayersInfo.children[i].innerHTML = gameInfo;
            }
            this.$.gameBank.innerHTML = gameData.bank;
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
        onReplacementTurn: function(gameData) {
            console.log('replacement: ',gameData);
        },
        onShowdown: function(gameData) {
            console.log('showdown: ',gameData);
        },
        onBetClick: function () {
            var action = this.$.playerOption.value;
            socket.emit(EVENTS.CLIENT.I_TURN, {
                turn: action,
                bet: parseInt(this.$.playerBet.value),
                id: this.account.id
            });
            this.$.playerMenu.classList.remove('visible');
            if (action === TURNS.FOLD) {
                this.$.foldMask.classList.add('visible');
            } else {
                this.$.modalMask.classList.add('visible');
            }
        }

    });
})(window);
