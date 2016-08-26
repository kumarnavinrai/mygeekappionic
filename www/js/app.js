// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    setTimeout(function() {
        navigator.splashscreen.hide();
    }, 1000);
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
     if(window.Connection) {
        if(navigator.connection.type == Connection.NONE) {
            alert("There is no internet connection");
        }
        if(navigator.connection.type == Connection.UNKNOWN) {
            alert("There is no unknown");
        } 
    }  
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'tab-search': {
        templateUrl: "templates/search.html",
        controller: 'AboutCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'tab-playlists': {
        templateUrl: "templates/browse.html",
        controller: 'TestimonialsCtrl'
      }
    }
  })
   .state('app.subscriptions', {
    url: "/subscriptions",
    views: {
      'tab-browse': {
        templateUrl: "templates/subscription.html",
        controller: 'SubscriptionsCtrl'
      }
    }
  })

  .state('app.services', {
    url: "/services",
    views: {
      'tab-playlists': {
        templateUrl: "templates/services.html",
        controller: 'ServicesCtrl'
      }
    }
  })
  .state('app.playlists', {
    url: "/playlists",
    views: {
      'tab-playlists': {
        templateUrl: "templates/playlists.html",
        controller: 'PlaylistsCtrl'
      }
    }
  })
  .state('app.noofcomp', {
    url: "/noofcomp",
    views: {
      'tab-playlists': {
        templateUrl: "templates/noofcomp.html",
        controller: 'NoofCompCtrl'
      }
    }
  })
  .state('app.noofyears', {
    url: "/noofyears",
    views: {
      'tab-playlists': {
        templateUrl: "templates/noofyears.html",
        controller: 'NoofYearsCtrl'
      }
    }
  })
    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'tab-playlists': {
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/search');
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|geo|mailto|tel|data|chrome-extension):/);
    
});
