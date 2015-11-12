'use strict';

// Bookings controller
angular.module('bookings').controller('BookingsController', ['$scope', '$state', '$stateParams', '$location', '$sessionStorage', '$translate', 'Authentication', 'Bookings', 'Pricings',
    function ($scope, $state, $stateParams, $location, $sessionStorage, $translate, Authentication, Bookings, Pricings) {
        $scope.authentication = Authentication;
        $scope.createBookingPage = $state.current.name === 'bookings.create';

        $scope.bookNow = function () {
            $sessionStorage.booked = $scope.booking;
            if (!$scope.authentication.user) {
                $state.go('authentication.signin');
            }
            else {
                $state.go('bookings.create');
            }
        };

        $scope.init = function () {
            Pricings.get({
                pricingLocale: $translate.use()
            }, function (data) {
                $scope.pricing = data;
                $scope.booking.amountDue = data.price;
            });

            $scope.booking = $sessionStorage.booked || {};
            $scope.booking.recurring = $scope.booking.recurring || 0;
            if ($scope.booking.booking_date) { $scope.booking.booking_date = new Date($scope.booking.booking_date); }
            if ($scope.booking.frequency_until_date) { $scope.booking.frequency_until_date = new Date($scope.booking.frequency_until_date); }
            setBookingEndDate();
            // set the Users acount here
            $scope.booking.address = $scope.authentication.user.address;
        };

        // Create new Bookings
        $scope.create = function () {
            console.log($scope.booking);

            // Create new Bookings object
            var booking = new Bookings($scope.booking);

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

        $scope.$watch('booking.booking_date', function(newValue, oldValue){
            setBookingEndDate();
        });

        function setBookingEndDate() {
            var startdate = new Date();
            startdate.setDate(startdate.getDate() + 1);
            $scope.booking.allowed_start_date = startdate.toISOString();
            var enddate = new Date($scope.booking.booking_date);
            enddate.setDate(enddate.getDate() + 1);
            $scope.booking.allowed_end_date = enddate.toISOString();
        }

        $scope.$watchGroup(['pricing', 'booking.booking_date', 'booking.duration', 'booking.recurring', 'booking.frequency', 'booking.frequency_until_date', 'booking.booking_time'], function () {
            if (!$scope.pricing) return;
            var billedBookingCount = ($scope.booking.duration || 4) / 4; // billed by 4 hours
            var multiplier = 1;

            if ($scope.booking.booking_date) {
                var start_date = new Date($scope.booking.booking_date);
                var end_date = $scope.booking.frequency_until_date ? new Date($scope.booking.frequency_until_date) : new Date($scope.booking.booking_date);
                var MWF = [1,3,5];
                var TTH = [2, 4];
                var DAILY = [0,1,2,3,4,5,6,7];
                var WEEKLY = 7;

                setDaysScheduledBookings(DAILY, start_date, end_date);

                if ($scope.booking.recurring && $scope.booking.frequency_until_date) {


                    switch ($scope.booking.frequency) {
                        case '1':
                        { // Daily
                            setDaysScheduledBookings(DAILY, start_date, end_date);
                            break;
                        }
                        case '2':
                        { // MWF
                            setDaysScheduledBookings(MWF, start_date, end_date);
                            break;
                        }
                        case '3':
                        { // TTH
                            setDaysScheduledBookings(TTH, start_date, end_date);
                            break;
                        }
                        case '4':
                        { // Weekly
                            setWeeklyScheduledBookings(WEEKLY, start_date, end_date);
                            break;
                        }
                        case '5':
                        { // Forthnightly
                            // TODO: validate end date (flag error if until_date)
                            setWeeklyScheduledBookings(WEEKLY * 2, start_date, end_date);
                            break;
                        }
                        case '6' :
                        { // Monthly
                            setMonthlyScheduleBookings(start_date, end_date);
                            break;
                        }
                        default :
                            setDaysScheduledBookings(DAILY, start_date, start_date);

                    }
                }
            }
            multiplier = $scope.booking.scheduledBookings ? $scope.booking.scheduledBookings.length : 1;
            billedBookingCount = (multiplier * billedBookingCount);

            $scope.booking.numberOfBookings = multiplier;
            $scope.booking.amountDue = $scope.pricing.price * billedBookingCount;

        });

        function setDaysScheduledBookings (days, start_date, end_date) {
            var scheduledBookings = [];
            for (var d = start_date; d <= end_date; d.setDate(d.getDate() + 1)) {
                if(days.indexOf(d.getDay()) > -1) {
                    scheduledBookings.push({
                        booking_date: (new Date(d)).toLocaleDateString(),
                        booking_time: $scope.booking.booking_time,
                        booking_duration: $scope.booking.duration});
                }
            }
            $scope.booking.scheduledBookings = scheduledBookings;
        }

        function setWeeklyScheduledBookings (weekly, start_date, end_date) {
            var scheduledBookings = [];
            for (var d = start_date; d <= end_date; d.setDate(d.getDate() + weekly)) {
                scheduledBookings.push({
                    booking_date: (new Date(d)).toLocaleDateString(),
                    booking_time: $scope.booking.booking_time,
                    booking_duration: $scope.booking.duration});
            }
            $scope.booking.scheduledBookings = scheduledBookings;
        }

        function setMonthlyScheduleBookings (start_date, end_date) {
            var scheduledBookings = [];
            for (var d = start_date; d <= end_date; d.setMonth(d.getMonth() + 1)) {
                scheduledBookings.push({
                    booking_date: (new Date(d)).toLocaleDateString(),
                    booking_time: $scope.booking.booking_time,
                    booking_duration: $scope.booking.duration});
            }
            $scope.booking.scheduledBookings = scheduledBookings;
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
