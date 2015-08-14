'use strict';

// Setting up route
angular.module('servicesoffered').config(['$stateProvider',
	function ($stateProvider) {
		// Servicesoffered state routing
		$stateProvider
			.state('servicesoffered', {
				abstract: true,
				url: '/servicesoffered',
				template: '<ui-view/>',
				data: {
					roles: ['user', 'admin']
				}
			})
			.state('servicesoffered.list', {
				url: '',
				templateUrl: 'modules/servicesoffered/views/list-servicesoffered.client.view.html'
			})
			.state('servicesoffered.create', {
				url: '/create',
				templateUrl: 'modules/servicesoffered/views/create-servicesoffered.client.view.html'
			})
			.state('servicesoffered.view', {
				url: '/:serviceofferedId',
				templateUrl: 'modules/servicesoffered/views/view-servicesoffered.client.view.html'
			})
			.state('servicesoffered.edit', {
				url: '/:serviceofferedId/edit',
				templateUrl: 'modules/servicesoffered/views/edit-servicesoffered.client.view.html'
			});
	}
]);
