'use strict';

// Bookings controller
angular.module('bookings').controller('BookingsController', ['$scope', '$state', '$stateParams', '$location', '$localStorage', '$translate', 'Authentication', 'Bookings', 'Pricings',
    function ($scope, $state, $stateParams, $location, $localStorage, $translate, Authentication, Bookings, Pricings) {
        $scope.authentication = Authentication;
        $scope.createBookingPage = $state.current.name === 'bookings.create';

        $scope.bookNow = function () {
            $localStorage.booked = $scope.booking;
            if (!$scope.authentication.user) {
                $state.go('authentication.signin');
            }
            else {
                $state.go('bookings.create');
            }
        };

        $scope.init = function() {
            $scope.booking = $localStorage.booked || {};

            // set the Users acount here
            $scope.booking.address = $scope.authentication.user.address;

            Pricings.get({
                pricingLocale: $translate.use()
            },function(data){
                $scope.pricing = data;
                $scope.booking.amountDue = data.price;
            });
        };

        // Create new Bookings
        $scope.create = function () {
            console.log('enetered create');
            console.log($scope.booking);

            // Create new Bookings object
            var booking = new Bookings({
                name: this.name
            });

            // Redirect after save
            booking.$save(function (response) {
                $location.path('bookings/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Bookings
        $scope.remove = function (booking) {
            if (booking) {
                booking.$remove();

                for (var i in $scope.bookings) {
                    if ($scope.bookings [i] === booking) {
                        $scope.bookings.splice(i, 1);
                    }
                }
            } else {
                $scope.booking.$remove(function () {
                    $location.path('bookings');
                });
            }
        };

        // Update existing Bookings
        $scope.update = function () {
            var booking = $scope.booking;

            booking.$update(function () {
                $location.path('bookings/' + booking._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Bookings
        $scope.find = function () {
            $scope.bookings = Bookings.query();
        };

        // Find existing Bookings
        $scope.findOne = function () {
            $scope.booking = Bookings.get({
                bookingId: $stateParams.bookingId
            });
        };
    }
]);
