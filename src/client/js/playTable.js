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
            }), this.$.playerHand);
            this.generatePlayTableWithActions(data);
            this.onGameInfo(data);
        },
        onGameInfo: function(gameData) {
            var bets = gameData.bets;
            for (var i = 0; i < gameData.players.length; i++) {
                var player = gameData.players[i];
                var currentTurn = player.currentTurn || '';
                var gameInfo = player.name + '\'s last bet:' + bets[i] + '(' + currentTurn + ')';
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
            cardElement.dataset.card = card;
            cardElement.innerHTML = value + ' <br/> &' + CARD_SUITS[suit] + ';';
            return cardElement;
        },
        generateCardStack: function (cards, parent) {
            parent.innerHTML = '';
            for (var i = 0; i < cards.length; i++) {
                var cardElement = this.getPlayCardElement(cards[i]);
                parent.appendChild(cardElement);
            }
        },
        generatePlayTableWithActions: function (cards) {
            this.$.leftPlayerHand.innerHTML = '';
            this.$.rightPlayerHand.innerHTML = '';
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
            data.lastBet = data.lastBet || 0;
            for (var j = 0; j < BETS.length; j++) {
                if (BETS[j] >= parseInt(data.lastBet)) {
                    this.$.playerBet.add(new Option(BETS[j]), first, first);
                    first = false;
                }
            }
            this.toggleModalMask(true);
        },
        /* jshint ignore:start */
        onReplacementTurn: function(gameData) {
            this.toggleModalMask(true);
            this.$.playerMenu.classList.remove('visible');
            this.$.playerReplace.classList.add('visible');
            this.$.systemMessages.classList.add('visible');
            var playerCards = this.$.playerHand.children;
            this.replaceCards = {};
            for (var i = 0; i < playerCards.length; i++) {
                var card = playerCards[i];
                card.addEventListener('click', this.onCardClick.bind(this));
            }
        },
        onCardClick: function (event) {
            var card = event.target;
            card.classList.toggle('replaced');
            if (card.classList.contains('replaced')) {
                this.replaceCards[card.dataset.card] = true;
            } else {
                this.replaceCards[card.dataset.card] = false;
            }
        },
        /* jshint ignore:end */
        onShowdown: function(gameData) {
            var containers = [
                this.$.leftPlayerHand,
                this.$.playerHand,
                this.$.rightPlayerHand
            ];
            var self = this;
            gameData.gameState.players.forEach(function(player, index) {
                self.generateCardStack(player.hand.map(function (card) {
                    return card.value + card.suite;
                }), containers[index]);
            });
            this.toggleModalMask(true);
            this.$.playerMenu.classList.remove('visible');
            this.$.systemMessages.classList.remove('visible');
        },
        onReplaceClick: function () {
            var replaceCards = [];
            for (var card in this.replaceCards) {
                if (this.replaceCards.hasOwnProperty(card)) {
                    replaceCards.push(card);
                }
            }
            this.$.systemMessages.classList.remove('visible');
            this.$.playerReplace.classList.remove('visible');
            this.toggleModalMask(false);
            socket.emit(EVENTS.CLIENT.I_EXCHANGE_CARDS, {
                replaceCards: replaceCards
            });
        },
        onBetClick: function () {
            var action = this.$.playerOption.value;
            socket.emit(EVENTS.CLIENT.I_TURN, {
                turn: action,
                bet: parseInt(this.$.playerBet.value),
                id: this.account.id
            });
            this.toggleModalMask(false, action === TURNS.FOLD);
        },
        toggleModalMask: function (hide, fold) {
            if (hide) {
                this.$.modalMask.classList.remove('visible');
                this.$.playerMenu.classList.add('visible');
            } else {
                if (fold) {
                    this.$.foldMask.classList.add('visible');
                } else {
                    this.$.modalMask.classList.add('visible');
                }
                this.$.playerMenu.classList.remove('visible');
            }
        }

    });
})(window);
