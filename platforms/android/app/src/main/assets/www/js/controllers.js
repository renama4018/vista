angular.module('starter.controllers', [])



.factory('Data', function () {

  return { message: "I'm data from a service", 
    user: null,
    userAccess: null,
    drafts: [],
    crops: [],
    issues: [],
    personalData: false,
    reportFormGroupLength: 0,
    reportFormLength: 0,
    reportForm: [],
    reportFormGroup: [],
    reportFormArray: [],
    reportGroups: [],
    instructions: [],
    reportGroups: [],
    loggedIn: false,
    lga: null,
  };
})


/*
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

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

 
})
*/

.controller('DataCtrl', function($scope, $ionicSideMenuDelegate, $interval, $ionicSlideBoxDelegate, $cordovaCamera, Data, $ionicModal, $timeout, $http, $ionicLoading, $state, $stateParams, $filter, $window, $location, $ionicPopup, $ionicHistory, $document) {
  
  // $scope.farmerGender = 'Male';

  $ionicSideMenuDelegate.canDragContent(false);

  $scope.options = {
    loop: false,
    effect: 'fade',
    speed: 500,
  };
  $scope.baseUrl = 'http://yokeserver.com/reasurvey/';
  $scope.reportData = {};
  $scope.reportDataTime = [];
  $scope.reportForm = Data.reportForm;
  $scope.reportFormArray = Data.reportFormArray;
  $scope.reportInstructions = Data.instructions;
  $scope.reportFormGroupLength = Data.reportFormGroupLength;
  $scope.reportFormStepLength = $scope.reportFormGroupLength - 1;
  $scope.reportFormLength = Data.reportFormLength;
  $scope.currentStepStyle = [];
  $scope.currentDraftStepStyle = [];
  $scope.reportFormGroup = Data.reportFormGroup;
  $scope.reportGroups = Data.reportGroups;
  $scope.drafts = Data.drafts;
  // $scope.lgas = '';


  // var canvas = document.querySelector("#signatureCanvas");
  // console.log(canvas);
  // var signaturePad = new SignaturePad(canvas);


  
$scope.initSlider = function() {
    //some options to pass to our slider
    $scope.data = {};
    $scope.data.sliderOptions = {
      initialSlide: 0,
      direction: 'horizontal', //or vertical
      speed: 300 //0.3s transition
    };

    //create delegate reference to link with slider
    $scope.data.sliderDelegate = null;

    //watch our sliderDelegate reference, and use it when it becomes available
    $scope.$watch('data.sliderDelegate', function(newVal, oldVal) {
      if (newVal != null) {
        $scope.data.sliderDelegate.on('slideChangeEnd', function() {
          $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;
          //use $scope.$apply() to refresh any content external to the slider
          $scope.$apply();
        });
      }
    });
  };


  $scope.initSig = function(element, field) {
    // console.log(canvas);
    var sigid = 'signature_'+field;

    if (!$scope.sigObj){
      $scope.sigObj = {};
    }

    var canvas = element;
    $scope.sigObj[sigid] = new SignaturePad(canvas);

    /*
     var canvastest = document.getElementsByClassName('signature-pad');
     console.log(canvastest[0].attributes.canvas);

     var sigid = 'signature_'+field;

     var canvas = $scope.getCanvas(field);

     if (!$scope.sigObj){
      $scope.sigObj = {};
     }

     $scope.sigObj[sigid] = new SignaturePad(canvas);
     */
     // alert(element);
      //console.log($scope.signaturePad);
  };




  $scope.clearCanvas = function(field) {
    var sigid = 'signature_'+field;

    $scope.sigObj[sigid].clear();
    $scope.reportURI[field] = [];
  };
 
  $scope.saveCanvas = function(field) {
    var sigid = 'signature_'+field;

    if ($scope.sigObj[sigid]){
      var sigImg = $scope.sigObj[sigid].toDataURL();
      // console.log(sigImg);
      // var blankImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAC0CAYAAAAuPxHvAAAA50lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwYkyhAAEkTYK3AAAAAElFTkSuQmCC";
      
      if (!$scope.sigObj[sigid].isEmpty()){
        // console.log('urls are different');
        if (!$scope.reportURI){
          $scope.reportURI = {};
        }
        if (!$scope.reportURI[field]){
          $scope.reportURI[field] = [];
        }
        $scope.reportURI[field].push(sigImg);
      }
      
    }
    
  }



$scope.slideValidate = function (index){
  alert(index);
}


$scope.updateSlide = function(){
  $ionicSlideBoxDelegate.update();
};


$scope.nextSlide = function(){
  // $ionicSlideBoxDelegate.update();
  $scope.updateSlide();
  $ionicSlideBoxDelegate.next();
  console.log($ionicSlideBoxDelegate.currentIndex());
  console.log($ionicSlideBoxDelegate.slidesCount());
  // console.log($ionicSlideBoxDelegate);

};

$scope.prevSlide = function(){
  // $ionicSlideBoxDelegate.update();
  $scope.updateSlide();
  $ionicSlideBoxDelegate.previous();
};



$scope.requiredFormFields = function(){
  $scope.otherRequiredFields = true;
  for (var parent in $scope.reportForm){
    for (var key in parent){
      if ($scope.reportForm[parent][key] && $scope.reportForm[parent][key].type == "image"){
        var fieldName  = $scope.reportForm[parent][key].name;
        var required = $scope.reportForm[parent][key].required;
        
        if (required){
          if (!$scope.reportURI || !$scope.reportURI[fieldName]){
            $scope.otherRequiredFields = false;
          } else { // if reportURI not defined
            var count = $scope.reportURI[fieldName].length;
          
            if (count == 0 || !count){
              $scope.otherRequiredFields = false;
            }
          } // end else  

          if ($scope.reportForm[parent][key].groupid == "signature"){
            var sigid = 'signature_'+fieldName;

            if (!$scope.sigObj[sigid].isEmpty()){
              $scope.otherRequiredFields = true;
            } 
          } // if signature
        } // if required
        
      } // if image 
      
    } // end for
  }// for

  if (!$scope.reportLat || !$scope.reportLon){
    $scope.otherRequiredFields = false;
  }

  return $scope.otherRequiredFields;


  

  
};




$scope.buildForm = function(rebuild){
    
    // console.log('in here');
    // $ionicLoading.show();
    $scope.reportFormStep = 0;
    $scope.reportDraftFormStep = 0;
    // $scope.currentStepStyle[0] = 'block';

    if (window.localStorage['reportForm'] != '' && window.localStorage['reportForm'] != 'undefined' && window.localStorage['reportForm'] != undefined && rebuild != 'Y'){
      Data.reportForm = JSON.parse(window.localStorage['reportForm']);
      Data.reportFormLength = JSON.parse(window.localStorage['reportFormLength']);
      Data.reportFormGroupLength = window.localStorage['reportFormGroupLength'];
      Data.instructions = JSON.parse(window.localStorage['instructions']);
      Data.reportGroups = JSON.parse(window.localStorage['reportGroups']);

      Data.lga = JSON.parse(window.localStorage['lgas']);

      // var canvas = angular.element(document.querySelector("signatureCanvas"));
      //console.log($document);

      



    } else {
      this.getForm = $scope.baseUrl + 'appuser/buildform?ftype=report';
      $http.get(this.getForm, {cache: false}).
          success(function(form, status, headers, config) {
            // $ionicLoading.hide();
            // console.log(form);




            var sortedForm = {};

            for (var field in form.fields){
              this.groupid = 'group_'+form.fields[field].group;
              if (!sortedForm[this.groupid]){
                // sortedForm.push([]);
                sortedForm[this.groupid] = [];
                // this.instructions = $filter('filter')($scope.reportInstructions, {activity: fieldvalue}, true);

              }

              sortedForm[this.groupid].push(form.fields[field]);
            }


            var sortedFormArray = Object.keys(sortedForm).map(function(key) {
              return sortedForm[key];
            });

             sortedFormArray.sort(function (a,b) {
              // console.log(a);
              if (a[0].parentweight == b[0].parentweight){
                return a[0].groupweight - b[0].groupweight;  
              }
              return a[0].parentweight - b[0].parentweight;                         
            });

            console.log(sortedFormArray);


            window.localStorage['reportForm'] = JSON.stringify(sortedFormArray);
            window.localStorage['reportFormGroupLength'] = form.groupCount;
            window.localStorage['reportFormLength'] = form.fieldCount;
            window.localStorage['instructions'] = JSON.stringify(form.instructions);
            window.localStorage['reportGroups'] = JSON.stringify(form.group);

            Data.reportForm = sortedFormArray;
            Data.reportFormGroupLength = form.groupCount;
            Data.reportFormLength = form.fieldCount;
            Data.instructions = form.instructions;
            Data.reportGroups = form.group;

            for (var parent in Data.reportForm){
              this.childLength = Data.reportForm[parent].length;
              for (var key = 0; key < this.childLength; key++){
                if (Data.reportForm[parent][key].name == "field_lga"){
                  // Data.lga = Data.reportForm[parent][key];
                  window.localStorage['lgas'] = JSON.stringify(Data.reportForm[parent][key]);
                  Data.lga = JSON.parse(window.localStorage['lgas']);
                  // console.log('in build form http get');
                }
              }
            }

            


            console.log('in http.get');

            // $ionicLoading.hide();

            if (rebuild == 'Y'){
              $ionicLoading.hide();
              $scope.cleanForm('add');
              $scope.cleanForm('edit');
              $scope.cleanForm('draft');
              $location.path('/app/dashboard');
            }

             


        }).
        error(function(form, status, headers, config) {
         
        });

    }

  };


$scope.cleanForm = function(draft){

  for (var i = 0; i < 100; i++){
    if (draft == 'Y'){
      $scope.currentDraftStepStyle[i] = 'none';
    } else {
      $scope.currentStepStyle[i] = 'none';
    }
   
  }

  if (draft == 'Y'){
      $scope.currentDraftStepStyle[0] = 'block';
  } else {
      $scope.currentStepStyle[0] = 'block';
  }

   if (draft == 'Y'){
    
    $scope.getDrafts();
   } else {
    $scope.reportFormStep = 0;
   }
  
};




$scope.formStep = function(dir, pre){
  var elems = document.getElementsByClassName("step");
  
  this.stepLength = elems.length - 1;
  $scope.reportFormStepLength = this.stepLength;


  if (!$scope.reportFormStep && (pre == 'add')){
    $scope.reportFormStep = 0;
  }

  if (!$scope.reportDraftFormStep && (pre == 'draft')){
    $scope.reportDraftFormStep = 0;
  }
  // console.log(elems[$scope.reportFormStep]);

  if (dir == '+'){ 
    if (pre == 'add') {
      if ($scope.reportFormStep < this.stepLength){
        $scope.reportFormStep = $scope.reportFormStep + 1; 
      }
    }

    if (pre == 'draft') {
      if ($scope.reportDraftFormStep < this.stepLength){
        $scope.reportDraftFormStep = $scope.reportDraftFormStep + 1; 
      }
    }
    
  } else {
    if (pre == 'add') {
      if ($scope.reportFormStep > 0){
        $scope.reportFormStep = $scope.reportFormStep - 1;
      }
    }

    if (pre == 'draft') {
      if ($scope.reportDraftFormStep > 0){
        $scope.reportDraftFormStep = $scope.reportDraftFormStep - 1; 
      }
    }
  }

  if (pre == 'add') {
    this.showStep = $scope.reportFormStep;
  }

  if (pre == 'draft') {
    this.showStep = $scope.reportDraftFormStep;
  }
  

  for (var i = 0; i < 100; i++){
    
    if (pre == 'add'){
      $scope.currentStepStyle[i] = 'none';
    }

    if (pre == 'draft'){
      $scope.currentDraftStepStyle[i] = 'none';
    }
  }

  if (pre == 'add'){
    $scope.currentStepStyle[this.showStep] = 'block';
  }

  if (pre == 'draft'){
    $scope.currentDraftStepStyle[this.showStep] = 'block';
  }


};



  

 $scope.enableLocationAccuracy = function(){
    
      if (cordova.plugins){
        cordova.plugins.locationAccuracy.request(function (success){
          console.log("Successfully requested accuracy: "+success.message);
        }, function (error){
          console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
          if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
              if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                  cordova.plugins.diagnostic.switchToLocationSettings();
              }
          }
        }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      }

  };



  $scope.getLocation = function(loader, image){
    $scope.enableLocationAccuracy();
    if (loader != 'N'){
      $ionicLoading.show({template: '<i>Getting GPS Location....</i>'});
    }

    if (image != 'Y'){
      $scope.reportLon = "";
      $scope.reportLat = "";
    }
    

     cordova.plugins.locationServices.geolocation.getCurrentPosition(function (position){
        // console.log(position);
        
        if (image != 'Y'){
          $scope.reportLat  = parseFloat(position.coords.latitude);
          $scope.reportLon = parseFloat(position.coords.longitude);
        } else {
          var count = $scope.reportURI[$scope.photoField].length;
          var i = count - 1;
          $scope.reportEXIF[$scope.photoField][i] = JSON.stringify(position);
          console.log($scope.reportEXIF[$scope.photoField][i]);
          // return position;
        }
        $ionicLoading.hide();
      }, function(err){
        if (image != 'Y'){
          console.log("Location error!");
          $ionicPopup.alert({
            title: 'Location Error',
            template: 'An error occured trying to get your position'
          });
        }
        $ionicLoading.hide();

        console.log(err);
      },{ maximumAge: 1000, timeout: 10000, enableHighAccuracy: true});


  };


  $scope.getReportTime = function(field){
    alert('in here');
    alert(field);
  };





  


// USER RELATED FUNCTIONS
  $scope.logout = function(){
    $window.localStorage.clear();
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    Data.results = '';
    Data.loggedIn = false;
    
    $location.path("/app/login");

  };

  $scope.prepopulateAccount = function(){
    
    $scope.accountpreData = {};
    $scope.accountpreData.username = window.localStorage['username'];
    $scope.accountpreData.email = window.localStorage['mail'];
    

  };

  $scope.updateUser = function(acctData){

    console.log(acctData);
    this.username = acctData.username;
    this.email = acctData.email;
    this.userid = window.localStorage['uid'];


    this.updateUrl = $scope.baseUrl + 'appuser/update?u='+this.username+'&uid='+this.userid+'&m='+this.email; 
      
    $ionicLoading.show();
    $http.get(this.updateUrl, {cache: true}).
      success(function(updatedata, status, headers, config) {
          $ionicLoading.hide();
          $ionicPopup.alert({
             title: 'Status',
             template: updatedata.message
           });

          // alert('username: '+updatedata.user.name+' email: '+updatedata.user.mail);
          window.localStorage['username'] = updatedata.user.name;
          window.localStorage['mail'] = updatedata.user.mail;
 
          


      }).
      error(function(updatedata, status, headers, config) {
        $ionicLoading.hide();

        // alert('An error occured, please check your connection and try again.'); 
        $ionicPopup.alert({
           title: 'Connection Error',
           template: 'Please check your internet connection and try again.'
         });
      });
      
  };

    $scope.doLogin = function(loginData) {
      $ionicLoading.show();
      this.username = loginData.username;
      this.password = loginData.password;

     
      this.loginURL = $scope.baseUrl + 'appuser/signin?u='+this.username+'&p='+this.password; 
       $http.get(this.loginURL).
        success(function(userdata, status, headers, config) {
            
          console.log(userdata);
          $ionicLoading.hide();

          if(userdata['uid']){
            Data.user = userdata;
            window.localStorage['user'] = JSON.stringify(userdata);
            window.localStorage['username'] = userdata['name'];
            window.localStorage['uid'] = userdata['uid'];
            window.localStorage['mail'] = userdata['mail'];
            window.localStorage['roles'] = JSON.stringify(userdata['roles']);
            window.localStorage['roleExp'] = JSON.stringify(userdata['roleexpirations']);

            Data.loggedIn = true;

           
            $location.path("/app/dashboard");
            
            
          } else {
            $ionicPopup.alert({
             title: 'Login Error',
             template: 'Oops! Your username or password is invalid.'
           });
          } 

      }).
      error(function(userdata, status, headers, config) {
        $ionicLoading.hide();
        // console.log(status);
        /*
        console.log('Error');
        console.log(userdata);
        console.log(status);
        console.log(headers);
        console.log(config);
        */

        // alert('An error occured, please check your connection and try again.'); 
        $ionicPopup.alert({
           title: 'Connection Error',
           template: 'Please check your internet connection and try again.'
         });
      });
  };


  $scope.userStatus = function() {
      // $ionicLoading.show();
      
    this.statusURL = $scope.baseUrl + 'appuser/userstatus?uid='+window.localStorage['uid']; 
    $http.get(this.statusURL).
      success(function(user, status, headers, config) {
        console.log(user);
        if (user.status != 1) {
          $ionicPopup.alert({
             title: 'Blocked',
             template: 'Your account has been blocked, please contact your manager for details'
           });
          $scope.logout();
         }
        
    });
  };


  $scope.forgotPassword = function (loginData){

    this.email = loginData.email;    
    this.passwordUrl = $scope.baseUrl + 'appuser/password?m='+this.email; 

    $ionicLoading.show();
    $http.get(this.passwordUrl, {cache: true}).
      success(function(registerdata, status, headers, config) {
          
          $ionicPopup.alert({
             title: 'Status',
             template: registerdata.status
           });

          $ionicLoading.hide();

      }).
      error(function(registerdata, status, headers, config) {
        $ionicLoading.hide();
        $ionicPopup.alert({
           title: 'Connection Error',
           template: 'Please check your internet connection and try again.'
         });
      });
      

  };

  $scope.toggleFields = function (fieldid, fieldvalue){

    if (fieldid == "field_activity"){
      $scope.toggleFieldValue = fieldvalue;
    }

    if (fieldid == "field_state"){
      // console.log('updateLGAs');
      // get LGAs
      // console.log('LGAs',$scope.lgas);

      for (var parent in $scope.reportForm){
        this.childLength = $scope.reportForm[parent].length;
        for (var key = 0; key < this.childLength; key++){
          if ($scope.reportForm[parent][key].name == "field_lga"){
              
              var key1 = parent;
              var key2 = key;
              
              // $scope.lgas = $scope.reportForm[parent][key];
              // var fieldLGA = $scope.lgas;
          }
        }
      }


      console.log('LGA', Data.lga);

      var fieldLGA = Data.lga;
      var lgaOptions = fieldLGA.listoptions;
      var newListOptions = {};

      for (var label in lgaOptions){
        if (label.indexOf(fieldvalue+':') == '0'){
          newListOptions[label] = lgaOptions[label];
        }
      }

      $scope.reportForm[key1][key2].listoptions = {};
      $scope.reportForm[key1][key2].listoptions = newListOptions;
      // console.log(lgaOptions);
      console.log(newListOptions);
    }
    
  };

    $scope.updateForms = function(){
      $ionicLoading.show();
      $scope.buildForm('Y');
    /*
    $ionicPopup.alert({
       title: 'Update Successful',
       template: 'Forms have successfully been updated.'
     });
     */
  }

  $scope.min = function(arr) {
    return $filter('min')
      ($filter('map')(arr, 'parentweight'));
  };

  $scope.filterReportGroup = function(item){
    return 
  }



  $scope.realClock = {
    
    updateTime: function() {
      // var c = document.getElementById('clock');
      $timeout(function (){
        $scope.realTime = $filter('date')(Date.now(), 'mediumTime');
      });
      /*
      var now = new Date();
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var secs = now.getSeconds();
      $scope.realTime = [$scope.realClock.twoDigits(hours), $scope.realClock.twoDigits(minutes), $scope.realClock.twoDigits(secs)].join(":");
      // $scope.realtimeValue = now;
      var msecs = (secs * 1000 + now.getMilliseconds());
      var rot = 360/30000 * msecs;
      var rotS = '' + rot + "deg";
      // c.style['-webkit-transform'] = 'rotate(' +  rotS + ')';
      */
    },
    startClock: function() {
      window.setInterval(function(){
        // $timeout(function (){
          $scope.realClock.updateTime();
           console.log('is this running?');
        //  });
      }, 100);
      /*
      $scope.stopClock = $interval(function() {
        $scope.realClock.updateTime();
      }, 100);
      */
      
      /*
      $timeout(function (){
        $scope.realClock.updateTime();
       
      }, 100); 
      */
    }

  };

  $scope.takePhoto = function(fieldName) {
        var options = {
            quality : 70,
            destinationType : Camera.DestinationType.DATA_URL,
            sourceType : Camera.PictureSourceType.CAMERA,
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1024,
            targetHeight: 1024,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };


        $scope.photoField = fieldName;

        $cordovaCamera.getPicture(options).then(function(imageData) {

            console.log(imageData.json_metadata);
            if ($scope.reportURI == 'undefined'  || $scope.reportURI == undefined){
              $scope.reportURI = {};
            }

            if ($scope.reportEXIF == 'undefined'  || $scope.reportEXIF == undefined){
              $scope.reportEXIF = {};
            }

            if ($scope.reportURI[$scope.photoField] == 'undefined' || $scope.reportURI[$scope.photoField] == undefined){
              $scope.reportURI[$scope.photoField] = [];
            }

            if ($scope.reportEXIF[$scope.photoField] == 'undefined' || $scope.reportEXIF[$scope.photoField] == undefined){
              $scope.reportEXIF[$scope.photoField] = [];
            }

            this.imgData = "data:image/jpeg;base64," + imageData;
            $scope.reportURI[$scope.photoField].push(this.imgData);
            $scope.getLocation('N', 'Y');
            // console.log(this.imageExif);
            // console.log($scope.reportURI[$scope.photoField].length);
            // $scope.reportData.customerURI = $scope.customerURI;
         
        }, function(err) {
            // An error occured. Show a message to the user
        });
    };

  $scope.deletePic = function (name){
    this.deleteindex = $scope.deleteIndex[name];
    if (this.deleteindex > -1){
      $scope.reportURI[name].splice(this.deleteindex, 1);
      $scope.closePicPreview();
    }

  };

  $scope.getDraftCount = function(){
    // alert('in here');
    $scope.draftCount = 0;
    if (window.localStorage['drafts'] != '' && window.localStorage['drafts'] != undefined){
      Data.drafts = JSON.parse(window.localStorage['drafts']);
    }

    $scope.draftCount = Data.drafts.length;
  };


  $scope.cleanDrafts = function(){
    if (window.localStorage['drafts'] != '' && window.localStorage['drafts'] != undefined){
      this.drafts = JSON.parse(window.localStorage['drafts']);
      for (this.i = 0; this.i < this.drafts.length; this.i++){
       
        // console.log(this.drafts[this.i]);
        if (this.drafts[this.i] == null || this.drafts[this.i] == '' || this.drafts[this.i] == undefined || this.drafts[this.i].did == undefined){
          this.drafts.splice(this.i, 1);
          this.i--;
        }
      }
      window.localStorage['drafts'] = JSON.stringify(this.drafts);
    }
  };

  $scope.getDrafts = function(){
    console.log('in here');
    $scope.cleanDrafts();
    $scope.reportDraftFormStep = 0;
    
    // console.log(window.localStorage['drafts']);
    /*

    this.drafts.splice(did, 1);
    */
    if (window.localStorage['drafts'] != '' && window.localStorage['drafts'] != undefined && window.localStorage['drafts'] != 'undefined'){
      Data.drafts = JSON.parse(window.localStorage['drafts']);
      // $scope.drafts = Data.drafts;

    }

    $scope.reportData.draftCount = Data.drafts.length;
    $scope.currentDraft = parseInt($stateParams.did);

  };



  $scope.newReport = function(dData, draft){

    
    if (draft == 'Y'){
      var reportData = $scope.reportDraft;
    } else {
      var reportData = dData; 
    }

    console.log($scope.reportForm);

    for (var parent in $scope.reportForm){
      this.childLength = $scope.reportForm[parent].length;
      for (var key = 0; key < this.childLength; key++){
       
        if ($scope.reportForm[parent][key] && $scope.reportForm[parent][key].type == "datestamp" &&  $scope.reportForm[parent][key].name != "field_time_in" && $scope.reportForm[parent][key].name != "field_time_out"){
          this.fieldName  = $scope.reportForm[parent][key].name;
          console.log(this.fieldName);
          this.datestring = reportData.fields[this.fieldName];
          if (this.datestring && this.datestring != ''){
            var dateObj = new Date(this.datestring);
            // console.log(dateObj);
            this.datestamp = dateObj.getTime();
            console.log('before error');
            reportData.fields[this.fieldName] = this.datestamp;
            console.log('after error');
            this.datestamp = '';
            this.datestring = '';
            dateObj = '';
            // console.log(this.datestamp);
          }
          
        }


      }
    }

    

    var required = $scope.requiredFormFields();
    // console.log(dData.$invalid);
    // console.log(required);
    // var required = false;
    if (dData.$invalid || !required){

      if (!$scope.reportLat || !$scope.reportLon){
        var alertMessage = 'There was a problem getting your GPS location, please enable location on your phone settings and re-submit this form.';
      } else {
        var alertMessage = 'Please fill in ALL required fields.';
      }
      $ionicPopup.alert({
       title: 'Required Fields',
       template: alertMessage
      });
    } else {
      $ionicLoading.show();
      reportData.fields.uid = window.localStorage['uid'];
      reportData.fields.field_lat = $scope.reportLat;
      reportData.fields.field_lon = $scope.reportLon;
      this.params = reportData.fields;

      // save signature
      if ($scope.sigObj){
        for (var parent in $scope.reportForm){
          for (var key in parent){
            if ($scope.reportForm[parent][key] && $scope.reportForm[parent][key].type == "image" && $scope.reportForm[parent][key].groupid == "signature"){
              this.fieldName  = $scope.reportForm[parent][key].name;
              // var sigid = 'signature_'+field;
              $scope.saveCanvas(this.fieldName);
            }


          }
        }
      }  

      this.addURL = $scope.baseUrl + 'appuser/addreport';


      $http.post(this.addURL, this.params).
        success(function(newreport, status, headers, config) {        

          if ($scope.reportURI != 'undefined' && $scope.reportURI != undefined){
            
            // $scope.savePhoto($scope.nodeid);
            $scope.imageFormData = new FormData();
            $scope.nodeid = newreport.nid;
            // var uploads = {};

            $scope.imageFormData.append("nid", $scope.nodeid);
            for (var key in $scope.reportURI){
              this.photoLength = $scope.reportURI[key].length;
              console.log('photo length: '+this.photoLength);
              // uploads[key] = [];
              $scope.imageFormData.append("fields[]", key);
              for (var i = 0; i < this.photoLength; i++){ 
                // var the_file = new Blob([$scope.reportURI[key][i]],  {type: 'image/jpeg', encoding: 'utf-8'});
                // console.log($scope.reportURI[key][i]);
                var the_file = $scope.dataURItoBlob($scope.reportURI[key][i]);

                this.fileName =  key+'_'+ $scope.nodeid+'_'+Math.floor(1000 + Math.random() * 9000)+'_'+Math.floor(1000 + Math.random() * 9000);
                $scope.imageFormData.append("uploads[]", the_file, this.fileName);

                if ($scope.reportEXIF && $scope.reportEXIF[key] && $scope.reportEXIF[key][i]){
                  var the_file_data = $scope.reportEXIF[key][i];
                } else {
                  var the_file_data = "{}";
                }


                $scope.imageFormData.append("uploadsData[]", the_file_data);
                
              }

            }

             this.uploadPhotosURL = $scope.baseUrl + 'appuser/uploadimages';
             $http({
                url: this.uploadPhotosURL,
                method: "POST",
                data: $scope.imageFormData,
                headers: {
                  "Content-Type":undefined,
                }
            }).
             // $http.post(this.uploadPhotosURL, $scope.imageFormData, headers: {"Content-Type":undefined}).
                success(function(newreport, status, headers, config) {
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                     title: 'Success',
                     template: 'Your report has successfully been submitted.'
                   });

                  $location.path('/app/dashboard');
                  if (draft == 'Y'){
                    $scope.deleteDraft($stateParams.did);
                  }
                 }).
                error(function(data, status, headers, config) {
                  console.log(data);
                  $ionicLoading.hide();
                  $ionicPopup.alert({
                     title: 'Connection Error',
                     template: 'There was an error saving your images to this report, please re-submit the report again or save to your drafts and submit later.'
                   });
                  $ionicLoading.hide();
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                });

          } else {
            $ionicLoading.hide();
            $ionicPopup.alert({
               title: 'Success',
               template: 'Your report has successfully been submitted.'
             });

            $location.path('/app/dashboard');
            if (draft == 'Y'){
              $scope.deleteDraft($stateParams.did);
            }
          }

        }).
        error(function(data, status, headers, config) {
          console.log(data);
          $ionicLoading.hide();
          $ionicPopup.alert({
             title: 'Connection Error',
             template: 'Please check your internet connection and try again or save to your drafts and submit later'
           });
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }
  
  };


  $scope.dataURItoBlob = function(dataURI){
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++)
    {
        ia[i] = byteString.charCodeAt(i);
    }

    var bb = new Blob([ab], { "type": mimeString });
    return bb;
  };

$scope.saveDraft = function(data, draftMode){
    // console.log($scope.reportDraft);
    // console.log(reportData);
    if (draftMode == "Y"){
      var reportData = $scope.reportDraft;
      reportData.did = $stateParams.did;
    } else {
      var reportData = data;
      reportData.did = $scope.draftCount;
    }
   
    // var imagedraftkey = 'imagedraft_'+reportData.did;

    if (!reportData.fields){
      reportData.fields = [];
    }

    
    for (var parent in $scope.reportForm){
      for (var key in parent){
        if ($scope.reportForm[parent][key] && $scope.reportForm[parent][key].type == "image" && $scope.reportForm[parent][key].groupid == "signature"){
          console.log($scope.reportForm[parent][key].name);
          $scope.saveCanvas($scope.reportForm[parent][key].name);
        }
      }
    }


    if ($scope.reportURI != 'undefined' && $scope.reportURI != undefined){
        for (var key in $scope.reportURI){
          this.imageLength =  $scope.reportURI[key].length;
          var imagedraftkey = key+reportData.did;
          var imagedraftlength = key+reportData.did+'_length';

          window.localStorage[imagedraftlength] = this.imageLength;         

          for (var i = 0; i < this.imageLength; i++){
            this.newkey = imagedraftkey+'_'+i;
            this.exifkey = this.newkey+'_exif';
            window.localStorage[this.newkey] = $scope.reportURI[key][i];
            if ($scope.reportEXIF[key] &&  $scope.reportEXIF[key][i]){
              window.localStorage[this.exifkey] = $scope.reportEXIF[key][i];
            }
            
            // console.log(window.localStorage[this.newkey]);
          }



        }
        // console.log(window.localStorage[imagedraftkey]);
        $scope.reportURI = {};
    }

    


    this.currentDraft = reportData.did;
    this.drafts = [];

    if (window.localStorage['drafts'] != '' && window.localStorage['drafts'] != undefined){
      this.drafts = JSON.parse(window.localStorage['drafts']);
    }
    
    this.drafts[this.currentDraft] = reportData.fields;
    this.drafts[this.currentDraft].did = reportData.did;
    console.log("In save drafts");
    console.log(this.drafts[this.currentDraft]);
    
    this.draftStringify = JSON.stringify(this.drafts);
    window.localStorage['drafts'] = this.draftStringify;
    // console.log(window.localStorage['drafts']);

    $ionicPopup.alert({
       title: 'Draft Saved',
       template: 'Your draft has been saved successfully.'
     });

    $scope.cleanForm('draft');
    $location.path('/app/dashboard');

    
  };

  $scope.deleteDraft = function(did){
    // alert(did);
    this.drafts = [];
    this.drafts = JSON.parse(window.localStorage['drafts']);
    this.drafts.splice(did, 1);
    
    for (var parent in $scope.reportForm){

      for (var key in parent){


        if ($scope.reportForm[parent][key] && $scope.reportForm[parent][key].type == "image"){
          this.fieldName  = $scope.reportForm[parent][key].name;
          var imagedraftkey = this.fieldName+$stateParams.did;
          var imagedraftlength = this.fieldName+$stateParams.did+'_length';
          window.localStorage[imagedraftlength] = '';
          window.localStorage[imagedraftkey] = '';
        }
      }
    }

    window.localStorage['drafts'] = JSON.stringify(this.drafts);
    
    Data.drafts = this.drafts;
     $ionicPopup.alert({
       title: 'Draft Deleted',
       template: 'Your draft has been deleted successfully.'
     });

    $scope.cleanForm('draft');
    $location.path('/app/dashboard');
    // $scope.drafts = Data.drafts;
   
  };

  $scope.loadDraft = function(){
    this.loadId = $stateParams.did;
    // this.imagedraftkey = 'imagedraft_'+this.loadId;
    

    // alert(this.loadId);
    if (!$scope.reportDraft){
      $scope.reportDraft = {};
    }
    
    // console.log($scope.drafts);
    $scope.reportDraft.fields  = $scope.drafts[this.loadId];
    // alert('in here');

    console.log($scope.reportDraft);

    if ($scope.reportDraft.fields && $scope.reportDraft.fields.field_lat){
      $scope.reportLon = $scope.reportDraft.fields.field_lat;
    }
    if ($scope.reportDraft.fields && $scope.reportDraft.fields.field_lon){
      $scope.reportLat = $scope.reportDraft.fields.field_lon;
    }
   /*
    if ($scope.reportURI != 'undefined' && $scope.reportURI != undefined){
        for (var key in $scope.reportURI){
          reportData.fields[key] = $scope.reportURI[key];
        }
        $scope.reportURI = {};
        $scope.reportDataTime = {};
    }
    */

    if (!$scope.reportURI){
      $scope.reportURI = {};

    }

    if (!$scope.reportEXIF){
      $scope.reportEXIF = {};
    }

    if (!$scope.reportDataTime){
      $scope.reportDataTime = {};
    }

    // console.log($scope.reportForm);

    for (var parent in $scope.reportForm){

      for (var key in parent){


        if ($scope.reportForm[parent][key] && $scope.reportForm[parent][key].type == "image"){
          this.fieldName  = $scope.reportForm[parent][key].name;
          $scope.reportURI[this.fieldName] = [];
          $scope.reportEXIF[this.fieldName] = [];
          // var imagedraftkey = this.fieldName+$stateParams.did;

          var imagedraftkey = this.fieldName+$stateParams.did;
          var imagedraftlength = this.fieldName+$stateParams.did+'_length';
          var imagelength = window.localStorage[imagedraftlength];

          // console.log('length');
          // console.log(imagelength);

          if (imagelength && imagelength > 0){
            for (var i = 0; i < imagelength; i++){
               this.newkey = imagedraftkey+'_'+i;
               this.exifkey = this.newkey+'_exif';

               // console.log(this.newkey);
               // console.log(window.localStorage[this.newkey]);
               $scope.reportURI[this.fieldName].push(window.localStorage[this.newkey]);
               $scope.reportEXIF[this.fieldName].push(window.localStorage[this.exifkey]);
             }

          }
          
          
        }


        if ($scope.reportForm[parent][key] && $scope.reportForm[parent][key].type == "datestamp"){
          this.fieldName  = $scope.reportForm[parent][key].name;
          if ($scope.reportDraft.fields && $scope.reportDraft.fields[this.fieldName]){
            $scope.reportDataTime[this.fieldName] = $scope.reportDraft.fields[this.fieldName];
          }
          this.fieldName = '';
        }
      }

    }

    // $scope.reportDataTime[]

    // console.log($scope.reportDraft);
    

    // console.log($scope.customerDraft.fields.field_signature);

    /*
    if ($scope.reportDraft.fields.field_signature != '' && $scope.reportDraft.fields.field_signature != undefined && $scope.reportDraft.fields.field_signature != 'undefined'){
      $scope.customerURI.field_signature = $scope.customerDraft.fields.field_signature;
    }

    if ($scope.customerDraft.fields.field_passport_photo != '' && $scope.customerDraft.fields.field_passport_photo != undefined && $scope.customerDraft.fields.field_passport_photo != 'undefined'){
      $scope.customerURI.field_passport_photo = $scope.customerDraft.fields.field_passport_photo;
    }
    */

   
  };


  $scope.closePicPreview = function(){
    $scope.imgPreview = '';
    $scope.showLoader = [];
    $scope.showImgButtons = [];
    $scope.deleteIndex = [];
  };

  $scope.previewImg = function (index, name){
    $scope.imgPreview = '';
    $scope.showLoader = [];
    $scope.showImgButtons = [];
    $scope.showLoader[name] = true;
    $scope.deleteIndex = [];
    $scope.deleteIndex[name] = index;
    $timeout(function (){
      $scope.imgPreview = $scope.reportURI[name][index];
      $scope.showImgButtons[name] = true;
    },1700);
    
  };

  /*
  $scope.setUnixTime = function(field_name){
    console.log('in here');
    console.log(field_name);
    // console.log($scope.reportData);
    var zInputTime = document.getElementById(field_name);
    var zInputTimeAngular = angular.element(zInputTime);
    console.log(zInputTimeAngular.value);
    console.log(zInputTimeAngular.valueAsDate);
  };

  */

  $scope.setReportTime = function(field_name, draft){
    if (field_name != ''){
      $scope.reportDataTime[field_name] = parseInt(Date.now());
      // console.log($scope.reportData.fields[field_name]);

      if (!$scope.reportData){
        $scope.reportData = {};
      }

      if (draft == 'Y'){
        if (!$scope.reportDraft.fields){
          $scope.reportDraft.fields = {};
        }
        $scope.reportDraft.fields[field_name] = parseInt(Date.now());
      } else {
        if (!$scope.reportData.fields){
          $scope.reportData.fields = {};
        }
        $scope.reportData.fields[field_name] = parseInt(Date.now());
      }
      
    }
  };

  $scope.filterData = function (item) {
    // this.reportArray = [];
    console.log(item);
    return $scope.reportFormArray;
  };



})

.directive('canvasDir', function ($compile) {
    return function (scope, element, attrs) {
        var id = attrs.id;
        // console.log(element[0]);
        scope.initSig(element[0], id);
    };
})



.filter('filterFormFields', function($filter) {
  return function(input, val) {

 
    var inputArray = [];
    
    
    for(var item in input) {
      if (input[item][0].groupparent == '' || input[item][0].groupparent == val ){
        inputArray.push(input[item]);
      }
    }

    
    return inputArray;
     


  };
});
