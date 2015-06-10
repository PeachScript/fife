requirejs.config({
  baseUrl: '/',
  waitSeconds: 15,
  urlArgs: 'bust=' + new Date().getTime(),
  paths: {
    // Libraries
    'jQuery': 'bower_components/jquery/dist/jquery.min',
    'angular': 'bower_components/angular/angular',
    'ngLocale': 'bower_components/angular-i18n/angular-locale_zh-cn',

    // module, config, router, directive, service, controllers
    'app': 'scripts/app',
    '${ appName }Config': 'scripts/config',
    '${ appName }Route': 'scripts/route',
    '${ appName }Directive': 'scripts/directive',
    '${ appName }Service': 'scripts/service',
    '${ appName }Controller': 'scripts/controller'
  },
  shim: {
    'angular': {
      deps: ['jQuery']
    }
    'ngLocalstorage': {
      deps: ['angular']
    },
    'ngLocale': {
      deps: ['angular']
    }
  }
});
require(['angular', 'app'], function() {

  'use strict';

  angular.bootstrap(document, ['${ appName }']);

});
