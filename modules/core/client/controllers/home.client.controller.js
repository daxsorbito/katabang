'use strict';

angular.module('core').controller('HomeController', ['$scope',  'Authentication',
  function ($scope, $state, $stateParams, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);
