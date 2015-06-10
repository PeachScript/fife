define(['angular', '${ appName }Config'], function(){

  'use strict';

  return angular.module('${ appName }Service', ['${ appName }Config'])
    /**
     * add mobile interceptor into the http provider
     * @date        2015-3-28
     * @author      Peach<scdzwyxst@gmail.com>
     */
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('mobileHttpInterceptor');
    }])
    /**
     * request handler
     * @date        2015-3-28
     * @author      Peach<scdzwyxst@gmail.com>
     * @param  request config
     */
    .factory('requestHandler', ['messagePrompt', 'config', '$http'
      , '$ionicLoading', '$log', '$cookies'
      , function(messagePrompt, config, $http, $ionicLoading, $log, $cookies){
      return function(arg){
        var conf = {
          method: 'GET', // set default method,
          headers: {}
        };

        if(angular.isString(arg)){
          conf.keyName = arg;
        }else{
          var temp = {};
          angular.copy(arg, temp);
          angular.extend(conf, temp);
        }

        // extend api configration
        if(conf.keyName){
          if(typeof(config.apis[conf.keyName]) == 'string')
            conf.url = config.apis[conf.keyName];
          else
            angular.extend(conf, config.apis[conf.keyName]);

          // add base url from apis config
          conf.url = config.apis.baseUrl + conf.url;

          delete conf.keyName;
        }

        // check config
        if(!conf.url)
          return console.error('Missing url in the request config!');
        if(!conf.method)
          return console.error('Missing method in the request config!');

        // splice url if the url has params
        if(conf.url.indexOf('/:') != -1){
          (function(){
            // http://baidu.com/:id/action/:user/:title
            var temp = conf.url.split('/:');
            for(var i = 1;i<temp.length;i++){
              var param = temp[i].split('/'),
                  repaceKey = param[0];

              // find param in the params field of config
              if(conf.params[repaceKey]){
                param[0] = conf.params[repaceKey];
                temp[i] = param.join('/');
                delete conf.params[repaceKey];
              }else
                return console.error('Missing param: ' + param[0] + ' in the request config!');
            }

            conf.url = temp.join('/');
          })()
        }

        // add base url from conf
        if(conf.baseUrl){
          conf.url = conf.baseUrl + conf.url;
          delete conf.baseUrl;
        }

        // if cookies have the auth key, add it
        if($cookies['token']){
          angular.extend(conf.headers
            , {'AUTHORIZATION': 'Bearer ' + $cookies['token']});
        }

        // create http request
        var req = $http(conf);

        // handle all error message in global
        req.error(function(data){
          messagePrompt.error((data?data.message: null) || '啊咧，后面好像出了点儿问题！');
          // hide the loading if some loading has been shown
          $ionicLoading.hide();
        });

        // handle all success message in global
        req.success(function (data) {
          data && data.message && messagePrompt.tooltip(data.message);
          $log.debug('Response - ', data);
        });

        return req;
      }
    }])
    /**
     * request interceptor
     * @date        2015-3-28
     * @author      Peach<scdzwyxst@gmail.com>
     */
    .factory('mobileHttpInterceptor', ['$q', '$log', function ($q, $log) {
      return {
        response: function(response){
          if(response.data && response.data.code >= 400){
            response.status = response.data.code;

            $log.debug('Intercept an fake error - ', response.data);

            return $q.reject(response);
          }

          return response;
        }
      }
    }]);
})
