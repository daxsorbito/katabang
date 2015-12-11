'use strict';

// my-bookings controller
angular.module('bookings').controller('MyBookingsController', ['$scope', '$state', '$stateParams', '$window', '$location', '$sessionStorage', '$translate', 'Authentication', 'Bookings', 'Pricings',
  function ($scope, $state, $stateParams, $window, $location, $sessionStorage, $translate, Authentication, Bookings, Pricings) {
    $scope.authentication = Authentication;

    $scope.init = function () {
      console.log('========================');
      console.log('initialize user: ' + Authentication.user._id);
      console.log('========================');
      // for(var key in Authentication.user)
      // {
      //   if(Authentication.user.hasOwnProperty(key))
      //     console.log(key);
      // }
      $scope.booking = {};
      $scope.booking.scheduledBookings = [{"booking_date": new Date(), "booking_time": "8 AM", "booking_duration": "4 HOURS"}];

    };

    //Find my existing Bookings
    $scope.findMyBookings = function () {
      console.log('========================');
      console.log('find booking');
      console.log('========================');
       $scope.booking = {};
       $scope.booking.scheduledBookings = Bookings.get({
           bookingId: '565d03b8cb3ebe4318575c64'
       });

       $scope.booking.scheduledBookings.$promise.then(function(data){
           $scope.booking = data[0].booking;
           $scope.booking.scheduledBookings = data;
           $scope.payment = {};
           console.log(data[0]);
           //computePayment();
       });
    };

  }]
);
