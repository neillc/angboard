/*global describe, beforeEach, inject, module, it, chai */
(function () {
  'use strict';

  var expect = chai.expect;

  describe('Directive: checkmark', function () {

    // load the directive's module
    beforeEach(module('angboardApp'));

    var element,
      scope;

    beforeEach(inject(function ($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should have a checkmark when true', inject(function ($compile) {
      element = angular.element('<div x-checkmark="checked"></div>');
      element = $compile(element)(scope);
      scope.checked = true;
      scope.$digest();
      expect(element.html()).to.equal('<span class="fa fa-check"></span>');
    }));

    it('should have a cross when false', inject(function ($compile) {
      element = angular.element('<div x-checkmark="checked"></div>');
      element = $compile(element)(scope);
      scope.checked = false;
      scope.$digest();
      expect(element.html()).to.equal('<span class="fa fa-times"></span>');
    }));
  });
}());