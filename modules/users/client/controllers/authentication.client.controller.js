'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication',
  function ($scope, $state, $http, $location, $window, Authentication) {
    $scope.authentication = Authentication;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.setInitValues = function(userType) {
      $scope.credentials = {};
      $scope.credentials.userType = (userType === 'provider') ? 1 : 0;
      $scope.agreeTerms = 0;
    };

    $scope.services = [{name: 'SERVICES.HOUSE_CLEANER', id: 1},
      {name: 'SERVICES.LAUNDRY_PRESS', id: 2},
      {name: 'SERVICES.CARETAKER_OLDSITTER', id: 3},
      {name: 'SERVICES.CARETAKER_BABYSITTER', id: 4},
      {name: 'SERVICES.PLUMBER', id: 5},
      {name: 'SERVICES.AIRCON_CLEANER', id: 6},
      {name: 'SERVICES.HOUSE_FIXTURES_INSTALLER', id: 7},
      {name: 'SERVICES.GARDENER', id: 8},
      {name: 'SERVICES.HANDYMAN', id: 9}
    ];

    $scope.signup = function () {
      var otherServices = $scope.credentials.otherServices;
      if(otherServices) {
        $scope.credentials.otherServices = [];
        for (var property in otherServices) {
          if (otherServices.hasOwnProperty(property)) {
            $scope.credentials.otherServices.push(property);
          }
        }
      }
      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function () {
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      var redirect_to;

      if ($state.previous) {
        redirect_to = $state.previous.href;
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url + (redirect_to ? '?redirect_to=' + encodeURIComponent(redirect_to) : '');
    };
  }
]);
