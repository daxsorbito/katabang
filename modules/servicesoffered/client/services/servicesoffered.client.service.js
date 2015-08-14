'use strict';

//Servicesoffered service used to communicate Servicesoffered REST endpoints
angular.module('servicesoffered').factory('Servicesoffered', ['$resource',
	function($resource) {
		return $resource('api/servicesoffered/:serviceofferedId', {
			serviceofferedId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
