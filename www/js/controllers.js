var app = angular.module('starter.controllers', []) 
.controller('AppCtrl', function($scope, $ionicModal, $ionicHistory, $timeout, headerService, $cordovaNetwork, $rootScope, sendmsgService, $cordovaCamera, $cordovaCapture, $cordovaFileTransfer, $cordovaSplashscreen, $cordovaFile, $cordovaSpinnerDialog) { 

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
   
   document.addEventListener("pause", function () {
    $ionicHistory.clearCache(); 
    $ionicHistory.clearHistory();
   }, false);

  var headerdata = headerService.getHeader();     
  $scope.playlistsheader = headerdata.headerdata[0].logo; 
  $scope.playlistsheadermore = headerdata.headerdata[0].btn;    
 
  //for camera 
  $scope.takePhoto = function () { 
      var options = { 
        quality: 50, 
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
        quality: 50, 
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
   
   // Form data for the login modal 
   $scope.loginData = {};


   // Used by cordova-video(player)
   // to display recorded or choosen video
   $scope.loginData = {
      videoPath: ""
    };

   // Camera Capture Video function
    $scope.captureVideo = function(){
      var options = {
        quality: 0,
        limit: 1,
        duration: 15
      };

      $cordovaCapture.captureVideo(options).then(function(videoData){
        // Success! Video data is here
        var oldString = "";
        oldString = videoData[0].fullPath;
        $scope.newString = oldString.replace("file:/","file:///");
        $scope.loginData.videoPath =  $scope.newString;
        $scope.loginData.videoData = JSON.stringify(videoData);
        $scope.loginData.videoFilename =  videoData[0].name;
        $scope.loginData.videoLocalUrl =  videoData[0].localURL;
        $scope.loginData.videoType =  videoData[0].type;

        navigator.createThumbnail($scope.loginData.videoPath, function(err, imageData) {
            if (err)
                throw err;
            
            //console.log(imageData); // Will log the base64 encoded string in console. 
            $scope.loginData.videoThumb = "data:image/jpeg;base64," +imageData;
            $scope.$apply();
        });
        
      }, function(err){
        // An error occurred. Show a message to the user
        console.log(err);
      });
    }
   //upload captured video
  $scope.testFileUpload = function () {
     // Destination URL 
     var url = "http://23.95.51.35:8080/pappapi/apiforapp/node";
     $cordovaSpinnerDialog.show("Video Upload","Uploading ...", true); 
     //File for Upload cordova.file.externalRootDirectory + "DCIM/Camera/test/"+ "myvid.mp4";
     var targetPath = $scope.loginData.videoPath;//cordova.file.externalRootDirectory + "DCIM/Camera/test/"+ $scope.data.filenameToUploadVideo; //$scope.data.videoPath;
     $scope.loginData.videoPathOnUpload = targetPath;

      /*
        $scope.newString = oldString.replace("file:/","file:///");
        $scope.data.videoPath =  $scope.newString;
        $scope.data.videoData = JSON.stringify(videoData);
        $scope.data.videoFilename =  videoData[0].name;
        $scope.data.videoLocalUrl =  videoData[0].localURL;
        $scope.data.videoType =  videoData[0].type;
      */

     // File name only
     var filename = targetPath.split("/").pop();
      
      var options = {
          fileKey: "avatar",
          fileName: $scope.loginData.videoFilename,
          chunkedMode: false,
          mimeType: $scope.loginData.videoType,
          params : {'directory':'upload', 'fileName':filename}
      }; 
      var timeoutforfiletransfer;     
      $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
          console.log("SUCCESS: " + JSON.stringify(result.response));
          $scope.loginData.videoSuccess = JSON.stringify(result.response);
          $scope.loginData.showSpinnerForUploadv = true;
          $cordovaSpinnerDialog.hide();
          clearTimeout(timeoutforfiletransfer);
      }, function (err) {
          console.log("ERROR: " + JSON.stringify(err));
          $scope.loginData.videoErr = JSON.stringify(err);
          $cordovaSpinnerDialog.hide();
      }, function (progress) {
          $scope.loginData.showSpinnerForUploadv = false;
          $scope.loginData.videoProg = JSON.stringify(progress);
          $timeout(function () {
            $scope.loginData.uploadProgress = (progress.loaded / progress.total) * 100;
          });
          
          timeoutforfiletransfer = setTimeout(function(){
              $cordovaSpinnerDialog.hide();
              $scope.loginData.videoErr = true;
          },300000);
          // PROGRESS HANDLING GOES HERE
      });
  }


   
  // Create the login modal that we will use later 
  $ionicModal.fromTemplateUrl('templates/login.html', { 
    scope: $scope 
  }).then(function(modal) { 
    $scope.modal = modal; 
  }); 
  // Triggered in the login modal to close it 
  $scope.closeLogin = function() { 
    $scope.modal.hide();
    //$scope.modal.remove(); 
  }; 
  // Open the login modal 
  $scope.login = function() { 
    $scope.modal.show(); 
  }; 
  // Open the login modal 
  $scope.uploadPhoto = function() { 
    $cordovaSpinnerDialog.show("Photo","Uploading ...", true);
    var postData = {}; 
     //data: {filedata:data.imgdata}, 
      $scope.loginData.ShowSpinnerForUpload = true;
      postData = {imgdata:$scope.loginData.imgURI,apikey:'LkahV27WOQMc7E9ebVOemw'};  
      var urltosendfile = 'http://23.95.51.35:8080/pappapi/apiforapp/node';  
       //loginData.fileuploaded
      //$scope.loginData.fileuploaded = sendmsgService.sendFile(urltosendfile,postData); 
      sendmsgService.sendFile(urltosendfile,postData).then(function (data) {
       $scope.loginData.fileuploaded = data;
       $scope.loginData.ShowSpinnerForUpload = false;
       $cordovaSpinnerDialog.hide();
      });
  }; 
  // Perform the login action when the user submits the login form 
  $scope.doLogin = function(check) { 
    if (check == 'fromform') { 
       console.log("from not submitted"); 
       return false;  // you should really show some info to the user 
    } 
    console.log('Doing login', $scope.loginData); 
      var postData = {}; 
      $cordovaSpinnerDialog.show("Message","Sending ...", true);
      postData = {type:'messages',title:$scope.loginData.cname,body:$scope.loginData.message,email:$scope.loginData.username,fileurl:$scope.loginData.imgURIRES,videourl:$scope.loginData.videoSuccess,apikey:'LkahV27WOQMc7E9ebVOemw'};  
      console.log('Doing login', postData); 
      var urltosendmessage = 'http://23.95.51.35:8080/pappapi/apiforapp/node';  
      $scope.loginData.LoadingView = false; 
      //$scope.LoadingView = sendmsgService.sendMessage(urltosendmessage,postData);
      sendmsgService.sendMessage(urltosendmessage,postData).then(function (data) {
       $scope.LoadingViewpass = data;
       $scope.loginData.LoadingViewpass = data;
       $scope.loginData.LoadingView = $scope.loginData.LoadingViewpass;
       $cordovaSpinnerDialog.hide();
       $scope.loginData.sentView = true;
       $cordovaSpinnerDialog.show("Congrats","Message Sent", true);
       $timeout(function() { 
        $cordovaSpinnerDialog.hide();
        $scope.loginData = {};
        $scope.closeLogin(); 
        }, 2000);
       
      }); 
       console.log($scope.LoadingView); 
      //var urltosendmessage = 'http://23.95.51.35:8080/pappapi/apiforapp/node';  
      //sendmsgService.sendMessage(urltosendmessage,postData); 
    // Simulate a login delay. Remove this and replace with your login 
    // code if using a login system 
    /*$timeout(function() { 
      //$scope.LoadingView = false; 
      $scope.sentView = true; 
      //$scope.closeLogin(); 
    }, 10000);*/ 
  }; 
}) 
.controller('NoofYearsCtrl', function($scope, headerService, cartdatafac, $cordovaInAppBrowser) { 
 var headerdata = headerService.getHeader();     
 $scope.playlistsheader = headerdata.headerdata[0].logo; 
 $scope.playlistsheadermore = headerdata.headerdata[0].btn; 
 console.log("no of comp ctrl"); 
 var options = {
      location: 'no',
      clearcache: 'yes',
      toolbar: 'no'
   }; 
 $scope.shoppingOnlineStep3=function(param){  
        console.log(param);
        var listofurls = new Array();
listofurls['computer11'] = 'http://geekstechllc-com.3dcartstores.com/COMPUTER-SUPPORT-1PC-1-YEAR_p_163.html';
listofurls['computer12'] = 'http://geekstechllc-com.3dcartstores.com/COMPUTER-SUPPORT-1PC-6-MONTH_p_162.html';
listofurls['computer13'] = 'http://geekstechllc-com.3dcartstores.com/COMPUTER-SUPPORT-1PC-3-MONTH_p_161.html';
listofurls['computer21'] = 'http://geekstechllc-com.3dcartstores.com/COMPUTER-SUPPORT-2PC-1-YEAR_p_166.html';
listofurls['computer22'] = 'http://geekstechllc-com.3dcartstores.com/COMPUTER-SUPPORT-2PC-6-MONTH_p_165.html';
listofurls['computer23'] = 'http://geekstechllc-com.3dcartstores.com/COMPUTER-SUPPORT-2PC-3-MONTH_p_164.html';
listofurls['computer31'] = 'http://geekstechllc-com.3dcartstores.com/COMPUTER-SUPPORT-3PC-1-YEAR_p_169.html';
listofurls['computer32'] = 'http://geekstechllc-com.3dcartstores.com/COMPUTER-SUPPORT-3PC-6-MONTH_p_168.html';
listofurls['computer33'] = 'http://geekstechllc-com.3dcartstores.com/COMPUTER-SUPPORT-3PC-3-MONTH_p_167.html';
listofurls['antivirus11'] = 'http://geekstechllc-com.3dcartstores.com/AVAST-ANTIVIRUS-1PC-1-YEAR_p_109.html';
listofurls['antivirus12'] = 'http://geekstechllc-com.3dcartstores.com/AVAST-ANTIVIRUS-1PC-6-MONTH_p_108.html';
listofurls['antivirus13']='http://geekstechllc-com.3dcartstores.com/AVAST-INTERNET-SECURITY-1PC-3-MONTH_p_116.html';
listofurls['antivirus21'] ='http://geekstechllc-com.3dcartstores.com/AVAST-INTERNET-SECURITY-2PC-1-YEAR_p_121.html';
listofurls['antivirus22'] = 'http://geekstechllc-com.3dcartstores.com/AVAST-ANTIVIRUS-2PC-6-MONTH_p_111.html';
listofurls['antivirus23'] = 'http://geekstechllc-com.3dcartstores.com/AVAST-ANTIVIRUS-2PC-3-MONTH_p_110.html';
listofurls['antivirus31'] ='http://geekstechllc-com.3dcartstores.com/AVAST-INTERNET-SECURITY-3PC-1-YEAR_p_124.html';
listofurls['antivirus32'] = 'http://geekstechllc-com.3dcartstores.com/AVAST-ANTIVIRUS-3PC-6-MONTH_p_113.html';
listofurls['antivirus33'] = 'http://geekstechllc-com.3dcartstores.com/AVAST-ANTIVIRUS-3PC-3-MONTH_p_113.html';
listofurls['mac11'] = 'http://geekstechllc-com.3dcartstores.com/MACBOOK-SUPPORT-1MAC-1-YEAR_p_181.html';
listofurls['mac12'] = 'http://geekstechllc-com.3dcartstores.com/MACBOOK-SUPPORT-1MAC-6-MONTH_p_180.html';
listofurls['mac13'] = 'http://geekstechllc-com.3dcartstores.com/MACBOOK-SUPPORT-1MAC-3-MONTH_p_179.html';
listofurls['mac21'] = 'http://geekstechllc-com.3dcartstores.com/MACBOOK-SUPPORT-2MAC-1-YEAR_p_184.html';
listofurls['mac22'] = 'http://geekstechllc-com.3dcartstores.com/MACBOOK-SUPPORT-2MAC-6-MONTH_p_183.html';
listofurls['mac23'] = 'http://geekstechllc-com.3dcartstores.com/MACBOOK-SUPPORT-2MAC-3-MONTH_p_182.html';
listofurls['mac31'] = 'http://geekstechllc-com.3dcartstores.com/MACBOOK-SUPPORT-3MAC-1-YEAR_p_187.html';
listofurls['mac32'] = 'http://geekstechllc-com.3dcartstores.com/MACBOOK-SUPPORT-3MAC-6-MONTH_p_186.html';
listofurls['mac33'] = 'http://geekstechllc-com.3dcartstores.com/MACBOOK-SUPPORT-3MAC-3-MONTH_p_185.html';
listofurls['network11'] = 'http://geekstechllc-com.3dcartstores.com/NETWORK-SECURITY-SUPPORT-1DEVICES-1-YEAR_p_190.html';
listofurls['network12'] = 'http://geekstechllc-com.3dcartstores.com/NETWORK-SECURITY-SUPPORT-1DEVICES-6-MONTH_p_189.html';
listofurls['network13'] = 'http://geekstechllc-com.3dcartstores.com/NETWORK-SECURITY-SUPPORT-1DEVICES-3-MONTH_p_188.html';
listofurls['network21'] = 'http://geekstechllc-com.3dcartstores.com/NETWORK-SECURITY-SUPPORT-2DEVICES-1-YEAR_p_193.html';
listofurls['network22'] = 'http://geekstechllc-com.3dcartstores.com/NETWORK-SECURITY-SUPPORT-2DEVICES-6-MONTH_p_192.html';
listofurls['network23'] = 'http://geekstechllc-com.3dcartstores.com/NETWORK-SECURITY-SUPPORT-2DEVICES-3-MONTH_p_191.html';
listofurls['network31'] = 'http://geekstechllc-com.3dcartstores.com/NETWORK-SECURITY-SUPPORT-3DEVICES-1-YEAR_p_196.html';
listofurls['network32'] = 'http://geekstechllc-com.3dcartstores.com/NETWORK-SECURITY-SUPPORT-3DEVICES-6-MONTH_p_195.html';
listofurls['network33'] = 'http://geekstechllc-com.3dcartstores.com/NETWORK-SECURITY-SUPPORT-3DEVICES-3-MONTH_p_194.html';
listofurls['windows11'] = 'http://geekstechllc-com.3dcartstores.com/WINDOWS-SUPPORT-1PC-1-YEAR_p_172.html';
listofurls['windows12'] = 'http://geekstechllc-com.3dcartstores.com/WINDOWS-SUPPORT-1PC-6-MONTH_p_171.html';
listofurls['windows13'] = 'http://geekstechllc-com.3dcartstores.com/WINDOWS-SUPPORT-1PC-3-MONTH_p_170.html';
listofurls['windows21'] = 'http://geekstechllc-com.3dcartstores.com/WINDOWS-SUPPORT-2PC-1-YEAR_p_175.html';
listofurls['windows22'] = 'http://geekstechllc-com.3dcartstores.com/WINDOWS-SUPPORT-2PC-6-MONTH_p_174.html';
listofurls['windows23'] = 'http://geekstechllc-com.3dcartstores.com/WINDOWS-SUPPORT-2PC-3-MONTH_p_173.html';
listofurls['windows31'] = 'http://geekstechllc-com.3dcartstores.com/WINDOWS-SUPPORT-3PC-1-YEAR_p_178.html';
listofurls['windows32'] = 'http://geekstechllc-com.3dcartstores.com/WINDOWS-SUPPORT-3PC-6-MONTH_p_177.html';
listofurls['windows33'] = 'http://geekstechllc-com.3dcartstores.com/WINDOWS-SUPPORT-3PC-3-MONTH_p_176.html';

        $scope.cartdata = param;  
        var data = {};
        data = {step:3,choice:param}
        cartdatafac.add(data);
        console.log(cartdatafac.list[0]);
        var listkey = cartdatafac.list[0].text + cartdatafac.list[1].text + cartdatafac.list[2].text; 
        console.log(listkey);
        $cordovaInAppBrowser.open(listofurls[listkey], '_blank', options)
    
        .then(function(event) {
           // success
        })
      
        .catch(function(event) {
           // error
        });
    } 
 $scope.playlists = [ 
    { title: 'Reggae', id: 1 }, 
    { title: 'Chill', id: 2 }, 
    { title: 'Dubstep', id: 3 }, 
    { title: 'Indie', id: 4 }, 
    { title: 'Rap', id: 5 }, 
    { title: 'Cowbell', id: 6 } 
  ]; 
}) 
.controller('NoofCompCtrl', function($scope, headerService, cartdatafac) { 
 var headerdata = headerService.getHeader();     
 $scope.playlistsheader = headerdata.headerdata[0].logo; 
 $scope.playlistsheadermore = headerdata.headerdata[0].btn; 
 console.log("no of comp ctrl"); 
 console.log(cartdatafac.list); 
 $scope.shoppingOnlineStep2=function(param){  
        console.log(param);
        $scope.cartdata = param;  
        var data = {};
        data = {step:2,choice:param}
        cartdatafac.add(data);
        var link = "#/app/noofyears";
        forMenu(link);
    } 
 $scope.playlists = [ 
    { title: 'Reggae', id: 1 }, 
    { title: 'Chill', id: 2 }, 
    { title: 'Dubstep', id: 3 }, 
    { title: 'Indie', id: 4 }, 
    { title: 'Rap', id: 5 }, 
    { title: 'Cowbell', id: 6 } 
  ]; 
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
.controller('SubscriptionsCtrl', function($scope, $stateParams, headerService, backcallFactory, cartdatafac, $log, $window) { 
    var headerdata = headerService.getHeader();     
    $scope.playlistsheader = headerdata.headerdata[0].logo; 
    $scope.playlistsheadermore = headerdata.headerdata[0].btn; 
    cartdatafac.startagain();
    $scope.shoppingOnline=function(param){  
        console.log(param);
        $scope.cartdata = param;  
        var data = {};
        data = {step:1,choice:param}
        cartdatafac.add(data);
        var link = "#/app/noofcomp";
        forMenu(link);
    } 
   
    $scope.backcallfunClick=function(){  
        backcallFactory.backcallfun(); 
    } 
}) 
.controller('ServicesCtrl', function($scope, $stateParams, headerService, $cordovaCamera, $cordovaCapture, $cordovaFileTransfer, $cordovaFile) { 
    var headerdata = headerService.getHeader();     
    $scope.playlistsheader = headerdata.headerdata[0].logo; 
    $scope.playlistsheadermore = headerdata.headerdata[0].btn; 
    console.log($scope.cartdata);
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

   // Used by cordova-video(player)
   // to display recorded or choosen video
   $scope.data = {
      videoPath: ""
    };

   // Camera Capture Video function
    $scope.captureVideo = function(){
      var options = {
        quality: 0,
        limit: 1,
        duration: 15
      };

      $cordovaCapture.captureVideo(options).then(function(videoData){
        // Success! Video data is here
        var oldString = "";
        oldString = videoData[0].fullPath;
        $scope.newString = oldString.replace("file:/","file:///");
        $scope.data.videoPath =  $scope.newString;
        $scope.data.videoData = JSON.stringify(videoData);
        $scope.data.videoFilename =  videoData[0].name;
        $scope.data.videoLocalUrl =  videoData[0].localURL;
        $scope.data.videoType =  videoData[0].type;
        var copyTargetPath = cordova.file.externalRootDirectory + "DCIM/Camera/test/";
        var oldfilename = $scope.data.videoFilename;
        var filenameext = oldfilename.split(".").pop();
        var filenameToUploadVideo = "myvid." + filenameext;
        $scope.data.filenameToUploadVideo =  filenameToUploadVideo;
        //check if file there
        $cordovaFile.checkFile(copyTargetPath, filenameToUploadVideo)
        .then(function (success) {
            // success
            $cordovaFile.removeFile(copyTargetPath, filenameToUploadVideo)
            .then(function (success) {
               //coping file from sdcard to storage emulated 0 dcim test
               $cordovaFile.copyFile("file:/storage/extSdCard/DCIM/Camera/", $scope.data.videoFilename, copyTargetPath, filenameToUploadVideo)
                .then(function (success) {
                  // success
                  $scope.data.videoCopied = "Copied";
                }, function (error) {
                  // error
                  $scope.data.videoCopied = "Copied Error";
                });
            }, function (error) {
              // error
            });
        }, function (error) {
          // error
          //coping file from sdcard to storage emulated 0 dcim test
               $cordovaFile.copyFile("file:/storage/extSdCard/DCIM/Camera/", $scope.data.videoFilename, copyTargetPath, filenameToUploadVideo)
                .then(function (success) {
                  // success
                  $scope.data.videoCopied = "Copied";
                }, function (error) {
                  // error
                  $scope.data.videoCopied = "Copied Error";
                });
        });
        
      }, function(err){
        // An error occurred. Show a message to the user
        console.log(err);
      });
    }
          
  
  $scope.testFileDownload = function () {
 
      // File for download
      var url = "http://www.gajotres.net/wp-content/uploads/2015/04/logo_radni.png";
       
      // File name only
      var filename = url.split("/").pop();
       
      // Save location
      var targetPath = cordova.file.externalRootDirectory + "DCIM/Camera/test/"+ filename;
     
      
      $scope.data.dPath = targetPath;
      $cordovaFileTransfer.download(url, targetPath, {}, true).then(function (result) {
          console.log('Success');
          $scope.data.videoSuccess = "Success";
      }, function (error) {
          console.log('Error');
          $scope.data.videoErr = "Error";
      }, function (progress) {
          // PROGRESS HANDLING GOES HERE
          $scope.data.videoProg = "Progress";
      });
  }

  $scope.testFileUploadTest = function () {
     // Destination URL 
     var url = "http://23.95.51.35:8080/pappapi/apiforapp/node";
      
     //File for Upload
     var targetPath = cordova.file.externalRootDirectory + "DCIM/Camera/test/"+ "logo_radni.png";
      
     // File name only
     var filename = targetPath.split("/").pop();
      
     var options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          mimeType: "image/jpg",
          params : {'directory':'upload', 'fileName':filename}
      };
           
      $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
          console.log("SUCCESS: " + JSON.stringify(result.response));
      }, function (err) {
          console.log("ERROR: " + JSON.stringify(err));
      }, function (progress) {
          // PROGRESS HANDLING GOES HERE
      });
  }

  //upload captured video
  $scope.testFileUpload = function () {
     // Destination URL 
     var url = "http://23.95.51.35:8080/pappapi/apiforapp/node";
      
     //File for Upload cordova.file.externalRootDirectory + "DCIM/Camera/test/"+ "myvid.mp4";
     var targetPath = $scope.data.videoPath;//cordova.file.externalRootDirectory + "DCIM/Camera/test/"+ $scope.data.filenameToUploadVideo; //$scope.data.videoPath;
     $scope.data.videoPathOnUpload = targetPath;

      /*
        $scope.newString = oldString.replace("file:/","file:///");
        $scope.data.videoPath =  $scope.newString;
        $scope.data.videoData = JSON.stringify(videoData);
        $scope.data.videoFilename =  videoData[0].name;
        $scope.data.videoLocalUrl =  videoData[0].localURL;
        $scope.data.videoType =  videoData[0].type;
      */

     // File name only
     var filename = targetPath.split("/").pop();
      
      var options = {
          fileKey: "avatar",
          fileName: $scope.data.videoFilename,
          chunkedMode: false,
          mimeType: $scope.data.videoType,
          params : {'directory':'upload', 'fileName':filename}
      }; 
           
      $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
          console.log("SUCCESS: " + JSON.stringify(result.response));
          $scope.data.videoSuccess = JSON.stringify(result.response);
          $scope.data.showSpinnerForUpload = true;
      }, function (err) {
          console.log("ERROR: " + JSON.stringify(err));
          $scope.data.videoErr = JSON.stringify(err);
      }, function (progress) {
          $scope.data.showSpinnerForUpload = false;
          $scope.data.videoProg = JSON.stringify(progress);
          $scope.data.uploadProgress = (progress.loaded / progress.total) * 100;
          // PROGRESS HANDLING GOES HERE
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

app.factory('cartdatafac', function(){
  var cart = {};

  cart.list = [];
  cart.add = function(data){
    cart.list.push({id: data.step, text: data.choice});
  };
  cart.startagain = function(){
    cart.list = [];
  };

  return cart;
});
app.filter('setDecimal', function ($filter) {
    return function (input, places) {
        if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
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
   
  var service = {}; 
  service.sendMessage = sendMessageC; 
  service.sendFile = sendFileC;
 
  return service; 
  function sendMessageC(url,data) { 
    // We make use of Angular's $q library to create the deferred instance 
    var deferred = $q.defer();
    var headers = { 
        'Access-Control-Allow-Origin' : '*', 
        'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT', 
        'Content-Type' : 'application/json', 
        'Accept': 'application/json' 
      }; 
//JSON.stringify(data), field_videourl[und][0][value]
//data: {type:data.type,title:data.title,body:data.body,email:data.email,fileurl:data.fileurl,apikey:data.apikey}, 
    $http({ 
            method: 'POST', 
            url: url,
            cache: false, 
            data: {type:data.type,title:data.title,body:{und:[{value:data.body}]},field_email:{und:[{email:data.email}]},field_fileurl:{und:[{value:data.fileurl}]},field_videourl:{und:[{value:data.videourl}]},apikey:data.apikey}, 
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
    var deferred = $q.defer(); 
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

function onLoadB(){
  navigator.splashscreen.show();
}