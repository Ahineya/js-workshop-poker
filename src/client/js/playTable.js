function playTable() {
    this.test = function() {
        this.test2();
        return true;
    };
    this.test2 = function() {
        return 1;
    };
}