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
