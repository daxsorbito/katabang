'use strict';

// Configuring the Servicesoffered module
angular.module('servicesoffered').run(['Menus',
	function (Menus) {
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Services Offered',
			state: 'servicesoffered',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'servicesoffered', {
			title: 'List Services offered',
			state: 'servicesoffered.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'servicesoffered', {
			title: 'Create Services offered',
			state: 'servicesoffered.create'
		});
	}
]);
