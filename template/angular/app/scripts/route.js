define(['angular', '${ appName }Controller', '${ appName }Service', 'ngRoute'], function(){

  'use strict';

  return angular.module('${ appName }Route', ['${ appName }Controller', '${ appName }Service', 'ngRoute'])
    .config(['$routeProvider', '$locationProvider'
      , function($routeProvider, $locationProvider){
        $routeProvider.when('/', {
          templateUrl: '/views/home.html'
        });

        $locationProvider.hashPrefix('!');
    }]);
});
