var pockerSandbox;
beforeEach(function () {
    pockerSandbox = sinon.sandbox.create();
});

afterEach(function () {
    pockerSandbox.restore();
});

eventFire = function (elem, etype, eventMixin) {
    var evObj = document.createEvent('Events');
    evObj.changedTouches = [];
    evObj.initEvent(etype, true, true);
    if (elem.fireEvent) {
        (elem.fireEvent('on' + etype, evObj));
    } else {
        elem.dispatchEvent(evObj);
    }
};