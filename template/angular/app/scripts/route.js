define(['angular', '${ appName }Controller', '${ appName }Service'], function(){

  'use strict';

  return angular.module('${ appName }Route', ['${ appName }Controller', '${ appName }Service'])
    .config(['$routeProvider', '$locationProvider'
      , function($routeProvider, $locationProvider){
        $routeProvider.when('/home', {
          templateUrl: '/views/home.html'
        });

        $locationProvider.hashPrefix('!');
    }]);
});
