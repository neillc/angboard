/*global describe, beforeEach, inject, module, it, chai */
(function () {
  'use strict';

  var expect = chai.expect;

  describe('Service: nova', function () {

    // load the service's module
    beforeEach(module('angboardApp'));

    // instantiate service
    var nova;
    beforeEach(inject(function (_nova_) {
      nova = _nova_;
    }));

    it('should do something', function () {
      expect(!!nova).toBe(true);
    });

  });
}());