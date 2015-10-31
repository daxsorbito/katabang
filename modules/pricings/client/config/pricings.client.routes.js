'use strict';

// Setting up route
angular.module('pricings').config(['$stateProvider',
	function ($stateProvider) {
		// Pricings state routing
		$stateProvider
			.state('pricings', {
				abstract: true,
				url: '/pricings',
				template: '<ui-view/>',
				data: {
					roles: ['user', 'admin']
				}
			})
			.state('pricings.list', {
				url: '',
				templateUrl: 'modules/pricings/views/list-pricings.client.view.html'
			})
			.state('pricings.create', {
				url: '/create',
				templateUrl: 'modules/pricings/views/create-pricing.client.view.html'
			})
			.state('pricings.view', {
				url: '/:pricingId',
				templateUrl: 'modules/pricings/views/view-pricing.client.view.html'
			})
			.state('pricings.edit', {
				url: '/:pricingId/edit',
				templateUrl: 'modules/pricings/views/edit-pricing.client.view.html'
			});
	}
]);
