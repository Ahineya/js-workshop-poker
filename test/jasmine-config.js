var pockerSandbox;
beforeEach(function () {
    pockerSandbox = sinon.sandbox.create();
});

afterEach(function () {
    pockerSandbox.restore();
});