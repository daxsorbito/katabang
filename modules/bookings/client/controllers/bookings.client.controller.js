'use strict';

// Bookings controller
angular.module('bookings').controller('BookingsController', ['$scope', '$state', '$stateParams', '$window', '$location', '$sessionStorage', '$translate', 'Authentication', 'Bookings', 'Pricings', '$modal', '$modalStack',
    function ($scope, $state, $stateParams, $window, $location, $sessionStorage, $translate, Authentication, Bookings, Pricings, $modal, $modalStack) {
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
            if(!$scope.createBookingPage) delete $sessionStorage.booked;
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
            delete $scope.booking._id;
            var booking = new Bookings($scope.booking);

            // Redirect after save
            booking.$save(function (booking) {
                // TODO: call payment API
                // $location.path('bookings/payment/' + response._id);
                console.log('#########################');
                console.log(booking);
                $scope.booking._id = booking._id;
                console.log('#########################');
                processPayment();

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        function processPayment(){
            var payment = Bookings.pay($scope.booking);
            payment.$promise.then(function(data){
                console.log('-------------------');
                console.log(data);
                var linkLen = data.links.length;
                for (var i = 0; i <= linkLen; i++ ) {
                    var value = data.links[i];
                    if (value.method === 'REDIRECT') {
                        $window.location.href = value.href;
                        break;
                    }
                }
                console.log('-------------------');
            }, function(err){
                console.log('---ERRR-----------');
                console.log(err);
                console.log('---ERRR-----------');
            });
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

        // Find a list of Bookings
        $scope.executePayment = function () {
            var execPayment = {
                paymentId: $stateParams.paymentId,
                token: $stateParams.token,
                PayerID: $stateParams.PayerID,
                booking: $stateParams.bookingId
            };
            var payment = Bookings.executePay(execPayment);
            payment.$promise.then(function(data){
                console.log(data);
            });
        };

        // Find customer bookings
        $scope.findCustomerBookings = function(){
            var custBookings = Bookings.customerBookings({
                userId: Authentication.user._id
            });

            $scope.custBooking = {};
            custBookings.$promise.then(function(data){
                $scope.custBooking.scheduledBookings = data; 
            });
        };

        // Find Service Provider bookings
        $scope.findServiceProviderBookings = function(){
            var spBookings = Bookings.serviceProviderBookings({
                userId: Authentication.user._id
            });

            $scope.events = [];
            $scope.calendarView = 'month';
            $scope.calendarDay = new Date();
            $scope.calendarTitle = 'My Calendar';
            spBookings.$promise.then(function(data){
                
                data.forEach(function(d){
                    var bookingdate = new Date( d.booking.booking_date);
                    var start = bookingdate.setHours(d.booking.booking_time);
                    var end = bookingdate.setHours(d.booking.booking_time + d.booking.duration);
                    var e = {};
                    e.title = '{0} | {1} | '.format( $translate.instant(d.booking.serviceTypeStr), d.user.displayName);
                    e.type =  d.status === 3 ? 'success' : 'important';
                    e.startsAt = new Date(start);
                    e.endAt = new Date(end);
                    e.editable = d.status !== 3;
                    e.deletable = false;
                    e.draggable = false;
                    e.resizable = false;
                    e.schedBookingId = d.id;
                    e.status = d.status;
                    e.customer = d.user.displayName;
                    e.serviceType = $translate.instant(d.booking.serviceTypeStr);
                    e.date = bookingdate.toLocaleDateString();
                    e.startTime = (new Date(start)).toLocaleTimeString();
                    e.endTime = (new Date(end)).toLocaleTimeString();
                    e.address = '{0} {1} {2} {3}'.format(d.user.address.address1, d.user.address.cityStr, d.user.address.prov_stateStr, d.user.address.countryStr);
                    e.contact = d.user.address.telephone;
                    $scope.events.push(e);
                });

                
            });
        };

        $scope.eventEdited = function (calendarEvent){
            $scope.vm = {};
            if(calendarEvent.status === 2){
                $scope.vm.id = calendarEvent.schedBookingId;
                $modal.open({
                    templateUrl: '/modules/bookings/views/modals/event-done.client.modal.html',
                    scope: $scope
                });
            }
        };

        $scope.markEventDone = function(id)
        {
            var spBooking = Bookings.setBookingDone({
                scheduledBookingId: id
            });

             spBooking.$promise.then(function(data){
                 $scope.findServiceProviderBookings();
             });
             $modalStack.dismissAll();
        };

        $scope.eventClicked = function (calendarEvent){
            $modal.open({
            templateUrl: '/modules/bookings/views/modals/event-details.client.modal.html',
            controller: function() {
              var vm = this;
              vm.event = calendarEvent;
            },
            controllerAs: 'vm'
          });
        };

	    // Find existing Bookings
        //$scope.findOne = function () {
        //    $scope.booking = {};
        //    $scope.booking.scheduledBookings = Bookings.get({
        //        bookingId: $stateParams.bookingId
        //    });
        //
        //    $scope.booking.scheduledBookings.$promise.then(function(data){
        //        $scope.booking = data[0].booking;
        //        $scope.booking.scheduledBookings = data;
        //        $scope.payment = {};
        //        computePayment();
        //    });
        //};

        //$scope.pay = function() {
        //    //$scope.payment.booking = $scope.booking;
        //    $scope.payment.booking_id = $scope.booking._id;
        //    $scope.payment.pricing = $scope.booking.scheduledBookings[0].pricing;
        //    var payment = Bookings.pay($scope.payment);
        //    payment.$promise.then(function(data){
        //        console.log(data);
        //    }, function(err){
        //        console.log(err);
        //    });
        //};

        // helper methods
        $scope.$watch('booking.booking_date', function(newValue, oldValue){
            setBookingEndDate();
        });

        // $scope.$watch('payment.creditcardnumber', function(newVal, oldVal){
        //     if (!$scope.payment || !$scope.payment.creditcardnumber) return;
        //     var accountNumber = $scope.payment.creditcardnumber;
        //     var result = "";

        //     //first check for MasterCard
        //     if (/^5[1-5][0-9]{5,}$/.test(accountNumber)) {
        //         result = "master";
        //     }
        //     //then check for Visa
        //     else if (/^4[0-9]{6,}$/.test(accountNumber)) {
        //         result = "visa";
        //     }
        //     //then check for AmEx
        //     else if (/^3[47][0-9]{5,}$/.test(accountNumber)) {
        //         result = "amex";
        //     }
        //     //then check for Discover
        //     else if (/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(accountNumber)) {
        //         result = "disco";
        //     }
        //     $scope.payment.cardType = result;
        // });

        $scope.$watchGroup(['booking.pricing.price', 'booking.booking_date', 'booking.duration', 'booking.recurring', 'booking.frequency', 'booking.frequency_until_date', 'booking.booking_time'], function () {
            if (!$scope.booking || !$scope.booking.pricing) return;
            var billedBookingCount = ($scope.booking.duration || 4) / 4; // billed by 4 hours

            if ($scope.booking.booking_date) {
                var start_date = new Date($scope.booking.booking_date);
                var end_date = ($scope.booking.recurring === 1 && $scope.booking.frequency_until_date) ? new Date($scope.booking.frequency_until_date) : new Date($scope.booking.booking_date);
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
            var numberOfBooking = $scope.booking.scheduledBookings.length;

            $scope.booking.amountDue = $scope.payment.amountDue = numberOfBooking * billedBookingCount * pricing.price;
        }

        function setBookingEndDate() {
            if (!$scope.booking) return;
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
