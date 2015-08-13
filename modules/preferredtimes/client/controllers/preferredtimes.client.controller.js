'use strict';

// Preferredtimes controller
angular.module('preferredtimes').controller('PreferredtimesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Preferredtimes',
	function($scope, $stateParams, $location, Authentication, Preferredtimes) {
		$scope.authentication = Authentication;

		// Create new Preferredtimes
		$scope.create = function() {
			// Create new Preferredtimes object
			var preferredtime = new Preferredtimes ({
				name: this.name
			});

			// Redirect after save
			preferredtime.$save(function(response) {
				$location.path('preferredtimes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Preferredtimes
		$scope.remove = function(preferredtime) {
			if ( preferredtime ) {
				preferredtime.$remove();

				for (var i in $scope.preferredtimes) {
					if ($scope.preferredtimes [i] === preferredtime) {
						$scope.preferredtimes.splice(i, 1);
					}
				}
			} else {
				$scope.preferredtime.$remove(function() {
					$location.path('preferredtimes');
				});
			}
		};

		// Update existing Preferredtimes
		$scope.update = function() {
			var preferredtime = $scope.preferredtime;

			preferredtime.$update(function() {
				$location.path('preferredtimes/' + preferredtime._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Preferredtimes
		$scope.find = function() {
			$scope.preferredtimes = Preferredtimes.query();
		};

		// Find existing Preferredtimes
		$scope.findOne = function() {
			$scope.preferredtime = Preferredtimes.get({
				preferredtimeId: $stateParams.preferredtimeId
			});
		};
	}
]);
