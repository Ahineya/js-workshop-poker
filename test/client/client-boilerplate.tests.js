describe("Client boilerplate test", function() {

    var b, cl;

    beforeEach(function() {
        b = new Boilerplate();
        b.test2 = sinon.stub();
    });

    it("Should perform simple test", function() {
        expect(b.test()).toBeTruthy();
        expect(b.test2.calledOnce).toBeTruthy();
    });

    it("Should perform second simple test", function() {
        expect(true).toBeTruthy();
    });

});