'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    $scope.user.editableServices = {};
    $scope.user.otherServices.forEach(function(s) {
      $scope.user.editableServices[s] = true;
    });

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

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);

        var editableServices = $scope.user.editableServices;
        if(editableServices) {
          user.otherServices = [];
          for (var property in editableServices) {
            if (editableServices.hasOwnProperty(property) && editableServices[property]) {
              user.otherServices.push(property);
            }
          }
        }

        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
  }
]);
