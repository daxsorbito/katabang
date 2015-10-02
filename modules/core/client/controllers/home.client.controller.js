'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', '$stateParams', 'Authentication',
  function ($scope, $state, $stateParams, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.bookNow = function () {
      if(!$scope.authentication.user){
        $state.go('authentication.signin');
      }

      //console.log($scope);
    };
  }
]);
