'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
	'public/lib/angular-bootstrap-calendar/dist/css/angular-bootstrap-calendar.min.css'
      ],
      js: [
        'public/lib/moment/min/moment.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/angular-sanitize/angular-sanitize.min.js',
        'public/lib/angular-translate/angular-translate.min.js',
        'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'public/lib/angular-recaptcha/release/angular-recaptcha.min.js',
        'public/lib/ngstorage/ngStorage.min.js',
	      'public/lib/angular-bootstrap-calendar/dist/js/angular-bootrap-calendar-tpls.min.js'

      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
