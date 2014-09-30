(function () {
    Polymer('play-table', {
        created: function() {
        },
        ready: function() {
            this.cancelUnbindAll();
            this.numberOfPlayers = 5;
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
        }
    });
})(window);
