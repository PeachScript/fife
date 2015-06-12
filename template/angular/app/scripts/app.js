define(['angular', '${ appName }Route', '${ appName }Directive', '${ appName }Service'
  , 'ngLocale'], function(){

  'use strict';

  return angular.module('${ appName }', ['${ appName }Route', '${ appName }Directive'
    , '${ appName }Service','ngLocale'])
    .run(function(){
      console.log('App is running now !');
    })
    //switch debug
    .config(['$logProvider', function($logProvider){
        // $logProvider.debugEnabled(false);
    }])
});
