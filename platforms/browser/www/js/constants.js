angular.module('homebee.constants', [])
.factory('CONSTANTS', function($state, $ionicModal, $rootScope){
  return {
    LOGIN_ERROR: 501,
    LOGIN_ERROR_MESSAGE: 'Email and/or Password did not match',
    SYSTEM_ERROR: 500,
    SYSTEM_ERROR_MESSAGE: 'Sorry, system encountered and error'
  }
})
