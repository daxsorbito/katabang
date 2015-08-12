'use strict';

// Setting up route
angular.module('locations').config(['$stateProvider',
	function ($stateProvider) {
		// Locations state routing
		$stateProvider
			.state('locations', {
				abstract: true,
				url: '/locations',
				template: '<ui-view/>',
				data: {
					roles: ['user', 'admin']
				}
			})
			.state('locations.list', {
				url: '',
				templateUrl: 'modules/locations/views/list-locations.client.view.html'
			})
			.state('locations.create', {
				url: '/create',
				templateUrl: 'modules/locations/views/create-location.client.view.html'
			})
			.state('locations.view', {
				url: '/:locationId',
				templateUrl: 'modules/locations/views/view-location.client.view.html'
			})
			.state('locations.edit', {
				url: '/:locationId/edit',
				templateUrl: 'modules/locations/views/edit-location.client.view.html'
			});
	}
]);
