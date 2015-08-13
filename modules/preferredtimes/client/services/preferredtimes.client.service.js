'use strict';

//Locations service used to communicate Preferredtimes REST endpoints
angular.module('locations').factory('Preferredtimes', ['$resource',
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
