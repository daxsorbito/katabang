'use strict';

//Locations service used to communicate Services REST endpoints
angular.module('bookings').factory('Bookings', ['$resource',
	function($resource) {
		return $resource('api/bookings/:bookingId', {
			bookingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			get: {
				method: 'GET',
				isArray: true
			},
			pay: {
				method: 'POST',
				url: 'api/bookings/pay'
			},
			executePay: {
				method: 'POST',
				url: 'api/bookings/executePay'
			}, 
			customerBookings: {
				method: 'GET',
				url: 'api/userbookings/:userId',
				isArray: true
			}
		});
	}
]);

// angular.module('bookings').factory('CustomerBookings', ['$resource', 
// 	function($resource){
// 		return $resource('api/userbookings/:userId', {
// 			userId: '@_id'
// 		}, {get: {
// 			method: 'GET',
// 			isArray: true
// 		}
// 		});
// 	}
// ]);
