angular.module('core').directive('primaryservice', function() {
    'use strict';
    return {
        restrict: 'E',
        replace: 'true',
        template: '<select data-ng-model="user.primaryService" id="primaryService" class="form-control">' +
                        '<option value="0" {{(user.primaryService == 0) ? "selected" : ""}}>{{ "PLEASE_SELECT" | translate }}</option>' +
                        '<option value="1" {{(user.primaryService == 1) ? "selected" : ""}}>{{ "SERVICES.HOUSE_CLEANER" | translate }}</option>' +
                        '<option value="2" {{(user.primaryService == 2) ? "selected" : ""}}>{{ "SERVICES.LAUNDRY_PRESS" | translate }}</option>' +
                        '<option value="3" {{(user.primaryService == 3) ? "selected" : ""}}>{{ "SERVICES.CARETAKER_OLDSITTER" | translate }}</option>' +
                        '<option value="4" {{(user.primaryService == 4) ? "selected" : ""}}>{{ "SERVICES.CARETAKER_BABYSITTER" | translate }}</option>' +
                        '<option value="5" {{(user.primaryService == 5) ? "selected" : ""}}>{{ "SERVICES.PLUMBER" | translate }}</option>' +
                        '<option value="6" {{(user.primaryService == 6) ? "selected" : ""}}>{{ "SERVICES.AIRCON_CLEANER" | translate }}</option>' +
                        '<option value="7" {{(user.primaryService == 7) ? "selected" : ""}}>{{ "SERVICES.HOUSE_FIXTURES_INSTALLER" | translate }}</option>' +
                        '<option value="8" {{(user.primaryService == 8) ? "selected" : ""}}>{{ "SERVICES.GARDENER" | translate }}</option>' +
                        '<option value="9" {{(user.primaryService == 9) ? "selected" : ""}}>{{ "SERVICES.HANDYMAN" | translate }}</option>' +
                        '<option value="9" {{(user.primaryService == 9) ? "selected" : ""}}>DAXFAXDAX</option>' +
                    '</select>'

    };
});
