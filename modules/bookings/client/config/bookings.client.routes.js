'use strict';

// Setting up route
angular.module('bookings').config(['$stateProvider',
	function ($stateProvider) {
		// Locations state routing
		$stateProvider
			.state('bookings', {
				abstract: true,
				url: '/bookings',
				template: '<ui-view/>',
				data: {
					roles: ['user', 'admin']
				}
			})
			.state('bookings.list', {
				url: '',
				templateUrl: 'modules/bookings/views/list-bookings.client.view.html'
			})
			.state('bookings.paymentexecute', {
				url: '/executePayment/:bookingId/?paymentId&token&PayerID',
				templateUrl: 'modules/bookings/views/execute-bookings.client.view.html'
			})
			.state('bookings.create', {
				url: '/create',
				templateUrl: 'modules/bookings/views/create-bookings.client.view.html'
			})
			.state('bookings.payment', {
				url: '/payment/:bookingId',
				templateUrl: 'modules/bookings/views/payment-bookings.client.view.html'
			})
			.state('bookings.edit', {
				url: '/:bookingId/edit',
				templateUrl: 'modules/bookings/views/edit-bookings.client.view.html'
			});
	}
]);
