'use strict';

// Configuring the Pricings module
angular.module('pricings').run(['Menus',
	function (Menus) {
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Pricings',
			state: 'pricings',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'pricings', {
			title: 'List Pricings',
			state: 'pricings.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'pricings', {
			title: 'Create Pricings',
			state: 'pricings.create'
		});
	}
]);
