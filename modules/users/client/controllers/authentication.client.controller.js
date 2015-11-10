'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', '$localStorage', 'Authentication', 'vcRecaptchaService',
  function ($scope, $state, $http, $location, $window, $localStorage, Authentication, vcRecaptchaService) {
    $scope.authentication = Authentication;
    $scope.response = null;
    $scope.widgetId = null;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.setInitValues = function(userType) {
      $scope.credentials = {};
      $scope.credentials.userType = (userType === 'provider') ? 1 : 0;
      //$scope.agreeTerms = 0;
      $scope.captchaPublicKey = "6LfHVg0TAAAAAK3A3_yE1P4E3MDmuQ5ZxYikgdnm";
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
      if($scope.credentials.confirm_password !== $scope.credentials.password){
        $scope.error = 'ERROR_MSG.PASSWORD_DO_NOT_MATCH';
        return;
      }


      $scope.credentials['g-response'] = vcRecaptchaService.getResponse($scope.widgetId);
      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
        vcRecaptchaService.reload($scope.widgetId);
      });
    };

    $scope.signin = function () {
      // TODO: remove this
      //$scope.credentials = {
      //  username : "dax_xxxxx",
      //  password : "123123123"
      //};

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page

        // TODO: put the code here to redirect to booking if booking has been done
        if($localStorage.booked)
        {
          $state.go('bookings.create');
        }
        else {
          $state.go($state.previous.state.name || 'home', $state.previous.params);
        }
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

    $scope.setResponse = function (response) {
      console.log('Response available');
      $scope.response = response;
    };
    $scope.setWidgetId = function (widgetId) {
      console.log('Created widget ID: %s', widgetId);
      $scope.widgetId = widgetId;
    };
    $scope.cbExpiration = function() {
      console.log('Captcha expired. Resetting response object');
      $scope.response = null;
    };
    $scope.cities = [
      {"id": 1, "name": "Cebu City"},
      {"id": 2, "name": "Mandaue"},
      {"id": 3, "name": "Lapu-lapu"},
      {"id": 4, "name": "Talisay"},
      {"id": 5, "name": "Manila-Pasay"},
      {"id": 6, "name": "Makati"},
      {"id": 7, "name": "Ortigas"},
      {"id": 8, "name": "Taguig"},
      //{"id": 9, "name": "Tokyo"},
      //{"id": 10, "name": "Seoul"},
      //{"id": 11, "name": "Singapore"}
    ]
    $scope.prov_states =[
      {"id": 1, "name": "Cebu"},
      {"id": 2, "name": "Manila"},
      //{"id": 3, "name": "Tokyo"},
      //{"id": 4, "name": "Seoul"},
      //{"id": 5, "name": "Hongkong"},
      //{"id": 6, "name": "Singapore"}
    ]
    $scope.countries =[
      {"id": 1, "name": "Philippines"},
      //{"id": 2, "name": "Japan"},
      //{"id": 3, "name": "Korea"},
      //{"id": 4, "name": "Hongkong"},
      //{"id": 5, "name": "Singapore"}
    ]


  }
]);
