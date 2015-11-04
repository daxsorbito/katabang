'use strict';

//Pricings service used to communicate Pricings REST endpoints
angular.module('pricings').factory('Pricings', ['$resource',
	function($resource) {
		return $resource('api/pricings/:pricingLocale', {
			pricingLocale: '@pricingLocale'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
