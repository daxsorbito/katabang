angular.module('core').directive('primaryservice', function() {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            ngModel: '=',
            id: '='
        },
        template: '<select ng-model="ngModel" id="id" class="form-control">' +
                        '<option value="0" ng-selected="(ngModel || 0) == 0">{{ "PLEASE_SELECT" | translate }}</option>' +
                        '<option value="1" ng-selected="ngModel == 1">{{ "SERVICES.HOUSE_CLEANER" | translate }}</option>' +
                        '<option value="2" disabled ng-selected="ngModel == 2">{{ "SERVICES.LAUNDRY_PRESS" | translate }}</option>' +
                        '<option value="3" disabled ng-selected="ngModel == 3">{{ "SERVICES.CARETAKER_OLDSITTER" | translate}}</option>' +
                        '<option value="4" disabled ng-selected="ngModel == 4">{{ "SERVICES.CARETAKER_BABYSITTER" | translate}}</option>' +
                        '<option value="5" disabled ng-selected="ngModel == 5">{{ "SERVICES.PLUMBER" | translate }}</option>' +
                        '<option value="6" disabled ng-selected="ngModel == 6">{{ "SERVICES.AIRCON_CLEANER" | translate }}</option>' +
                        '<option value="7" disabled ng-selected="ngModel == 7">{{ "SERVICES.HOUSE_FIXTURES_INSTALLER" | translate }}</option>' +
                        '<option value="8" disabled ng-selected="ngModel == 8">{{ "SERVICES.GARDENER" | translate }}</option>' +
                        '<option value="9" disabled ng-selected="ngModel == 9">{{ "SERVICES.HANDYMAN" | translate }}</option>' +
                    '</select>'

    };
});

angular.module('core').directive('cities', function(){
  'use strict';
  return {
    restrict: 'EA',
    scope: {
      ngModel: '=',
      id: '='
    },
    template:'<select ng-model="ngModel" id="id" class="form-control">' +
              '<option value="0" ng-selected="(ngModel || 0) == 0">{{ "PLEASE_SELECT" | translate }}</option>' +
              '<option value="1" ng-selected="ngModel == 1">Cebu City</option>' +
              '<option value="2" ng-selected="ngModel == 2">Mandaue</option>' +
              '<option value="3" ng-selected="ngModel == 3">Lapu-lapu</option>' +
              '<option value="4" ng-selected="ngModel == 4">Talisay</option>' +
              '<option value="5" ng-selected="ngModel == 5">Manila-Pasay</option>' +
              '<option value="6" ng-selected="ngModel == 6">Makati</option>' +
              '<option value="7" ng-selected="ngModel == 7">Ortigas</option>' +
              '<option value="8" ng-selected="ngModel == 8">Taguig</option>' +
              '<option value="9" disabled ng-selected="ngModel == 9">Tokyo</option>' +
              '<option value="10" disabled ng-selected="ngModel == 10">Seoul</option>' +
              '<option value="11" disabled ng-selected="ngModel == 11">Singapore</option>' +
            '</select>'
  };
});

angular.module('core').directive('provstates', function(){
  'use strict';
  return {
    restrict: 'E',
    scope: {
      ngModel: '=',
      id: '='
    },
    template: '<select ng-model="ngModel" id="id" class="form-control">' +
                '<option value="0" ng-selected="(ngModel || 0) == 0">{{ "PLEASE_SELECT" | translate }}</option>' +
                '<option value="1" ng-selected="ngModel == 1">Cebu</option>' +
                '<option value="2" ng-selected="ngModel == 2">Manila</option>' +
                '<option value="3" disabled ng-selected="ngModel == 3">Tokyo</option>' +
                '<option value="4" disabled ng-selected="ngModel == 4">Seoul</option>' +
                '<option value="5" disabled ng-selected="ngModel == 5">Hong Kong</option>' +
                '<option value="6" disabled ng-selected="ngModel == 6">Singapore</option>' +
              '</select>'
  };
});

angular.module('core').directive('countries', function(){
  'use strict';
  return{
    restrict: 'E',
    scope: {
      ngModel: '=',
      id: '='
    },
    template: '<select ng-model="ngModel" id="id" class="form-control">' +
                '<option value="0" ng-selected="(ngModel || 0) == 0">{{ "PLEASE_SELECT" | translate }}</option>' +
                '<option value="1" ng-selected="ngModel == 1">Philippines</option>' +
                '<option value="2" disabled ng-selected="ngModel == 2">Japan</option>' +
                '<option value="3" disabled ng-selected="ngModel == 3">Korea</option>' +
                '<option value="4" disabled ng-selected="ngModel == 4">Hong Kong</option>' +
                '<option value="5" disabled ng-selected="ngModel == 5">Singapore</option>' +
              '</select>'
  };
});
