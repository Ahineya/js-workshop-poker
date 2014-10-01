(function (globals) {
    Polymer('play-table', {
        start: function () {

        },
        created: function() {
        },
        ready: function() {
            this.cancelUnbindAll();
            socket.on(globals.EVENTS.START_GAME, function () {
            });
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
        getPlayCardElement: function (card) {
            return card;
        }
    });
})(window);
