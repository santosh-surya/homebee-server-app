
angular.module('homebee.controllers', ['homebee.factories', 'homebee.session'])

.controller('HomebeeCtrl', function($scope, $ionicLoading, $ionicModal, APIFactory, Dialogs) {
  //root scope holds application wide information
  $scope.loggedIn = false;
  $scope.user = null;
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
        $scope.loginModal.hide();
        $scope.user = user.data;
        APIFactory.getUserDevices($scope)
          .then(function(devices){
            $scope.user.devices = devices;
            $scope.$apply();
          })
          .catch(function(err){
            $scope.error="Error Logging In";
            $scope.error_description = err;
            Dialogs.showError($scope);
          })
      })
      .catch(function(err){
        $scope.error="Error Logging In";
        $scope.error_description = err;
        Dialogs.showError($scope);
      })
    }
  $scope.hideLogin = function(){

  }
})

.controller('DashboardCtrl', function($scope, $ionicLoading, APIFactory, $cordovaCamera) {
  //must be in every controller to ensure user is logged in
  $scope.$on('$ionicView.enter', function(e) {
    console.log('entered dashboard');
    if (!$scope.user){
      $scope.showLogin();
    }
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
    console.log('AdminCtrl view entered');
  });
  $scope.onAdminDevicesRefresh = function(){
    console.log('now refreshing devices');
    $timeout(2000).then(function(){
      console.log('refreshed');
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
  $scope.onAdminUsersRefresh = function(){
    console.log('now refreshing users');
    $timeout(2000).then(function(){
      console.log('refreshed');
      $scope.$broadcast('scroll.refreshComplete');
    })
  }
})


;
