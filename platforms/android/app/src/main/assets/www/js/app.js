// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ksSwiper', 'ngCordova', 'angular.filter', 'ngOrderObjectBy', 'ngAnimate', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
      // do thing
      if (!window.localStorage['user']){
        // alert('in here');
        if (toState.name != 'app.login' &&  toState.name != 'app.password'){
          event.preventDefault();
          $state.go('app.login');
        }
      } else {
        if (toState.name == 'app.login'){
          event.preventDefault();
          $state.go('app.dashboard');
        }
      }      
    })
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

    setTimeout(function() {
      if (navigator.splashscreen){
        navigator.splashscreen.hide();
      }
    }, 3000);
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'DataCtrl'
  })


 .state('app.drafts', {
    cache:false,
    url: '/drafts',
    views: {
      'menuContent': {
        templateUrl: 'templates/drafts.html',
        controller: 'DataCtrl'
      }
    }
  })


.state('app.add', {
    cache: false,
    url: '/add',
    views: {
      'menuContent': {
        templateUrl: 'templates/add.html',
        controller: 'DataCtrl'
      }
    }
  })

.state('app.editdraft', {
    cache: false,
    url: '/editdraft/:did',
    views: {
      'menuContent': {
        templateUrl: 'templates/editdraft.html',
        controller: 'DataCtrl'
      }
    }
  })



.state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'DataCtrl'
      }
    }
  })


.state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'DataCtrl'
      }
    }
  })


.state('app.password', {
    url: '/password',
    views: {
      'menuContent': {
        templateUrl: 'templates/password.html',
        controller: 'DataCtrl'
      }
    }
  })

.state('app.updateaccount', {
    url: '/updateaccount',
    views: {
      'menuContent': {
        templateUrl: 'templates/updateaccount.html',
        controller: 'DataCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  // if none of the above states are matched, use this as the fallback
  if (window.localStorage['user']){
    // alert(window.localStorage['user']);
    loginURL = '/app/dashboard';
    // $urlRouterProvider.otherwise(loginURL);

  } else {
    loginURL = '/app/login';
    // $urlRouterProvider.when('/app/explore', '/app/dashboard');
  }

  $urlRouterProvider.otherwise(loginURL);
});
