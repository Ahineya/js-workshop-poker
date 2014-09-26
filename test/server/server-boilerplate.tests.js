var t = require('../../src/server/modules/test.js');
var chai = require('chai');

describe("Server boilerplate test", function() {
    it("Should perform simple test", function() {
        chai.expect(t.test(), 'zz');
    });
});