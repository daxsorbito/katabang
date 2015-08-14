'use strict';

// Servicesoffered controller
angular.module('servicesoffered').controller('ServicesofferedController', ['$scope', '$stateParams', '$location', 'Authentication', 'Servicesoffered',
	function($scope, $stateParams, $location, Authentication, Servicesoffered) {
		$scope.authentication = Authentication;

		// Create new Servicesoffered
		$scope.create = function() {
			// Create new Servicesoffered object
			var serviceoffered = new Servicesoffered ({
				name: this.name
			});

			// Redirect after save
			serviceoffered.$save(function(response) {
				$location.path('servicesoffered/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Servicesoffered
		$scope.remove = function(serviceoffered) {
			if ( serviceoffered ) {
				serviceoffered.$remove();

				for (var i in $scope.servicesoffered) {
					if ($scope.servicesoffered [i] === serviceoffered) {
						$scope.servicesoffered.splice(i, 1);
					}
				}
			} else {
				$scope.serviceoffered.$remove(function() {
					$location.path('servicesoffered');
				});
			}
		};

		// Update existing Servicesoffered
		$scope.update = function() {
			var serviceoffered = $scope.serviceoffered;

			serviceoffered.$update(function() {
				$location.path('servicesoffered/' + serviceoffered._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Servicesoffered
		$scope.find = function() {
			$scope.servicesoffered = Servicesoffered.query();
		};

		// Find existing Servicesoffered
		$scope.findOne = function() {
			$scope.serviceoffered = Servicesoffered.get({
				serviceofferedId: $stateParams.serviceofferedId
			});

		};
	}
]);
