'use strict';

// Setting up route
angular.module('preferredtimes').config(['$stateProvider',
	function ($stateProvider) {
		// Locations state routing
		$stateProvider
			.state('preferredtimes', {
				abstract: true,
				url: '/preferredtimes',
				template: '<ui-view/>',
				data: {
					roles: ['user', 'admin']
				}
			})
			.state('preferredtimes.list', {
				url: '',
				templateUrl: 'modules/preferredtimes/views/list-preferredtimes.client.view.html'
			})
			.state('preferredtimes.create', {
				url: '/create',
				templateUrl: 'modules/preferredtimes/views/create-preferredtimes.client.view.html'
			})
			.state('preferredtimes.view', {
				url: '/:preferredtimeId',
				templateUrl: 'modules/preferredtimes/views/view-preferredtimes.client.view.html'
			})
			.state('preferredtimes.edit', {
				url: '/:preferredtimeId/edit',
				templateUrl: 'modules/preferredtimes/views/edit-preferredtimes.client.view.html'
			});
	}
]);
