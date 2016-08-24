
angular.module('homebee.controllers', ['homebee.factories', 'homebee.session'])

.controller('HomebeeCtrl', function($state, $scope, $window, $ionicSideMenuDelegate, $ionicHistory, $ionicLoading, $ionicModal, APIFactory, Dialogs) {
  //root scope holds application wide information
  $scope.loggedIn = false;
  $scope.user = null;
  $scope.logs = [];
  $scope.log = function(log) {
    $scope.logs.unshift({time: new Date().toTimeString(), message: log});
  }
  $scope.clearLogs = function(){
    $scope.logs = [];
  }
  // Form data for the login modal
  $scope.loginData = {}
  //email:"santosh.singh@surya-solutions.com", password:"password"};
  $scope.Dialogs = Dialogs;
  //show the Login dialog
  $scope.showLogin = function(){
    $ionicModal.fromTemplateUrl('templates/login-modal.html', {
      scope: $scope,
      animation: 'slide-in-left',
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.loginModal = modal;
      modal.show();
    });
  }
  //deal with login button click
  $scope.doLogin = function() {
    //call login api
    APIFactory.login($scope)
      .then(function(user){
        $scope.log('login successful');
        $scope.loginModal.hide();
        $scope.user = user.data;
        APIFactory.getUserDevices($scope)
          .then(function(devices){
            $scope.user.devices = devices;
            $scope.$apply();
          })
          .catch(function(err){
            $scope.log(err);
            $scope.error="Error Logging In";
            $scope.error_description = err;
            Dialogs.showError($scope);
          })
      })
      .catch(function(err){
        $scope.loginModal.hide();
        $scope.user = null;
        console.log(err);
        $scope.error="Error Logging In";
        $scope.error_description = err;
        Dialogs.showError($scope);
      })
  }
  $scope.logout = function(){
    $scope.user = null;
    $state.reload();
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });
    $ionicSideMenuDelegate.toggleLeft();
    $state.go('homebee.dashboard');
    $scope.showLogin();
  }
  $scope.hideLogin = function(){

  }
})

.controller('DashboardCtrl', function($scope, $rootScope, $ionicLoading, APIFactory, $cordovaCamera) {
  //must be in every controller to ensure user is logged in
  $scope.$on('$ionicView.enter', function(e) {
    // console.log('dashboard entered');
    // if (!$scope.user){
    //   $scope.showLogin();
    // }
  });
  $scope.refreshUserDevices = function() {
    APIFactory.getUserDevices($scope)
      .then(function(devices){
        $scope.user.devices = devices;
        $scope.$apply();
        $scope.$broadcast('scroll.refreshComplete');
      })
      .catch(function(err){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.error="Error Logging In";
        $scope.error_description = err;
        Dialogs.showError($scope);
      })
  };
  $scope.takePhoto = function () {
    console.log($cordovaCamera);

    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function (err) {
        // An error occured. Show a message to the user
    });
  }
  $scope.choosePhoto = function () {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options).then(function (imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function (err) {
        // An error occured. Show a message to the user
    });
  }
})
.controller('ErrorCtrl', function($scope, $stateParams, APIFactory) {
  $scope.$on('$ionicView.enter', function(e) {
    switch ($stateParams.type) {
      case 'token_error':
        $scope.error = 'Server connection failed';
        $scope.error_description = $stateParams.error_description;
        break;
      default:
        $scope.error = $stateParams.error;
        $scope.error_description = $stateParams.error_description;
    }
  });
})
.controller('AdminCtrl', function($scope, $timeout, APIFactory) {
  $scope.$on('$ionicView.enter', function(e) {
  });
  $scope.onAdminDevicesRefresh = function(){
    $timeout(2000).then(function(){
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
  $scope.onAdminUsersRefresh = function(){
    $timeout(2000).then(function(){
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
})
.controller('LogCtrl', function($scope, $timeout, $ionicModal, APIFactory) {
  $scope.$on('$ionicView.enter', function(e) {
  });
  $scope.hideLog = function(){
    $scope._log.hide();
  }
  $scope.showLog = function(title, description){
    try
    {
      $scope.log = {title: title, description: JSON.stringify(JSON.parse(description), null, 4)};
    }
    catch(e)
    {
      $scope.log = {title: title, description: description};
    }
    $ionicModal.fromTemplateUrl('templates/log.html', {
      scope: $scope,
      animation: 'slide-in-left',
      backdropClickToClose: true,
      hardwareBackButtonClose: true
    }).then(function(modal) {
      $scope._log = modal;
      modal.show();
    });
  }
})


;
