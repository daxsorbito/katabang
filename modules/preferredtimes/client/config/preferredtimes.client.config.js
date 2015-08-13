'use strict';

// Configuring the Preferredtimes module
angular.module('preferredtimes').run(['Menus',
	function (Menus) {
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Preferred Times',
			state: 'preferredtimes',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'preferredtimes', {
			title: 'List Preferred times',
			state: 'preferredtimes.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'preferredtimes', {
			title: 'Create Preferred times',
			state: 'preferredtimes.create'
		});
	}
]);
