'use strict';

// Pricings controller
angular.module('pricings').controller('PricingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pricings',
	function($scope, $stateParams, $location, Authentication, Pricings) {
		$scope.authentication = Authentication;

		// Create new Pricing
		$scope.create = function() {
			// Create new Pricing object
			var pricing = new Pricings ({
				name: this.name
			});

			// Redirect after save
			pricing.$save(function(response) {
				$location.path('pricings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pricing
		$scope.remove = function(pricing) {
			if ( pricing ) {
				pricing.$remove();

				for (var i in $scope.pricings) {
					if ($scope.pricings [i] === pricing) {
						$scope.pricings.splice(i, 1);
					}
				}
			} else {
				$scope.pricing.$remove(function() {
					$location.path('pricings');
				});
			}
		};

		// Update existing Pricing
		$scope.update = function() {
			var pricing = $scope.pricing;

			pricing.$update(function() {
				$location.path('pricings/' + pricing._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Pricings
		$scope.find = function() {
			$scope.pricings = Pricings.query();
		};

		// Find existing Pricing
		$scope.findOne = function() {
			$scope.pricing = PricingsR.get({
				pricingId: $stateParams.pricingId
			});
		};
	}
]);
