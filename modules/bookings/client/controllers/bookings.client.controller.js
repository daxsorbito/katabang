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
            $scope.booking = $sessionStorage.booked || {};
            $scope.booking.pricing = Pricings.get({
                pricingLocale: $translate.use()
            });

            $scope.booking.pricing.$promise.then(function(data){
                $scope.booking.pricing = data;
                $scope.booking.amountDue = data.price;
            });

            $scope.booking = $sessionStorage.booked || {};
            $scope.booking.recurring = $scope.booking.recurring || 0;
            if ($scope.booking.booking_date) $scope.booking.booking_date = new Date($scope.booking.booking_date);
            if ($scope.booking.frequency_until_date) $scope.booking.frequency_until_date = new Date($scope.booking.frequency_until_date);
            setBookingEndDate();

            $scope.booking.address = $scope.authentication.user.address;
        };

        // Create new Bookings
        $scope.create = function () {
            // Create new Bookings object
            var booking = new Bookings($scope.booking);

            // Redirect after save
            booking.$save(function (response) {
                $location.path('bookings/payment/' + response._id);

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
            $scope.booking = {};
            $scope.booking.scheduledBookings = Bookings.get({
                bookingId: $stateParams.bookingId
            });

            $scope.booking.scheduledBookings.$promise.then(function(data){
                $scope.booking = data[0].booking;
                $scope.booking.scheduledBookings = data;
                computePayment();
            });
        };


        // helper methods
        $scope.$watch('booking.booking_date', function(newValue, oldValue){
            setBookingEndDate();
        });

        $scope.$watch('booking.creditcardnumber', function(newVal, oldVal){
            var accountNumber = $scope.booking.creditcardnumber;
            var result = "";

            //first check for MasterCard
            if (/^5[1-5][0-9]{5,}$/.test(accountNumber)) {
                result = "master";
            }
            //then check for Visa
            else if (/^4[0-9]{6,}$/.test(accountNumber)) {
                result = "visa";
            }
            //then check for AmEx
            else if (/^3[47][0-9]{5,}$/.test(accountNumber)) {
                result = "amex";
            }
            //then check for Discover
            else if (/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(accountNumber)) {
                result = "disco";
            }
            $scope.booking.cardType = result;
        });

        $scope.$watchGroup(['booking.pricing.price', 'booking.booking_date', 'booking.duration', 'booking.recurring', 'booking.frequency', 'booking.frequency_until_date', 'booking.booking_time'], function () {
            if (!$scope.booking.pricing) return;
            var billedBookingCount = ($scope.booking.duration || 4) / 4; // billed by 4 hours

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
                        case '1': { // Daily
                            setDaysScheduledBookings(DAILY, start_date, end_date);
                            break;
                        }
                        case '2': { // MWF
                            setDaysScheduledBookings(MWF, start_date, end_date);
                            break;
                        }
                        case '3': { // TTH
                            setDaysScheduledBookings(TTH, start_date, end_date);
                            break;
                        }
                        case '4': { // Weekly
                            setWeeklyScheduledBookings(WEEKLY, start_date, end_date);
                            break;
                        }
                        case '5': { // Forthnightly
                            // TODO: validate end date (flag error if until_date)
                            setWeeklyScheduledBookings(WEEKLY * 2, start_date, end_date);
                            break;
                        }
                        case '6' : { // Monthly
                            setMonthlyScheduleBookings(start_date, end_date);
                            break;
                        }
                        default :
                            setDaysScheduledBookings(DAILY, start_date, start_date);
                    }
                }
            }
            var multiplier = $scope.booking.scheduledBookings ? $scope.booking.scheduledBookings.length : 1;
            billedBookingCount = (multiplier * billedBookingCount);

            $scope.booking.numberOfBookings = multiplier;
            $scope.booking.amountDue = $scope.booking.pricing.price * billedBookingCount;

        });

        function computePayment() {
            var billedBookingCount = ($scope.booking.duration || 4) / 4; // billed by 4 hours
            var pricing = $scope.booking.scheduledBookings[0].pricing;
            var numberOfBooking = $scope.booking.scheduledBookings.length

            $scope.booking.amountDue = numberOfBooking * billedBookingCount * pricing.price;
        }

        function setBookingEndDate() {
            var startdate = new Date();
            startdate.setDate(startdate.getDate() + 1);
            $scope.booking.allowed_start_date = startdate.toISOString();
            if ($scope.booking.booking_date) {
                var enddate = new Date($scope.booking.booking_date);
                enddate.setDate(enddate.getDate() + 1);
                $scope.booking.allowed_end_date = enddate.toISOString();
            }
        }

        function setDaysScheduledBookings (days, start_date, end_date) {
            var scheduledBookings = [];
            for (var d = new Date(start_date); d <= end_date; d.setDate(d.getDate() + 1)) {
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
            for (var d = new Date(start_date); d <= end_date; d.setDate(d.getDate() + weekly)) {
                scheduledBookings.push({
                    booking_date: (new Date(d)).toLocaleDateString(),
                    booking_time: $scope.booking.booking_time,
                    booking_duration: $scope.booking.duration});
            }
            $scope.booking.scheduledBookings = scheduledBookings;
        }

        function setMonthlyScheduleBookings (start_date, end_date) {
            var scheduledBookings = [];
            for (var d = new Date(start_date); d <= end_date; d.setMonth(d.getMonth() + 1)) {
                scheduledBookings.push({
                    booking_date: (new Date(d)).toLocaleDateString(),
                    booking_time: $scope.booking.booking_time,
                    booking_duration: $scope.booking.duration});
            }
            $scope.booking.scheduledBookings = scheduledBookings;
        }
    }
]);
