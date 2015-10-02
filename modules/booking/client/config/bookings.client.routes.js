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
			.state('bookings.create', {
				url: '/create',
				templateUrl: 'modules/bookings/views/create-bookings.client.view.html'
			})
			.state('bookings.view', {
				url: '/:preferredtimeId',
				templateUrl: 'modules/bookings/views/view-bookings.client.view.html'
			})
			.state('bookings.edit', {
				url: '/:preferredtimeId/edit',
				templateUrl: 'modules/bookings/views/edit-bookings.client.view.html'
			});
	}
]);
