/*global Terminal,Blob,FileReader */
(function () {
  'use strict';

  var STATES = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
  /**
   * @ngdoc directive
   * @name angboardApp.directive:console
   * @description
   * # console
   */
  angular.module('angboardApp')
    .directive('console', function ($log, $websocket) {
      return {
        scope: {
          connection: '=connection'
        },
        template: '<div><span id="term"></span><p>Status: {{status()}}</p></div>',
        restrict: 'E',
        link: function postLink(scope, element) {
          $log.info('open console to', scope.connection);

          var term = new Terminal();
          var socket = $websocket.$new(scope.connection.url, ['binary', 'base64']);

          // turn the angular jQlite element into a raw DOM element so we can
          // attach the Terminal to it
          element = angular.element(element)[0];
          term.open(element.ownerDocument.getElementById('term'));

          term.on('data', function (data) {
            socket.$$ws.send(data);
          });

          socket.$on('$message', function (message) {
            if (message instanceof Blob) {
              var f = new FileReader();
              f.onload = function () {term.write(f.result); };
              f.readAsText(message);
            } else {
              term.write(message);
            }
          });

          scope.status = function () {
            return STATES[socket.$status()];
          };

          scope.$on('$destroy', function () {
            $log.info('closing console to', scope.connection);
            socket.$close();
          });
        }
      };
    });
}());