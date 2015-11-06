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

        $scope.init = function () {
            $scope.booking = $localStorage.booked || {};
            var startdate = new Date();
            var enddate = new Date();
            startdate.setDate(startdate.getDate() + 1);
            enddate.setDate(enddate.getDate() + 2);
            $scope.booking.allowed_start_date = startdate.toISOString();
            $scope.booking.allowed_end_date = enddate.toISOString();

            // set the Users acount here
            $scope.booking.address = $scope.authentication.user.address;

            Pricings.get({
                pricingLocale: $translate.use()
            }, function (data) {
                $scope.pricing = data;
                $scope.booking.amountDue = data.price;
            });
        };

        // Create new Bookings
        $scope.create = function () {
            console.log($scope.booking);

            // Create new Bookings object
            var booking = new Bookings({
                name: this.name
            });

            console.log('create was called');
            // Redirect after save
            booking.$save(function (response) {
                $location.path('bookings/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                console.log(errorResponse);
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.$watchGroup(['booking.booking_date', 'booking.duration', 'booking.recurring', 'booking.frequency', 'booking.frequency_until_date'], function () {
            var numOfBooking = ($scope.booking.duration || 4) / 4;
            var multiplier = 1;
            if ($scope.booking.recurring) {
                var start_date = new Date($scope.booking.booking_date);
                var end_date = new Date($scope.booking.frequency_until_date);

                switch ($scope.booking.frequency) {
                    case '1':
                    { // Daily
                        multiplier = countNumberOfDays(start_date, end_date);
                        break;
                    }
                    case '2':
                    { // MWF
                        multiplier = countCertainDays([1, 3, 5], start_date, end_date);
                        break;
                    }
                    case '3':
                    { // TTH
                        multiplier = countCertainDays([2, 4], start_date, end_date);
                        break;
                    }
                    case '4':
                    { // Weekly
                        multiplier = countNumberOfWeeks(start_date, end_date);
                        break;
                    }
                    case '5':
                    { // Forthnightly
                        // TODO: validate end date (flag error if until_date)
                        multiplier = Math.floor(countNumberOfWeeks(start_date, end_date) / 2);
                        break;
                    }
                    case '6' :
                    { // Monthly
                        multiplier = countNumberOfMonths(start_date, end_date);
                    }

                }
                $scope.booking.numberOfBookings = multiplier;
                numOfBooking = (multiplier * numOfBooking);
            }
            $scope.booking.numberOfBookings = multiplier;
            $scope.booking.amountDue = $scope.pricing.price * numOfBooking;
        });

        function countNumberOfDays(start_date, end_date) {
            return dateCompute(start_date, end_date, 24);
        }

        function countNumberOfWeeks(start_date, end_date) {
            return dateCompute(start_date, end_date, 24 * 7);
        }

        function dateCompute(start_date, end_date, add_on) {
            var millisecondsPerDay = 1000 * 60 * 60 * add_on;

            var millisBetween = end_date.getTime() - start_date.getTime();
            var days = millisBetween / millisecondsPerDay;
            console.log('number of days ' + Math.floor(days));
            return Math.floor(days);
        }

        function countCertainDays(days, start_date, end_date) {
            var ndays = 1 + Math.round((end_date - start_date) / (24 * 3600 * 1000));
            var sum = function (a, b) {
                return a + Math.floor(( ndays + (start_date.getDay() + 6 - b) % 7 ) / 7);
            };
            return days.reduce(sum, 0);
        }

        function countNumberOfMonths(start_date, end_date) {
            return Math.floor(end_date.getMonth() - start_date.getMonth() + (12 * (end_date.getFullYear() - start_date.getFullYear())));
        }

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
