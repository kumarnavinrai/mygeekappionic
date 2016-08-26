var app = angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $timeout, headerService, $cordovaNetwork, $rootScope, sendmsgService, $cordovaCamera) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    
  document.addEventListener("deviceready", function () {

        $scope.network = $cordovaNetwork.getNetwork();
        $scope.isOnline = $cordovaNetwork.isOnline();
        $scope.$apply();
        
        // listen for Online event
        $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            $scope.isOnline = true;
            $scope.network = $cordovaNetwork.getNetwork();
            
            $scope.$apply();
        })

        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            
            $scope.isOnline = false;
            $scope.network = $cordovaNetwork.getNetwork();
            
            $scope.$apply();
        })

  }, false);    
    
  var headerdata = headerService.getHeader();    
  $scope.playlistsheader = headerdata.headerdata[0].logo;
  $scope.playlistsheadermore = headerdata.headerdata[0].btn;   
/*
  //for camera
  $scope.takePhoto = function () {
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
			$scope.loginData.imgURI = $scope.imgURI;
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
			$scope.loginData.imgURI = $scope.imgURI;
		}, function (err) {
			// An error occured. Show a message to the user
		});
	}  
   */ 
  // Form data for the login modal
  $scope.loginData = {};
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };
  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  // Open the login modal
  $scope.uploadPhoto = function() {
    var postData = {};
     //data: {filedata:data.imgdata},
      postData = {imgdata:$scope.loginData.imgURI,apikey:'LkahV27WOQMc7E9ebVOemw'}; 
      var urltosendfile = 'http://23.95.51.35:8080/pappapi/apiforapp/node'; 
      
      $scope.fileuploaded = sendmsgService.sendFile(urltosendfile,postData);
  };
  // Perform the login action when the user submits the login form
  $scope.doLogin = function(check) {
    if (check == 'fromform') {
       console.log("from not submitted");
       return false;  // you should really show some info to the user
    }
    console.log('Doing login', $scope.loginData);
      var postData = {};
      postData = {type:'messages',title:$scope.loginData.cname,body:$scope.loginData.message,email:$scope.loginData.username,fileurl:$scope.loginData.imgURI,apikey:'LkahV27WOQMc7E9ebVOemw'}; 
      console.log('Doing login', postData);
      var urltosendmessage = 'http://23.95.51.35:8080/pappapi/apiforapp/node'; 
      $scope.LoadingView = false;
      //$scope.LoadingView = sendmsgService.sendMessage(urltosendmessage,postData);
      sendmsgService.sendMessage(urltosendmessage,postData).then(function (data) {
        $scope.LoadingView = data;
        $scope.sentView = true;
      });
       
      //var urltosendmessage = 'http://23.95.51.35:8080/pappapi/apiforapp/node'; 
      //sendmsgService.sendMessage(urltosendmessage,postData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    
  };
})
.controller('PlaylistsCtrl', function($scope, headerService) {
 var headerdata = headerService.getHeader();    
 $scope.playlistsheader = headerdata.headerdata[0].logo;
 $scope.playlistsheadermore = headerdata.headerdata[0].btn;
 
 $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('SubHeaderCtrl', function($scope, $stateParams) {
    $scope.numbertocall = '1-800-832-5450';
    $scope.callGeeks = function() {
       
        var number = '18008325450'; 
        window.location.href = 'tel:'+ number;
        /*
        window.plugins.CallNumber.callNumber(function(){
             //success logic goes here
            }, function(){
             //error logic goes here
            }, number);*/
    }    
})
.controller('TestimonialsCtrl', function($scope, $stateParams, headerService) {
    var headerdata = headerService.getHeader();    
    $scope.playlistsheader = headerdata.headerdata[0].logo;
    $scope.playlistsheadermore = headerdata.headerdata[0].btn;
})
.controller('BackbuttonCtrl', function($scope, $stateParams, backcallFactory) { 
    $scope.backcallfunClick1=function(){  
        backcallFactory.backcallfun();
    }
})
.controller('SubscriptionsCtrl', function($scope, $stateParams, headerService, backcallFactory) {
    var headerdata = headerService.getHeader();    
    $scope.playlistsheader = headerdata.headerdata[0].logo;
    $scope.playlistsheadermore = headerdata.headerdata[0].btn;
    
  
    $scope.backcallfunClick=function(){ 
        backcallFactory.backcallfun();
    }
})
.controller('ServicesCtrl', function($scope, $stateParams, headerService, $cordovaCamera) {
    var headerdata = headerService.getHeader();    
    $scope.playlistsheader = headerdata.headerdata[0].logo;
    $scope.playlistsheadermore = headerdata.headerdata[0].btn;
	
				$scope.takePhoto = function () {
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
.controller('AboutCtrl', function($scope, $stateParams, headerService, $cordovaNetwork, $rootScope) {
    var headerdata = headerService.getHeader();    
    $scope.playlistsheader = headerdata.headerdata[0].logo;
    $scope.playlistsheadermore = headerdata.headerdata[0].btn;
    
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
});

app.service('headerService', function(){
	this.getHeader = function() { 
        var fac = {};
	
	    fac.headerdata = [{'logo':'<img class="title-image" src="img/geeks-logo-mobile.png" >', 'btn':'<span ng-controller="BackbuttonCtrl"><button class="button button-icon button-clear icon ion-home cust-right"  ng-click="backcallfunClick1()" onClick="forHome()" ></button></span>'}]; 
	
	    return fac;
        
    };
});

app.factory('backcallFactory', ['$state','$ionicPlatform','$ionicHistory','$timeout',function($state,$ionicPlatform,$ionicHistory,$timeout){
 
var obj={}
    obj.backcallfun=function(){
        
    $ionicHistory.nextViewOptions({
       disableBack: true
    });

    $state.go('app.search');
}//backcallfun
return obj;
}]);

app.factory('sendmsgService', function ($q, $http) {
  var deferred = $q.defer();
  var service = {};
  service.sendMessage = sendMessageC;
  service.sendFile = sendFileC;
  return service;
  function sendMessageC(url,data) {
    // We make use of Angular's $q library to create the deferred instance
    
    var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type' : 'application/json',
        'Accept': 'application/json'
      };
//JSON.stringify(data),
//data: {type:data.type,title:data.title,body:data.body,email:data.email,fileurl:data.fileurl,apikey:data.apikey},
    $http({
            method: 'POST',
            url: url,
            data: {type:data.type,title:data.title,body:{und:[{value:data.body}]},field_email:{und:[{email:data.email}]},field_fileurl:{und:[{value:data.fileurl}]},apikey:data.apikey},
            headers: headers
        })
        .success(function(data) {
          // The promise is resolved once the HTTP call is successful.
          deferred.resolve(data);
        })
        .error(function() {
          // The promise is rejected if there is an error with the HTTP call.
          deferred.reject();
        });

    // The promise is returned to the caller
    return deferred.promise;
  }

  function sendFileC(url,data) {
    // We make use of Angular's $q library to create the deferred instance
    
    var headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
        'Content-Type' : 'application/json',
        'Accept': 'application/json'
      };
//JSON.stringify(data),
//data: {type:data.type,title:data.title,body:data.body,email:data.email,fileurl:data.fileurl,apikey:data.apikey},
    $http({
            method: 'POST',
            url: url,
            data: {filedata:data.imgdata},
            headers: headers
        })
        .success(function(data) {
          // The promise is resolved once the HTTP call is successful.
          deferred.resolve(data);
        })
        .error(function() {
          // The promise is rejected if there is an error with the HTTP call.
          deferred.reject();
        });

    // The promise is returned to the caller
    return deferred.promise;
  }


});

function forHome(){
    window.location.href="#/app/search";
}

function forMenu(link){ console.log("i am clicked");
    window.location.href=link;
}
