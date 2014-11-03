/* jshint ignore:start */
(function (globals) {
    Polymer('player-hand', {
        account: {},
        start: function () {
        },
        created: function () {
        },
        ready: function () {
        },
        attached: function () {
        },
        domReady: function () {
        },
        detached: function () {
        },
        observe: {
        },
        generateCardStack: function (cards) {
            this.innerHTML = '';
            for (var i = 0; i < cards.length; i++) {
                var cardElement = this.getPlayCardElement(cards[i]);
                this.appendChild(cardElement);
            }
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
        onReplacementTurn: function () {
            var playerCards = this.children;
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
        }

    });
})(window);
/* jshint ignore:end */