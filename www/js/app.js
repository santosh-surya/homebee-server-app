// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('homebee', ['ionic', 'ngCordova', 'homebee.controllers', 'homebee.constants'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('homebee', {
    url: '/homebee',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'HomebeeCtrl'
  })
  .state('homebee.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DashboardCtrl'
      }
    }
  })
  .state('homebee.admin-devices', {
    url: '/admin-devices',
    views: {
      'menuContent': {
        templateUrl: 'templates/devices.html',
        controller: 'AdminCtrl'
      }
    }
  })
  .state('homebee.admin-users', {
    url: '/admin-users',
    views: {
      'menuContent': {
        templateUrl: 'templates/users.html',
        controller: 'AdminCtrl'
      }
    }
  })
  .state('homebee.admin-logs', {
    url: '/admin-logs',
    views: {
      'menuContent': {
        templateUrl: 'templates/logs.html',
        controller: 'LogCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/homebee/dashboard');
});
