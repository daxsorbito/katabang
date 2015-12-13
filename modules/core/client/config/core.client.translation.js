'use strict';

angular.module('core').config(['$translateProvider',
    function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'languages/',
            suffix: '.json'
        }).useSanitizeValueStrategy('escapeParameters')
        .registerAvailableLanguageKeys(['en'])
        .determinePreferredLanguage()
        .fallbackLanguage('en');
    }
]);
