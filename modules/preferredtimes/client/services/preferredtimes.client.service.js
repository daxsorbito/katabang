'use strict';

//Locations service used to communicate Services REST endpoints
angular.module('preferredtimes').factory('Preferredtimes', ['$resource',
	function($resource) {
		return $resource('api/preferredtimes/:preferredtimeId', {
			preferredtimeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
