angular.module('homebee.factories', ['homebee.constants'])

.factory('Dialogs', function($state, $ionicModal, $rootScope){
  var dialogs = {};
  var _error = null;

  dialogs.showError = function($scope){
    console.log($scope.error);
    console.log($scope.error_description);
    $ionicModal.fromTemplateUrl('templates/token-error.html', {
      scope: $scope,
      animation: 'animated rollIn',
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      _error = modal;
      console.log('created error modal');
      _error.show();
    });
  }
  dialogs.hideError = function(){
    _error.hide();
  }
  return dialogs;
})

.factory('APIConfig', function($location, CONSTANTS){
  var config = {};
  // _host = $location.host();
  // _port = $location.port();
  _host = '127.0.0.1';
  _port = '4043';
  console.log(_host+':'+_port);
  _version = '1.0';
  _tokenPath = 'oauth/token'
  _debug = '?debug';
  config.tokenURL = function() {
    return 'https://'+_host+':'+_port+'/'+_version+'/'+_tokenPath+_debug;
  }
  config.loginURL = function() {
    return 'https://'+_host+':'+_port+'/'+_version+'/homebee/login'+_debug;
  }
  config.getUserDevicesURL = function(){
    return 'https://'+_host+':'+_port+'/'+_version+'/homebee/user-devices'+_debug;
  }

  return config;
})

.factory('APIFactory', function($state, $http, $ionicLoading, $ionicModal, $interval, APIConfig, Dialogs, CONSTANTS){
  var _accessToken = null;
  var _refreshToken = null;
  var _tokenExpiry = new Date();
  _getToken = function($scope){
    return new Promise(function(resolve, reject, $scope){
      $http({
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'grant_type=password&client_id=HomeBeeApp&client_secret=HomeBee App Workers&username=homebeeapp&password=H0m3b33@pp',
        url: APIConfig.tokenURL()
      })
      .then(function successCallback(response) {
          $ionicLoading.hide();
          _accessToken = response.data.access_token;
          _refreshToken = response.data.refresh_token;
          _tokenExpiry = new Date();
          _tokenExpiry.setTime(_tokenExpiry.getTime()-60000+response.data.expires_in*1000);
          console.log('token expires: '+_tokenExpiry);
          $ionicLoading.hide();
          resolve();
        }, function errorCallback(response) {
          $scope.error = "Get Token Error";
          $scope.error_description = response;
          Dialogs.showError($scope);
          $ionicLoading.hide();
          $scope.error=response.data;
          $scope.error_description = response.data.error_description;
          reject(response.data.error_description);
      });
    });
  };
  _ensuerToken = function($scope){
    //ensure valid token exists
    var promise = new Promise(function(resolve, reject){
      if (_accessToken == null){
        console.log('no access token found ... getting new one');
        _getToken($scope)
          .then(function(){
              resolve();
          })
          .catch(function(err){
            reject(err);
          })
      }else{
        if (_tokenExpiry>new Date()){
          console.log('access token found');
          resolve();
        }else{
          console.log('access token found but expired ... getting new one');
          _getToken($scope)
            .then(function(){
                resolve();
            })
            .catch(function(){
                reject('Sorry, token could not be found');
            });
        }
      }
    } );
    return promise;
  }
  //return the following public object through factory instance
  return {
    getToken: _getToken,
    login: function($scope){
      return new Promise(function(resolve, reject){
        _ensuerToken($scope)
          .then(function(){
            $http({
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+_accessToken
              },
              data: 'email='+$scope.loginData.email+'&password='+$scope.loginData.password,
              url: APIConfig.loginURL()
            })
            .then(function successCallback(response) {
                if (response.data.code == CONSTANTS.LOGIN_ERROR){
                  reject(CONSTANTS.LOGIN_ERROR_MESSAGE);
                }else{
                  resolve(response.data);
                }
              },
              function errorCallback(response) {
                $scope.error = "Get Token Error";
                $scope.error_description = response;
                Dialogs.showError($scope);
                if (response.data.code == CONSTANTS.LOGIN_ERROR){
                  reject(CONSTANTS.LOGIN_ERROR_MESSAGE);
                }else{
                  reject(response.data.error_description);
                }
              }
            )
            .catch(function(err){
              console.log(err);
              reject(err);
            });
          })
          .catch(function(err){
            console.log(err);
            reject(err);
          })
      });
    },
    getUserDevices: function($scope){
      console.log('getting devices for user id: '+$scope.user._id);
      return new Promise(function(resolve, reject){
        _ensuerToken($scope)
          .then(function(){
            $http({
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+_accessToken
              },
              data: 'userId='+$scope.user._id,
              url: APIConfig.getUserDevicesURL()
            })
            .then(function successCallback(response) {
                if (response.data.code == CONSTANTS.SYSTEM_ERROR){
                  reject(CONSTANTS.SYSTEM_ERROR_MESSAGE);
                }else{
                  console.log(response.data.devices);
                  resolve(response.data.devices);
                }
              },
              function errorCallback(response) {
                console.log(response.data);
                alert(response);
                if (response.data.code == CONSTANTS.SYSTEM_ERROR){
                  reject(response.data);
                }else{
                  reject(response.data.error_description);
                }
              }
            )
            .catch(function(err){
              console.log(err);
              reject(err);
            });
          })
          .catch(function(err){
            console.log(err);
            reject(err);
          })
      });
    }
  }
})