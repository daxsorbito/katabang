'use strict';

angular.module('core').config(['$translateProvider',
    function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'languages/',
            suffix: '.json'
        }).useSanitizeValueStrategy('sanitize')
        .registerAvailableLanguageKeys(['en'])
        .determinePreferredLanguage()
        .fallbackLanguage('en');
    }
]);
