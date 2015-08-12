'use strict';

// Configuring the Locations module
angular.module('locations').run(['Menus',
	function (Menus) {
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Locations',
			state: 'locations',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'locations', {
			title: 'List Locations',
			state: 'locations.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'locations', {
			title: 'Create Locations',
			state: 'locations.create'
		});
	}
]);
