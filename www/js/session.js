angular.module('homebee.session', [])

.factory('Session', function($scope){
  var session = {};
  _user = null;
  session.setUser = function(user) {
    _user = user;
  }
  session.getUser = function() {
    if (_user == null){
      $ionicModal.fromTemplateUrl('login-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.loginmodal = modal;
      });
    }
    return _user;
  }
  session.login = function(){

  }
  return session;
})

;
